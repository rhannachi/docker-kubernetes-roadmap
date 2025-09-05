const path = require('path');
const fs = require('fs');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const AUTH_API_URL = process.env.AUTH_API_URL
const TASKS_FOLDER = process.env.TASKS_FOLDER
console.log('AUTH_API_URL: ', AUTH_API_URL);
console.log('TASKS_FOLDER: ', TASKS_FOLDER);

const filePath = path.join(__dirname, TASKS_FOLDER, 'tasks.txt');

const app = express();
// pour autoriser UNE origine spécifique "Front-End" :
app.use(cors({
  // TODO !!!!!!!!!!!!
  origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());

app.get('/healthcheck', (req, res) => {
  console.log("GET /healthcheck OK")
  res.status(200).send('OK');
});

const extractAndVerifyToken = async (headers) => {
  if (!headers.authorization) {
    throw new Error('No token provided.');
  }
  const token = headers.authorization.split(' ')[1]; // expects Bearer TOKEN

  const response = await axios.get(`${AUTH_API_URL}/verify-token/` + token);
  return response.data.uid;
};

app.get('/tasks', async (req, res) => {
  try {
    const uid = await extractAndVerifyToken(req.headers); // we don't really need the uid
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Loading the tasks failed.' });
      }
      const strData = data.toString();
      const entries = strData.split('TASK_SPLIT');
      entries.pop(); // remove last, empty entry
      console.log(entries);
      const tasks = entries.map((json) => JSON.parse(json));
      res.status(200).json({ message: 'Tasks loaded.', tasks: tasks });
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: err.message || 'Failed to load tasks.' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const uid = await extractAndVerifyToken(req.headers); // we don't really need the uid
    const text = req.body.text;
    const title = req.body.title;
    const task = { title, text };
    const jsonTask = JSON.stringify(task);
    fs.appendFile(filePath, jsonTask + 'TASK_SPLIT', (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Storing the task failed.' });
      }
      res.status(201).json({ message: 'Task stored.', createdTask: task });
    });
  } catch (err) {
    return res.status(401).json({ message: 'Could not verify token.' });
  }
});

app.listen(8000);
console.log('tasks API listen on port ', 8000);