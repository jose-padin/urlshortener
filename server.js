require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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


app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url;
  let input_short = 1;

  if (!validUrl.isUri(original_url)) {
    return res.json({error: 'invalid url'})
  }

  ShortUrl.findOne({})
    .sort({short_url: 'desc'})
    .exec((err, url) => {
      if (!err && url != undefined) {
        input_short = url.short_url + 1;
      }

      if (!err) {
        ShortUrl.findOneAndUpdate(
          {original_url: original_url},
          {original_url: original_url, short_url: input_short},
          {new: true, upsert: true},
          (err, saved) => {
            if (!err) {
              responseObject['original_url'] = saved.original_url;
              responseObject['short_url'] = saved.short_url;
              res.json(responseObject)
            }
          }
        )
      }
    })
});


app.get('/api/shorturl/:short_url', (req, res) => {
  // we are decoding the short url here because we encoded it when we retrieved
  // it in the /api/shorturl
  const short_url = req.params.short_url

  ShortUrl.findOne({short_url: short_url})
    .exec()
    .then(url => {
      return res.redirect(url.original_url)
    })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});
