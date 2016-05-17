
var fs = require('fs');
var http = require('http');
var url = require('url');
var http = require('http');
var serialport = require('serialport');       // include the serialport library
var SERVER_PORT = 8081;

// configure the serial port:
SerialPort = serialport.SerialPort,             // make a local instance of serialport
    portName = process.argv[2];					// get serial port name from the command line

var serialOptions = {                           // serial communication options
      baudRate: 9600,                           // data rate: 9600 bits per second
      parser: serialport.parsers.readline('\n') // newline generates a data event
    };

// If the user didn't give a serial port name, exit the program:
if (typeof portName === "undefined") {
  console.log("You need to specify the serial port when you launch this script, like so:\n");
  console.log("    node server.js <portname>");
  console.log("\n Fill in the name of your serial port in place of <portname> \n");
  process.exit(1);
}
// open the serial port:
var myPort = new SerialPort(portName, serialOptions);

// set up event listeners for the serial events:
myPort.on('open', showPortOpen);
myPort.on('data', takePicture);
myPort.on('close', showPortClose);
myPort.on('error', showError);

// ------------------------ Serial event functions:
// this is called when the serial port is opened:
function showPortOpen() {
  console.log('port open. Data rate: ' + myPort.options.baudRate);
}

var options = {
	  host: 'http://10.5.5.9',
	  path: '/camera/SH?t=password&p=%01'
	};
	
function takePicture() {
	console.log('Sending GoPro picture request...');
	var req = http.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
}

function showPortClose() {
   console.log('port closed.');
}
// this is called when the serial port has an error:
function showError(error) {
  console.log('Serial port error: ' + error);
}

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
server.listen(SERVER_PORT);
