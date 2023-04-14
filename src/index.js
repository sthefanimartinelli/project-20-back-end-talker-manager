const express = require('express');
const fs = require('fs').promises;
const path = require('path');

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