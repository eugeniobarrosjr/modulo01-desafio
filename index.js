const express = require('express');

const server = express();

server.use(express.json());

let projects = [];
let requests = 0;

function logTotalRequestCount(_, _, next) {
  requests++;
  console.log('Requests: ' + requests);

  return next();
}

server.use(logTotalRequestCount);

function checkProjectInArray(req, res, next) {
  const project = projects.find((p) => p.id === req.params.id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  req.project = project;

  return next();
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: [],
  };

  projects.push(project);

  return res.json(project);
});

server.get('/projects', (_, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  const index = projects.findIndex(p => p.id === project.id);
  project.title = title;

  projects[index] = project;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { project } = req;

  projects = projects.filter((p) => p.id !== project.id);
  return res.send();
});

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  const index = projects.findIndex(p => p.id === project.id);
  project.tasks.push(title);

  projects[index] = project;

  return res.json(project);

})

server.listen(3000);
