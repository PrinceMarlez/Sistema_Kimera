const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: String,
  cpf: String,
  endereco: String,
  servico: { type: String, required: true },
  descricao: String,
  dataEntrega: Date,
  status: String,
});

module.exports = mongoose.model('Registro', registroSchema);
