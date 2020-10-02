const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs_api_db"
});



app.get('/',(req,res)=>{
res.sendfile('public/index.html');
});

app.get('/public',(req,res)=>{
res.sendfile('public/emit.html');
});

app.get('/visual',(req,res)=>{
res.sendfile('public/visualize.html');
});
//app.get('/', (req, res) => {
  //res.send('<h1>Hey Socket.io</h1>');
//});
app.get('/streams',(req,res)=>{
res.sendfile('live/stream.html');
});
app.get('/view',(req,res)=>{
res.sendfile('live/view.html');
});

app.get('/broadcast',(req,res)=>{
res.sendfile('public/broadcast.html');
});


io.on('connection', (socket) => {
  console.log('a user connected',socket.id);


// live movie plays



//live video camera playe
socket.on('stream',(image)=>{
        socket.broadcast.emit('stream',image);  
    });



//chat message list

  con.query('SELECT * FROM message',function(err,rows){
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      socket.emit('showrows', rows);
    });


  //method 1 SUCCESS
var msg='';

  socket.emit('test event','here some data');
  socket.emit('my broadcast', msg);


  socket.on('disconnect', () => {
    console.log('user disconnected',socket.id);
  });
  
//typing
socket.on('type', (typee) => {
    io.emit('typing', `${typee}`);
    
  });

//chat message insert
  socket.on('my message', (msg) => {
    console.log('message: ' + msg);

    io.emit('my broadcast', `${msg}`);


    con.query("INSERT INTO message (message) VALUES ('"+msg+"')",function(err,rows){
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      //socket.emit('showrows', rows);
    });


  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
