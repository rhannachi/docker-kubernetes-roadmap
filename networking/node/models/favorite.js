const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema({
  title: String,
  body: String,
});

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;