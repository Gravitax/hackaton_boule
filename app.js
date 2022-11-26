const express = require('express');
const bodyParser = require('body-parser');


var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new SerialPort('/dev/cu.usbserial-1110',{ 
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('.'));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname })
});

io.on('connection', (socket) => {
    console.log(`Connecté au client`)
});

parser.on('data', function(data) {

    console.log('Received data from port: ' + data);

    io.emit('data', data);

});

server.listen(3000, function () {
    console.log('Votre app est disponible sur localhost:3000 !')
});
