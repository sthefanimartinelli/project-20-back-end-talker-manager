const validateEmail = (req, res, next) => {
  const { email } = req.body;

  const validEmailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

  if (!email || email === undefined) {
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

  if (!password || password === undefined) {
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

module.exports = { validateEmail, validatePassword };