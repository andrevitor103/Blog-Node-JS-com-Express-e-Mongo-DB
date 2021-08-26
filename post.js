const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema(
  {
    titulo: String,
    imagem: String,
    categoria: String,
    conteudo: String,
    slug: String,
    autor: String,
    views: Number,
  },
  { collection: "post" }
);

let Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
