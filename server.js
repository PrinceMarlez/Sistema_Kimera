const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const registroRoutes = require('./routes/RegistroRoutes');

const app = express();

// Middlewares para leitura de JSON e CORS
app.use(express.json());
app.use(cors());

// Rota para o registro
app.use('/registros', registroRoutes);

// Conectar ao MongoDB
const DB_USER = 'admin';
const DB_PASSWORD = encodeURIComponent('VMLQdOC0YJp3Hy2I');
const DB_CLUSTER = 'dbd.emzpyiq.mongodb.net';
const DB_NAME = 'DBD';

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB conectado');
    // Iniciar o servidor após conexão com o banco
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
