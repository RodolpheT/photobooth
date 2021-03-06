
var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var http = require('http');
var serialport = require('serialport');       // include the serialport library
var SERVER_PORT = 8081;

var goProHighRes = false;

var password = process.env.GOPRO_PASSWORD;
console.log(password);

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
console.log("Opening serial port " + portName);
var myPort = new SerialPort(portName, serialOptions);

// set up event listeners for the serial events:
myPort.on('open', showPortOpen);
myPort.on('data', takePicture);
myPort.on('close', showPortClose);
myPort.on('error', showError);


function set5MP(){

	//Resolution: 5 Mpx
	options = {
	  host: '10.5.5.9',
	  path: '/camera/PR?t='+password+'&p=%03'
	};
	console.log('GoPro Mode 5MPX');
	req = http.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	});
	
	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
	
	goProHighRes = false;

}

// ------------------------ Serial event functions:
// this is called when the serial port is opened:
function showPortOpen() {

	//Set gopro in picture mode (video mode is by default when gopro is turned on)
	var options = {
	  host: '10.5.5.9',
	  path: '/camera/CM?t='+password+'&p=%01'
	};
	console.log('Setting GoPro in PICTURE mode...');
	var req = http.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	});

	console.log('Serial port open. Data rate: ' + myPort.options.baudRate);
	setTimeout(set12MP,200);
}

function set12MP(){
		
	//Resolution: 12 Mpx Wide
	options = {
	  host: '10.5.5.9',
	  path: '/camera/PR?t='+password+'&p=%05'
	};
	console.log('GoPro Mode 12Mpx');
	req = http.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	});
	
	goProHighRes = true;
	//setTimeout(takePicture,500);
}
//when new serial data arrives, send GET request to GOPRO
function takePicture() {
	
	//Take Picture
	options = {
	  host: '10.5.5.9',
	  path: '/camera/SH?t='+password+'&p=%01'
	};
	console.log('Sending GoPro picture request...');
	req = http.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	});
	
	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
	
/*	if (goProHighRes) {
		//If 12 Mpx enabled, then set back to 5 Mpx to get ready for next picture
		//set5MP();
		setTimeout(set5MP,3000);
	}
	else {
		//If low resolution enabled, then call set12MP to switch to high resolution
		setTimeout(set12MP,1100);
	}
*/
}

function showPortClose() {
   console.log('Port closed.');
}
// this is called when the serial port has an error:
function showError(error) {
  console.log('Serial port error: ' + error);
}
// ------------------------


//Creating the server to send list of images to web app
var server = http.createServer(function(req, res) {

	var images = [];
	var request = url.parse(req.url).pathname;
	var contentTypesByExtension = {
		'.html': "text/html",
		'.css':  "text/css",
		'.js':   "text/javascript",
		'.jpg':   "image/jpeg",
		'.JPG':   "image/jpeg"
	  };

	var filename = path.join(process.cwd(), request);

  // Request methods you wish to allow
  //res.setHeader('Access-Control-Allow-Methods', 'GET');

	var pathDir = "./pictures"

	/* URL pour lire les photos : / */
	if (request == "/Images") {

  var numberOfImages = 0;
		fs.readdir(pathDir, function(err, items) {
		res.write("[");

    //counting all .JPG images in the folder
    numberOfImages = 0;
    for (var file of items){
      if(file.indexOf(".JPG") > -1){
        numberOfImages++;
      }
    }

    //writing all .JPG images to the JSON response
	for (var i=0; i<items.length; i++) {
      if(items[i].indexOf(".JPG") > -1){
  			res.write('"' +  items[i] + '"');
  			if(i < numberOfImages-1) {
  				res.write(',');
        }
      }
    }

		res.write("]");
		res.end();
		});
	/* renvoie la page demandée */
	} else {
		if (request.indexOf("favicon") <= -1) {
			var headers = {};
			var contentType = contentTypesByExtension[path.extname(filename)];
			if (contentType) headers["Content-Type"] = contentType;

			/*var contentType = request == "/photobooth.html" ? "text/html" : "image/jpeg";*/
			request = "./" + request;
			fs.readFile(decodeURIComponent(request), 'binary', function(err, content){
				if (content != null && content != '' ){
					headers["Content-Length"] = content.length;
					res.writeHead(200, headers);
					res.write(content, "binary");
				}
				if(err!=null) console.log(err);
				res.end();
			});
		}
	}
});
server.listen(SERVER_PORT);
