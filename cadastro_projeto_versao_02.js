//Versao 02
//CRUD completo simples
//Proximas versoes com melhorias (implementacao em camadas)

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


var GestaoDB = mongoose.model('projeto', ProjectSchema) , 
	_projeto = {
		create: '/projeto/create',
		retrieve: '/projeto/retrieve',
		update: '/projeto/update',
		delete: '/projeto/delete',
	} 

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  console.log('URL:', req.url)
  var route = req.url;

  switch(route){
  	case '/projeto/create':

  		var dados = {
			name : "Cadastro de assessoria",
			description : "Devera ser urgente",
			time : 3 ,
			status : "Em aberto",
			priority : 1
		}

		var model = new GestaoDB(dados), msg = "";


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

  	break;

  	case '/projeto/retrieve': 
  		GestaoDB.find( query , function(err, data){
  			if(err){
  				console.log('Erro:', err);
  				msg = 'Erro:' + err;
  			}else{
  				console.log('Listagem:', data);
  				msg = 'Projetos listados:' + JSON.stringify(data);
  			}
  		});

  		res.end(msg);

  	break;

  	case '/projeto/update': 
  		var query = {name: /Cadastro de assessoria/i};

  		var mod = {
  			description: "Atualizacao"
  		}

  		var optional = {
  			upsert: false, multi: true
  		}

  		GestaoDB.update(query , mod , optional , function(err,data){
			if(err){
  				console.log('Erro:', err);
  				msg = 'Erro:' + err;
  			}else{
  				console.log('Atualizado:', data);
  				msg = 'Projetos atualizados:' + JSON.stringify(data);
  			}
  		});

  		res.end(msg);

  	break;

  	case '/projeto/delete': 
  		var query = {name: /teste/i};
  		
  		GestaoDB.remove(query,function(err, data){
			if(err){
  				console.log('Erro:', err);
  				msg = 'Erro:' + err;
  			}else{
  				console.log('Deletado:', data);
  				msg = 'Projetos deletados:' + JSON.stringify(data);
  			}
  		});

  		res.end(msg);

  	break;

  	default : res.end("Not routem !!!!!!");
  }

 

}).listen(3000);
console.log('Server running at http://localhost:3000/');



