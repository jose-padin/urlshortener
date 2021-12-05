const mongoose = require('mongoose');


urlSchema = mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    short_url: {
        type: Number,
        required: true
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