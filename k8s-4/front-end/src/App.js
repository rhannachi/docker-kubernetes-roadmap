import React, { useState, useEffect, useCallback } from 'react';

import './App.css';
import TaskList from './components/TaskList';
import NewTask from './components/NewTask';

const TASKS_BASE_API_URL = process.env.REACT_APP_TASKS_API_URL
console.log('REACT_APP_TASKS_API_URL: ', TASKS_BASE_API_URL);

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(function () {
    fetch(`${TASKS_BASE_API_URL}/tasks`, {
      headers: {
        'Authorization': 'Bearer abc'
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonData) {
        setTasks(jsonData.tasks);
      });
  }, []);

  useEffect(
    function () {
      fetchTasks();
    },
    [fetchTasks]
  );

  function addTaskHandler(task) {
    fetch(`${TASKS_BASE_API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer abc',
      },
      body: JSON.stringify(task),
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (resData) {
        console.log(resData);
      });
  }

  return (
    <div className='App'>
      <section>
        <NewTask onAddTask={addTaskHandler} />
      </section>
      <section>
        <button onClick={fetchTasks}>Fetch Tasks</button>
        <TaskList tasks={tasks} />
      </section>
    </div>
  );
}

export default App;
