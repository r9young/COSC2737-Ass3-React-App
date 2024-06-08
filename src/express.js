
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 4000; // Ensure this matches your environment configuration

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Dummy user data for example
  const user = {
    username: 'test',
    password: 'password'
  };

  if (username === user.username && password === user.password) {
    res.status(200).send({ success: true });
  } else {
    res.status(401).send({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
