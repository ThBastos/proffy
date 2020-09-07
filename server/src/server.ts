import express from 'express';

const app = express();

app.use(express.json());

// GET: Buscar ou listar alguma informação
// POST: Criar alguma nova informação
// PUT: Atualizar uma informação existente
// DELETE: Deletar uma informação existente

// Corpo (Request body): Dados para criação ou atualização de um registro
// Route Params: Identificar qual recurso eu quero atualizar ou deletar
// Query Params: 

app.get('/users', (request, response) => {
  
  // console.log(request.body);
  // console.log(request.params); /users/:id
  // console.log(request.query); /users?page=2&sort=name
  
  return response.json({ message: "Hello World." });
})

// http://localhost:3333
app.listen(3333);
