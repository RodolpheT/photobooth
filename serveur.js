
var fs = require('fs');
var http = require('http');
var url = require('url');
var rootFolder = 'E:/Mes documents/Boulot/Workspace/localhost/Rodolphe';

var server = http.createServer(function(req, res) {
  
	var images = [];
	var request = url.parse(req.url).pathname;
	
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');
	
	/*
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost.local');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
	res.setHeader('Content-Type', 'text/html');
	*/
	/*var path = "E:\Mes documents\Perso\Rodolphe\Photobooth Javascript\photostest";*/
	var path = "./photostest"
	 
	/* URL pour lire les photos : / */	 
	if (request == "/getImages") {
		
		fs.readdir(path, function(err, items) {
		res.write("[");
		 
			for (var i=0; i<items.length; i++) {
				res.write('"' +  items[i] + '"');
				if(i < items.length - 1) {
					res.write(',');
				}
			}
		res.write("]");
		res.end();	
		});
	/* renvoie la page demandée */
	} else {
		if (request.indexOf("favicon") <= -1) {
			var contentType = request == "/photobooth.html" ? "text/html" : "image/jpeg";
			console.log("!!!" + contentType);
			request = "./" + request;		
			fs.readFile(decodeURIComponent(request), 'binary', function(err, content){
				if (content != null && content != '' ){
					
					res.writeHead(200, {'Content-Length':content.length, 'Content-type':contentType});
					res.write(content, "binary");
				}
				if(err!=null) console.log(err);
				res.end();
			});		
		}
	}
});
server.listen(8081);