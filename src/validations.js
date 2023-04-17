const validateEmail = (req, res, next) => {
  const { email } = req.body;

  const validEmailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

  if (!email) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }

  if (!validEmailFormat.test(email)) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }

  next();
};

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message: 'Token não encontrado',
    });
  }
  if (authorization.length !== 16 || typeof (authorization) !== 'string') {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
  next();
};

const nameValidation = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }
  if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  next();
};

const ageValidation = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (age < 18 || typeof age !== 'number' || !Number.isInteger(age)) {
    return res.status(400).json({
      message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
    });
  }
  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório',
    });
  }
  
  next();
};

const watchedAtValidation = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt } = talk;
  if (!watchedAt) {
    return res.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  }
  const dataFormat = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!dataFormat.test(watchedAt)) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  
  next();
};

const rateValidation = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;
  if (rate === undefined) {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }
  if (!Number.isInteger(rate) || rate <= 0 || rate > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  
  next();
};

module.exports = { validateEmail,
validatePassword,
tokenValidation, 
nameValidation,
ageValidation,
talkValidation,
watchedAtValidation,
rateValidation };