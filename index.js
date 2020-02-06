/*
INICIANDO O SERVER: yarn dev
*/

const express = require('express');

const server = express();

server.use(express.json());
server.listen(3000);

// array de usuários iniciais
const users = ['Diego', 'Robson', 'Victor'];

// middleware p/ log de requisições
server.use((req, res, next) => {
  // inicia um count p/ a requisição
  console.time('Request');
  // faz o log no terminal
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  // pula p/ o próx. middleware na sequência
  next();
  // exibe o count de duração da requisição
  console.timeEnd('Request');
});

// middleware p/ certificar existência de nome de user
function checkUserExists(req, res, next) {
  // a resposta é gerada diretamente na requisição
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }
  // se existe nome de user, pula p/ próx. middleware na sequência
  return next();
}

// middleware p/ certificar existência de id no array
function checkUserInArray(req, res, next) {
  // armazena a resposta numa constante
  const user = users[req.params.index];
  // a resposta é gerada diretamente na requisição
  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }
  // se existe user, grava essa informação na requisição
  req.user = user;
  // se existe id no array, pula p/ próx. middleware na sequência
  return next();
}

// requisição p/ listar todos os usuários
server.get('/users', (req, res) =>
  // a resposta é gerada diretamente na requisição
  res.json(users)
);

// requisição p/ listar usuário pelo index no vetor
server.get('/users/:index', checkUserInArray, (req, res) =>
  // a resposta é gerada diretamente na requisição
  res.json(req.user)
);

// requisição p/ adicionar novo usuário
server.post('/users', checkUserExists, (req, res) => {
  // extrai o name do user do body da requisição
  const { name } = req.body;
  // adiciona user no array
  users.push(name);
  // a resposta é gerada diretamente na requisição
  return res.json(users);
});

// requisição p/ editar user pelo index no array
// perceba que posso passar quantos middlewares desejar
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  // extrai index e name do user da requisição
  const { index } = req.params;
  const { name } = req.body;
  // lembra do name que armazenei em uma constante?
  users[index] = name;
  // a resposta é gerada diretamente na requisição
  return res.json(users);
});

// requisição p /deletar user pelo index no array
server.delete('/users/:index', checkUserInArray, (req, res) => {
  // extrai index do user da requisição
  const { index } = req.params;
  // remove user de index especificado do array
  users.splice(index, 1);
  // a resposta é gerada diretamente na requisição
  return res.send();
});

/*
REQUISIÇÕES UTILIZADAS

listar todos users:
    GET: http://localhost:3000/users
listar um user:
    GET: http://localhost:3000/users/indexDesejado
criar um user:
    POST: http://localhost:3000/users
editar um user:
    PUT: http://localhost:3000/users/indexDesejado
deletar um user:
    DEL: http://localhost:3000/users/indexDesejado

*/
