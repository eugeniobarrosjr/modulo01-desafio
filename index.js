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

// TODO: PUT  /projects/:id
// TODO: DELETE  /projects/:id
server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { project } = req;

  projects = projects.filter((p) => p.id !== project.id);
  return res.send();
});
// TODO: POST  /projects/:id/tasks

server.listen(3000);
