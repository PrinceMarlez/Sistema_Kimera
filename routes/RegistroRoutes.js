const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');

// Validação simples para evitar código repetido
function validarRegistro(body) {
  const { nome, servico } = body;
  const erros = [];
  if (!nome || nome.trim() === '') erros.push('Nome é obrigatório');
  if (!servico || servico.trim() === '') erros.push('Serviço é obrigatório');
  return erros;
}

// Buscar todos os registros
router.get('/', async (req, res) => {
  try {
    const registros = await Registro.find();
    res.status(200).json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
});

// Criar um novo registro
router.post('/', async (req, res) => {
  try {
    const erros = validarRegistro(req.body);
    if (erros.length) return res.status(400).json({ error: erros.join(', ') });

    const novoRegistro = new Registro(req.body);
    await novoRegistro.save();
    res.status(201).json({ message: 'Registro criado com sucesso!', registro: novoRegistro });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar registro' });
  }
});

// Buscar registros com filtros
router.get('/search', async (req, res) => {
  try {
    const { nome, telefone, cpf } = req.query;
    const query = {};
    if (nome) query.nome = new RegExp(nome, 'i'); // busca case-insensitive e parcial
    if (telefone) query.telefone = telefone;
    if (cpf) query.cpf = cpf;

    const registros = await Registro.find(query);
    res.status(200).json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
});

// Buscar por status
router.get('/status/:status', async (req, res) => {
  try {
    const registros = await Registro.find({ status: req.params.status });
    res.status(200).json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registros por status' });
  }
});

// Buscar por serviço
router.get('/servico/:servico', async (req, res) => {
  try {
    const registros = await Registro.find({ servico: req.params.servico });
    res.status(200).json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registros por serviço' });
  }
});

// Buscar registro por ID
router.get('/:id', async (req, res) => {
  try {
    const registro = await Registro.findById(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro não encontrado' });
    res.status(200).json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registro por ID' });
  }
});

// Atualizar registro por ID
router.put('/:id', async (req, res) => {
  try {
    const erros = validarRegistro(req.body);
    if (erros.length) return res.status(400).json({ error: erros.join(', ') });

    const registro = await Registro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!registro) return res.status(404).json({ error: 'Registro não encontrado' });
    res.status(200).json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar registro' });
  }
});

// Deletar registro por ID
router.delete('/:id', async (req, res) => {
  try {
    const registro = await Registro.findByIdAndDelete(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro não encontrado' });
    res.status(200).json({ message: 'Registro deletado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar registro' });
  }
});

module.exports = router;
