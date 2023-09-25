const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const connection = require('./db/connection');
const { randomToken } = require('./randomToken');
const {
  validateEmail,
  validatePassword,
  tokenValidation,
  nameValidation,
  ageValidation,
  watchedAtValidation,
  talkValidation,
  rateValidation,
  rateValidationInSearch,
  dateValidationInSearch,
  rateValidationForPatch
}
  = require('./validations');

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

app.listen(PORT, async () => {
  console.log(`API talker_manager está sendo executada na porta ${PORT}`);

  // O código abaixo é para testarmos a comunicação com o MySQL
  const [result] = await connection.execute('SELECT 1');
  if (result) {
    console.log('MySQL connection OK');
  }
  console.log('Online');
});

// Requisito 12: Crie o endpoint GET /talker/db

app.get('/talker/db', async (_req, res) => {
  const [result] = await connection.execute('SELECT * FROM TalkerDB.talkers');
  const organizedResult = result.map((talker) => (
    {
      name: talker.name,
      age: talker.age,
      id: talker.id,
      talk: { watchedAt: talker.talk_watched_at, rate: talker.talk_rate },
    }));
  return res.status(200).json(organizedResult);
});

// Requisito 8: Crie o endpoint GET /talker/search e o parâmetro de consulta q=searchTerm
// Requisito 9: Crie no endpoint GET /talker/search o parâmetro de consulta rate=rateNumber
// Requisito 10: Crie no endpoint GET /talker/search o parâmetro de consulta date=watchedDate

app.get('/talker/search', tokenValidation, rateValidationInSearch, dateValidationInSearch,
  async (req, res) => {
    try {
      const { q, rate, date } = req.query;
      const data = await fs.readFile(filePath, 'utf8');
      let talkers = JSON.parse(data);
      if (q) {
        talkers = talkers.filter((talker) => talker.name.includes(q));
      }
      if (rate) {
        talkers = talkers.filter((talker) => talker.talk.rate === Number(rate));
      }
      if (date) {
        talkers = talkers.filter((talker) => talker.talk.watchedAt === date);
      }
      return res.status(200).json(talkers);
    } catch (error) {
      console.error(`Erro na leitura do arquivo: ${error}`);
    }
  });

// Requisito 1: Crie o endpoint GET /talker

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

// Requisito 2: Crie o endpoint GET /talker/:id

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

// Requisito 3: Crie o endpoint POST /login
// Requisito 4: Adicione as validações para o endpoint /login

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = randomToken(16);
  return res.status(200).json({ token });
});

// Requisito 5: Crie o endpoint POST /talker

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

// Requisito 6: Crie o endpoint PUT /talker/:id

app.put('/talker/:id', tokenValidation, nameValidation, ageValidation, talkValidation,
  watchedAtValidation, rateValidation, async (req, res) => {
    try {
      const { id } = req.params;
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

// Requisito 7: Crie o endpoint DELETE /talker/:id

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

// Requisito 11: Crie o endpoint PATCH /talker/rate/:id

app.patch('/talker/rate/:id', tokenValidation, rateValidationForPatch, async (req, res) => {
  try {
    const { id } = req.params;
    const { rate } = req.body;
    const data = await fs.readFile(filePath, 'utf8');
    const talkers = JSON.parse(data);
    const talker = talkers.find((t) => t.id === Number(id));
    if (!talker) {
      return res.status(404).json({
        message: 'Pessoa palestrante não encontrada',
      });
    }
    talker.talk.rate = rate;
    await fs.writeFile(filePath, JSON.stringify(talkers), 'utf8');
    return res.status(204).end();
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
});
