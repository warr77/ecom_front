const express=require("express");
const cors=require("cors");
const env=require("dotenv");
const mongoose=require('mongoose');
const routes =require('./models/routes')
const bodyParser=require("body-parser")
const cookieParser=require("cookie-parser")
env.config();
const app=express();
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
  });

var server=require('http').createServer(app)


var io= require('socket.io')(server,{
    cors: {
        origin: "http://localhost:3000",
    }
})
app.use(cors());


app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.use('/',routes);
require('./socket/socket.js')(io)


server.listen(5000);


