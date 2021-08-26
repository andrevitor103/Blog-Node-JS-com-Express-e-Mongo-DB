# Blog-Node-JS-com-Express-e-Mongo-DB
Blog com painel administrativo para controle de suas publicações, feito com Node JS e Express, com mongoDB

## Para iniciar pode usar
### npm update
## Detalhe importante
### Como foi usado o mongosee você pode criar uma conta no https://cloud.mongodb.com/ e criar uma conta grátis

## Depois de criado a conta no cloud.mongodb.com
### Feito isso pode criar um cluster com uma colecao de post com a colleção que está no arquivo Post.js
### Depois só realizar a conexão neste método "connect" onde você coloca o seu usuario, senha e seu cluster, respectivamente
###  "mongodb+srv://usuario:senha@cluster0.ixg5d.mongodb.net/nomeDoSeuCluster?retryWrites=true&w=majority"

mongoose
  .connect(
    "mongodb+srv://usuario:senha@cluster0.ixg5d.mongodb.net/nomeDoSeuCluster?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Conectado com sucesso");
  })
  .catch((error) => {
    console.log(error.message);
  });
