//Versao 01
//Apenas acessa o banco e insere um objeto
//Proximas versoes com melhorias

var http = require('http');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gestao');

var db = mongoose.connection;

db.on('error', function(err){
    console.log('Erro de conexao.', err);
});

db.on('open', function () {
  console.log('Conexão aberta.');
});

db.on('connected', function(err){
    console.log('Conectado');
});

db.on('disconnected', function(err){
    console.log('Desconectado');
});

var Schema = mongoose.Schema 

var ProjectSchema = new Schema({
	name : { type: String , default: '', require: true },
	description : { type : String , default : ''},
	time: { type: Number , min: 2 },
	active : { type: Boolean , default : true},
	date_create : { type: Date , default : Date.now},
	status: { type: String , require: true },
	priority: { type: Number , require: true }
});


var ProjetcBD = mongoose.model('projeto', ProjectSchema); 

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  console.log('URL:', req.url)
  var route = req.url;

  if(route == "/projeto/criar"){

		var dados = {
			name : "Criar tela de cadastro",
			description : "Devera ser urgente",
			time : 3 ,
			status : "Em aberto",
			priority : 1
		}

		var model = new ProjetcBD(dados), msg = "";


		model.save(function(err , data){
			if(err){
				console.log('Erro', err)
				msg = 'Erro: ' + err;
			}else{
				console.log('Projeto inserido', data)
				msg = 'Projeto Inserido: ' + JSON.stringify(data);
			}
		});

		res.end(msg);

  }else{
  	res.end('ROTA NAO ENCONTRADA!');
  }


  

}).listen(3000);
console.log('Server running at http://localhost:3000/');



