const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//导入数据库操作模块
const { db, dbpan } = require('./database/index')

//默认加载页面
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/main/');
});

//静态资源托管
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/public/main/"));

io.on('connection', (socket) => {
    // 客户端登录时触发
    socket.on('login', (token) => {
        token = JSON.parse(token)

        // 定义数据库查询语句语句 查询该属于用户的所有文件
        const sql = `SELECT * FROM filedata WHERE createrid = ?`

        dbpan.query(sql, token.id, (err, results) => {
            if (err) return err
            // console.log(results)
            socket.emit('updatepage', results)
        })
    })

    //切换文件目录时触发
    socket.on
});

//启动服务器
server.listen(30020, () => {
    console.log("localhost:30020")
});