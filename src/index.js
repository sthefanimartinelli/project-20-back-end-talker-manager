const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { randomToken } = require('./randomToken');
const { validateEmail, validatePassword, tokenValidation, 
  nameValidation, 
  ageValidation, 
  watchedAtValidation, 
  talkValidation, 
  rateValidation } = require('./validations');

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

// Requisito 8
app.get('/talker/search', tokenValidation, async (req, res) => {
  try {
    const { q } = req.query;
    const data = await fs.readFile(filePath, 'utf8');
    const talkers = JSON.parse(data).filter((talker) => talker.name.includes(q));
    return res.status(200).json(talkers);
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
});

// Requisito 1 
app.get('/talker', async (req, res) => {
  try {
    const data = await fs.readFile(filePath);
    const talkers = JSON.parse(data); // muda o formato de string para objeto
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

// Requisito 3 e 4

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = randomToken(16);
  return res.status(200).json({ token });
});

// Requisito 5

app.post('/talker', tokenValidation, nameValidation, ageValidation, talkValidation,
  watchedAtValidation, rateValidation, async (req, res) => {
  try {
    const { name, age, talk } = req.body;
    const data = await fs.readFile(filePath, 'utf8');
    const talkers = JSON.parse(data);
    const sortTalkers = talkers.sort((a, b) => b.id - a.id);
    const newId = sortTalkers[0].id + 1;
    const newTalker = { name, age, id: newId, talk };
    await fs.writeFile(filePath, JSON.stringify([...talkers, newTalker]), 'utf8');
    return res.status(201).json({ age, id: newId, name, talk });
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
});

// Requisito 6

app.put('/talker/:id', tokenValidation, nameValidation, ageValidation, talkValidation,
  watchedAtValidation, rateValidation, async (req, res) => {
  try {
    const { id } = req.params; // Se eu transformar o id em Number lá embaixo dá problema e não passa nos testes. Porquê?
    const data = await fs.readFile(filePath, 'utf8');
    const talkers = JSON.parse(data);
    const talker = talkers.find((t) => t.id === Number(id));
    if (!talker) {
      return res.status(404).json({
        message: 'Pessoa palestrante não encontrada',
      });
    }
    const { name, age, talk } = req.body;
    talker.name = name; talker.age = age; talker.talk = talk;
    await fs.writeFile(filePath, JSON.stringify(talkers), 'utf8');
    return res.status(200).json({ id: Number(id), name, age, talk }); 
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
});

// Requisito 7

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  try {
    const { id } = req.params; 
    const data = await fs.readFile(filePath, 'utf8');
    const talkers = JSON.parse(data).filter((t) => t.id !== Number(id));
    await fs.writeFile(filePath, JSON.stringify(talkers), 'utf8');
    return res.status(204).end();
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
});
