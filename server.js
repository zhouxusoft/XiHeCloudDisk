const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//导入数据库操作模块
const { db, dbpan } = require('./database/index');
const { dir } = require('console');

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
            socket.emit('firstpage', results)
        })
    })

    // 上传文件时触发
    socket.on('uploadfile', (fileinfo) => {
        fileinfo = JSON.parse(fileinfo)

        // 定义数据库插入语句 插入上传的文件信息
        const sql = `INSERT INTO filedata SET ?`
        dbpan.query(sql, {
                name: fileinfo.name,
                url: fileinfo.url,
                isfile: fileinfo.isfile,
                parentid: fileinfo.parentid,
                createrid: fileinfo.createrid,
                size: fileinfo.size
            }, (err, results) => {
                if (err) throw err
                // 定义数据库查询语句语句 查询该属于用户的所有文件
                const sql2 = `SELECT * FROM filedata WHERE createrid = ?`

                dbpan.query(sql2, fileinfo.createrid, (err, results) => {
                    if (err) return err
                    // console.log(results)
                    socket.emit('updatepage', results)
                })
        })
    })

    // 新建文件夹时触发
    socket.on('newdir', (dirinfo) => {
        dirinfo = JSON.parse(dirinfo)
        // 定义数据库插入语句 插入上传的文件信息
        const sql = `INSERT INTO filedata SET ?`
        dbpan.query(sql, {
                name: dirinfo.name,
                isfile: dirinfo.isfile,
                parentid: dirinfo.parentid,
                createrid: dirinfo.createrid,
            }, (err, results) => {
                if (err) throw err
                // 定义数据库查询语句语句 查询该属于用户的所有文件
                const sql2 = `SELECT * FROM filedata WHERE createrid = ?`

                dbpan.query(sql2, dirinfo.createrid, (err, results) => {
                    if (err) return err
                    // console.log(results)
                    socket.emit('updatepage', results)
                })
        })
    })
});

//启动服务器
server.listen(30020, () => {
    console.log("localhost:30020")
});