const mongoose = require('mongoose');
const shortid = require('shortid');


urlSchema = mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    short_url: {
        type: String,
        required: true,
        default: shortid.generate()
    },
    date: {
      type: Date,
      default: Date.now
    },
    clicks: {
      type: Number,
      required: true,
      default: 0
    }
  })

module.exports = mongoose.model('ShortUrl', urlSchema);