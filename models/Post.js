const mongoose = require('mongoose');

  const commentSchema = new mongoose.Schema({
    text: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },//ça me retourne toute les infos d'un User mais la en l'occurence j'ai besoin du username
    createdAt: { type: Date, default: Date.now }
  });

  const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //same
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],//same
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Post', postSchema);
