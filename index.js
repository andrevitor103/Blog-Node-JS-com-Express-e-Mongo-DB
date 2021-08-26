const express = require("express");
const app = express();

const path = require("path");
const fileUpload = require("express-fileupload");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Posts = require("./post.js");

const session = require("express-session");
const { text } = require("body-parser");

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "pages"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(fileUpload());

mongoose
  .connect(
    "mongodb+srv://root:root@cluster0.ixg5d.mongodb.net/comic?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Conectado com sucesso");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/", (req, res) => {
  if (req.query.busca == null) {
    var posts;
    Posts.find({})
      .sort({ _id: -1 })
      .exec((err, post) => {
        // console.log(post);
        posts = post.map((val) => {
          return {
            titulo: val.titulo,
            descricaoCurta: val.conteudo.substr(0, 120),
            imagem: val.imagem,
            categoria: val.categoria,
            conteudo: val.conteudo,
            slug: val.slug,
          };
        });
        res.render("index", { posts: posts });
      });
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        if (err) {
          res.render("busca", {});
        } else {
          posts = posts.map((val) => {
            return {
              titulo: val.titulo,
              descricaoCurta: val.conteudo.substr(0, 120),
              imagem: val.imagem,
              categoria: val.categoria,
              conteudo: val.conteudo,
              slug: val.slug,
            };
          });
          console.log(posts);
          res.render("busca", { posts: posts, totalNoticias: posts.length });
        }
      }
    );
    // res.render("busca", {});
  }
});

app.get("/:slug", (req, res) => {
  // console.log(req.params.slug);
  Posts.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true },
    function (err, resposta) {
      if (err) {
        res.redirect("/");
      } else if (resposta) {
        console.log(resposta);
        res.render("single", { noticia: resposta });
      } else {
        res.redirect("/");
      }
    }
  );
});

let usuarios = [
  {
    usuario: "andrevitor103",
    senha: "1234",
  },
  {
    usuario: "admin",
    senha: "admin",
  },
];

app.get("/admin/login", (req, res) => {
  if (req.session.user == null) {
    res.render("login");
  } else {
    var posts;
    Posts.find({ autor: req.session.user })
      .sort({ _id: -1 })
      .exec((err, post) => {
        // console.log(post);
        posts = post.map((val) => {
          return {
            id: val._id,
            titulo: val.titulo,
            descricaoCurta: val.conteudo.substr(0, 120),
            imagem: val.imagem,
            categoria: val.categoria,
            conteudo: val.conteudo,
            slug: val.slug,
          };
        });
        res.render("admin-panel", { posts: posts });
      });
  }
});

app.post("/admin/confirm", (req, res) => {
  usuarios.map((val) => {
    if (val.usuario == req.body.usuario && val.senha == req.body.senha) {
      req.session.user = val.usuario;
    }
  });
  res.redirect("/admin/login");
});

const slugFormat = (textToSlug) => {
  let index = 0;
  while (textToSlug.indexOf(" ") != -1 || index == 20) {
    textToSlug = textToSlug.replace(" ", "-");
    index++;
  }
  return textToSlug;
};

app.post("/noticia/cadastrar", (req, res) => {
  console.log(req.files.imagem.mimetype);

  var imagem = new Date().getTime() + "." + req.files.imagem.mimetype.substr(6);
  var sampleFile = req.files.imagem;
  var uploadPath = __dirname + "/public/image/" + imagem;

  sampleFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
  });

  Posts.create({
    titulo: req.body.titulo,
    imagem: "http://localhost:3000/public/image/" + imagem,
    categoria: "DC",
    conteudo: req.body.conteudo,
    slug: slugFormat(req.body.titulo),
    autor: req.session.user,
    views: 0,
  });
  res.redirect("/admin/login");
});

app.get("/noticia/deletar/:id", (req, res) => {
  Posts.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/admin/login");
    })
    .catch(() => {
      res.redirect("/admin/login");
    });
});

app.listen(3000, (error) => {
  if (error) {
    console.log(error);
    return false;
  }
  console.log("Servidor rodando...");
});
