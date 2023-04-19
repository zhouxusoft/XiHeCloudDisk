const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//导入数据库操作模块
const db = require('./database/index')

//默认加载页面
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/main/');
});

//静态资源托管
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/public/main/"));

io.on('connection', (socket) => {
    
});

//启动服务器
server.listen(30020, () => {
    console.log("localhost:30020")
});