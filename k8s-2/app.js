const express = require('express');

const app = express();

app.get('/healthcheck', (req, res) => {
  console.log("GET /healthcheck OK")
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello from this NodeJS K82 app!</h1>
    <p>Try sending a request to /error and see what happens</p>
  `);
});

app.get('/error', (req, res) => {
  process.exit(1);
});

app.listen(3000);
