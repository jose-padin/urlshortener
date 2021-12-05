require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const urlencode = require('urlencode');
const validUrl = require('valid-url');
const ShortUrl = require('./models/url');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGO_URI;
const mongoose = require('mongoose');
const db = mongoose.connect(MONGO_URI);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));


let responseObject = {};

app.get('/', (req, res) => {
  return res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/shorturl', async (req, res) => {
  const original_url = req.body.url;

  if (!validUrl.isUri(original_url)) {
    return res.json({error: 'invalid url'})
  }

  await ShortUrl.findOne({original_url: original_url}, (err, url) => {
    if (url) {
      responseObject['original_url'] = url.original_url;
      responseObject['short_url'] = url.short_url;
      return res.json(responseObject);
    }

    const my_url = ShortUrl.create({
      original_url: original_url
    }).then((my_url) => {
      responseObject['original_url'] = my_url.original_url;
      responseObject['short_url'] = my_url.short_url;
      return res.json(responseObject);
    }).catch((err) => {
      return console.log(err);
    })
  })
});


app.get('/api/shorturl/:short_url', (req, res) => {
  // we are decoding the short url here because we encoded it when we retrieved
  // it in the /api/shorturl
  const short_url = urlencode.decode(req.params.short_url)

  ShortUrl.findOne({short_url: short_url})
    .exec()
    .then(url => {
      return res.redirect(url.original_url)
    })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});
