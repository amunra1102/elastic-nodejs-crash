require('dotenv').config();

const express = require('express');
const app = express();

const routers = require('./routes');

app.use(express.json());
app.use('/api', routers);

app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}`));
