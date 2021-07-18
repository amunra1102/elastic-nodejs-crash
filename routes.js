const express = require('express');
const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({ node: 'http://localhost:9200' });
const router = express.Router();

router.get('/products', function (req, res) {
  elasticClient.search({
    index: 'products',
    body: {}
  }).then(resp => {
    const { body } = resp;
    console.log(body.hits.hits);
    res.status(200).json({ products: body.hits.hits });
  })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/products/:id', function (req, res) {
  elasticClient.search({
    index: 'products',
    body: {
      query: {
        match: {
          sku: req.params.id
        }
      }
    }
  }).then(resp => {
    const { body } = resp;
    console.log(body.hits.hits);
    res.status(200).json({ product: body.hits.hits });
  })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/products', function (req, res) {
  elasticClient
    .index({
      index: 'products',
      body: req.body
    })
    .then(() => res.status(200).json({ product: req.body}))
    .catch(err => res.status(500).json({ msg: err.message }));
});

router.put('/products/:id', function (req, res) {
  elasticClient.update({
    index: 'products',
    id: req.params.id,
    body: {
      doc: {
        ...req.body
      }
    }
  }).then(resp => {
    const { body } = resp;
    console.log(body.result);
    res.status(200).json({ msg: body.result });
  })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.delete('/products/:id', function (req, res) {
  elasticClient.delete({
    index: 'products',
    id: req.params.id
  }).then(resp => {
    const { body } = resp;
    console.log(body.result);
    res.status(200).json({ msg: body.result });
  })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.use((req, res, next) => {
  elasticClient
    .index({
      index: 'logs',
      body: {
        url: req.url,
        method: req.method
      }
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));

  next();
});

module.exports = router;
