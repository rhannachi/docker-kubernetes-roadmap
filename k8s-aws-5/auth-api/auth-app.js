const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(authRoutes);

app.get('/healthcheck', (req, res) => {
  console.log("GET /healthcheck OK")
  res.status(200).send('OK');
});

app.use((err, req, res, next) => {
  console.log(err);
  let code = 500;
  let message = 'Something went wrong.';
  if (err.code) {
    code = err.code;
  }

  if (err.message) {
    message = err.message;
  }
  res.status(code).json({ message: message });
});

app.listen(3000);
console.log('auth listening on port 3000!');
