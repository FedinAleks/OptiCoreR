const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const secretKey = '6LdzRB0qAAAAAGQdrqjHzM6rtnl4wvoiSlhZXq7G';

app.use(bodyParser.json());

app.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body;

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: token
      }
    });

    if (response.data.success) {
      res.status(200).send('reCAPTCHA підтверджено');
    } else {
      res.status(400).send('reCAPTCHA не підтверджено');
    }
  } catch (error) {
    res.status(500).send('Помилка сервера');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
