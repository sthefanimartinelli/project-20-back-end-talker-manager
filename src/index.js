const express = require('express');
const fs = require('fs').promises;
const path = require('path');
// const randomToken = require('../utils/randomToken.js');

const TALKERS_DATA_PATH = './talker.json';

const filePath = path.resolve(__dirname, TALKERS_DATA_PATH);

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// Requisito 1 
app.get('/talker', async (req, res) => {
  try {
    const data = await fs.readFile(filePath);
    const talkers = JSON.parse(data);
    if (talkers.length > 0) {
      return res.status(200).json(talkers);
    }
    return res.status(200).json([]);
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
});

// Requisito 2
app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(filePath);
    const talkers = JSON.parse(data);
    const specificTalker = talkers.find((talker) => talker.id === Number(id));
    if (specificTalker) {
      return res.status(200).json(specificTalker);
    } 
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
});

// Requisito 3

const randomToken = (length) => {
  const range = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  const newToken = [];  
  for (let index = 0; index < length; index += 1) {
      const currentChar = (Math.random() * (range.length - 1)).toFixed(0);
      newToken[index] = range[currentChar];
  }
  return newToken.join('');
};

app.post('/login', (req, res) => {
  // const { email, password } = req.body;
  const token = randomToken(16);
  return res.status(200).json({ token });
});