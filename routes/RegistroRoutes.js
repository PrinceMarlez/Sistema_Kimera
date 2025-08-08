const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');

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
    const { nome, telefone, cpf, endereco, servico, descricao, dataEntrega, status } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

    const novoRegistro = new Registro({
      nome,
      telefone,
      cpf,
      endereco,
      servico,
      descricao,
      dataEntrega,
      status
    });

    await novoRegistro.save();
    res.status(201).json({ message: 'Registro criado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar registro' });
  }
});

// Buscar registros com filtros (nome e cpf parciais, case-insensitive)
router.get('/search', async (req, res) => {
  try {
    const { nome, cpf } = req.query;
    const query = {};
    if (nome) query.nome = { $regex: nome, $options: 'i' };
    if (cpf) query.cpf = { $regex: cpf, $options: 'i' };

    const registros = await Registro.find(query);
    res.status(200).json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
});

// Atualizar registro por ID
router.put('/:id', async (req, res) => {
  try {
    const { nome, telefone, cpf, endereco, servico, descricao, dataEntrega, status } = req.body;
    const registro = await Registro.findByIdAndUpdate(
      req.params.id,
      { nome, telefone, cpf, endereco, servico, descricao, dataEntrega, status },
      { new: true }
    );
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
