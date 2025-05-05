require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urlDatabase = {};
let currentId = 1;
// Your first API endpoint
app.post('/api/shorturl', function (req, res) {
  const longUrl = req.body.url;
  const hostname = longUrl.replace(/^https?:\/\//, '').split('/')[0];
  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      urlDatabase[currentId] = longUrl;
      currentId++;
      return res.json({
        original_url: longUrl,
        short_url: currentId - 1
      });
    }
  });
});
app.get('/api/shorturl/:urlID', (req, res) => {
  const id = req.params.urlID
  const longUrl = urlDatabase[id];
  if (longUrl) {
    res.redirect(longUrl);
  }
  else {
    res.json({ error: 'invalid url' });
  }
})
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
