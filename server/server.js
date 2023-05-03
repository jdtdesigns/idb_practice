const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3333;

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../client/dist/index.html'));
});

app.listen(PORT);