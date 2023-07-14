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

    // 获取分享列表时触发
    socket.on('sharelist', (token) => {
        token = JSON.parse(token)

        // 查找该用户的分享列表
        const sql = `SELECT * FROM sharefile WHERE sharerid = ?`
        dbpan.query(sql, token.id, (err, results) => {
            if (err) return err
            socket.emit('sharelist', results)
        })
    })

    // 删除分享时触发
    socket.on('delshare', (toSend) => {
        toSend = JSON.parse(toSend)

        // 删除指定分享
        const sql = `DELETE FROM sharefile WHERE id=?`
        dbpan.query(sql, toSend.id, (err, results) => {
            if (err) return err

            // 返回新的分享列表
            const sql2 = `SELECT * FROM sharefile WHERE sharerid = ?`
            dbpan.query(sql2, toSend.sharerid, (err, results) => {
                if (err) return err
                socket.emit('sharelist', results)
            })
        })
    })

    // 分享文件时触发
    socket.on('sharefile', (toSend) => {
        toSend = JSON.parse(toSend)

        // 查找文件对应的文件名
        const sql = `SELECT name FROM filedata WHERE id=?`
        dbpan.query(sql, toSend.fileid, (err, results) => {
            if (err) return err
            // console.log(results)
            let name = results[0].name

            // 如果该文件已经处于分状态 则删除后重新添加分享
            const sql4 = `DELETE FROM sharefile WHERE fileid=?`
            dbpan.query(sql4, toSend.fileid, (err, results) => {
                if (err) return err

                // 插入分享文件
                const sql2 = `INSERT INTO sharefile SET ?`
                dbpan.query(sql2, {
                    fileid: toSend.fileid,
                    filename: name,
                    sharecode: toSend.sharecode,
                    sharerid: toSend.sharerid
                }, (err, results) => {
                    if (err) throw err

                    // 返回新的分享列表
                    const sql3 = `SELECT * FROM sharefile WHERE sharerid = ?`
                    dbpan.query(sql3, toSend.sharerid, (err, results) => {
                        if (err) return err
                        socket.emit('sharelist', results)
                    })
                })
            })
        })
    })

    // 删除文件时触发
    socket.on('removefile', (toSend) => {
        toSend = JSON.parse(toSend)

        const sql = `DELETE FROM filedata WHERE id=?`
        dbpan.query(sql, toSend.fileid, (err, results) => {
            if (err) return err
            // 返回删除后的文件列表
            const sql2 = `SELECT * FROM filedata WHERE createrid = ?`
            dbpan.query(sql2, toSend.createrid, (err, results) => {
                if (err) return err
                // console.log(results)
                socket.emit('updatepage', results)
            })
        })
    })

    // 获取分享时触发
    socket.on('getsharefile', (toSend) => {
        toSend = JSON.parse(toSend)
        // console.log(toSend)
        // 查找文件对应的文件分享码
        const sql = `SELECT * FROM sharefile WHERE sharecode=?`
        dbpan.query(sql, toSend.shareid, (err, results) => {
            if (err) return err
            // console.log(results)
            let hasfile = 0
            if (results.length > 0) {
                const sql2 = `SELECT * FROM filedata WHERE id = ?`
                dbpan.query(sql2, results[0].fileid, (err, results) => {
                    if (err) return err
                    // console.log(results[0])
                    hasfile = results[0]
                    // console.log(hasfile)
                    if (hasfile.isfile == 0) {
                        const sql3 = `SELECT * FROM filedata WHERE parentid = ?`
                        dbpan.query(sql3, results[0].id, (err, result) => {
                            if (err) return err
                            // console.log(result.length)
                            hasfile.size = result.length
                            socket.emit('getsharefile', hasfile)
                        })
                    } else {
                        socket.emit('getsharefile', hasfile)
                    }
                })
            } else {
                socket.emit('getsharefile', hasfile)
            }
        })
    })

    // 确认保存分享时触发
    socket.on('yesgetsharefile', (toSend) => {
        toSend = JSON.parse(toSend)
        // console.log(toSend)
        if (toSend.file.isfile == 1) {
            // 定义数据库插入语句 插入上传的文件信息
            const sql = `INSERT INTO filedata SET ?`
            dbpan.query(sql, {
                name: toSend.file.name,
                url: toSend.file.url,
                isfile: toSend.file.isfile,
                parentid: toSend.parentid,
                createrid: toSend.userid,
                size: toSend.file.size
            }, (err, results) => {
                if (err) throw err
                // 定义数据库查询语句语句 查询该属于用户的所有文件
                const sql2 = `SELECT * FROM filedata WHERE createrid = ?`
                dbpan.query(sql2, toSend.userid, (err, results) => {
                    if (err) return err
                    socket.emit('updatepage', results)
                })
            })
        } else {
            const sql = `INSERT INTO filedata SET ?`
            dbpan.query(sql, {
                name: toSend.file.name,
                url: toSend.file.url,
                isfile: toSend.file.isfile,
                parentid: toSend.parentid,
                createrid: toSend.userid,
                size: toSend.file.size
            }, (err, results) => {
                if (err) throw err
                const insertId = results.insertId
                // console.log(insertId)
                filelist = []
                function getDirFile(pid) {
                    return new Promise((resolve, reject) => {
                        const sql = `SELECT * FROM filedata WHERE parentid = ?`
                        dbpan.query(sql, pid, (err, results) => {
                            if (err) return reject(err)

                            const promises = []
                            for (let i = 0; i < results.length; i++) {
                                const file = results[i]
                                if (file.isfile == 1) {
                                    filelist.push(file)
                                } else {
                                    filelist.push(file)
                                    promises.push(getDirFile(file.id))
                                }
                            }

                            Promise.all(promises)
                                .then((nestedResults) => {
                                    resolve(filelist)
                                })
                                .catch(reject)
                        })
                    })
                }

                (async function () {
                    try {
                        const result = await getDirFile(toSend.file.id)
                        // console.log(result)
                        for (let i = 0; i < result.length; i++) {
                            const sql = `INSERT INTO filedata SET ?`
                            let val = {
                                id: result[i].id - toSend.file.id + insertId,
                                name: result[i].name,
                                url: result[i].url,
                                isfile: result[i].isfile,
                                parentid: result[i].parentid - toSend.file.id + insertId,
                                createrid: toSend.userid,
                                size: result[i].size
                            }
                            // console.log(result[i].parentid, toSend.file.id, insertId, val)
                            dbpan.query(sql, val, (err, results) => {
                                if (err) return err
                                const insertedId = results.insertId
                                // console.log(insertedId)
                                if (i == result.length - 1) {
                                    const sql2 = `SELECT * FROM filedata WHERE createrid = ?`
                                    dbpan.query(sql2, toSend.userid, (err, results) => {
                                        if (err) return err
                                        socket.emit('updatepage', results)
                                    })
                                }
                            })
                        }
                    } catch (err) {
                        console.error(err)
                    }
                })()
            })
        }
    })

    // 移动或复制文件时触发
    socket.on('copyormovefile', (toSend) => {
        toSend = JSON.parse(toSend)
        let file = []
        // 定义数据库插入语句 插入上传的文件信息
        const sql = `SELECT * FROM filedata WHERE id = ?`
        dbpan.query(sql, toSend.copymovefileid, (err, result) => {
            if (err) return err
            file = result[0]
            const sql2 = `INSERT INTO filedata SET ?`
            dbpan.query(sql2, {
                name: file.name,
                url: file.url,
                isfile: file.isfile,
                parentid: toSend.targetdirid,
                createrid: toSend.userid,
                size: file.size
            }, (err, results) => {
                if (err) throw err
                if (toSend.iscopy == 0) {
                    const sql4 = `DELETE FROM filedata WHERE id = ?`
                    dbpan.query(sql4, toSend.copymovefileid, (err, result) => {
                        if (err) return err
                        // console.log('del')
                        // 定义数据库查询语句语句 查询该属于用户的所有文件
                        const sql3 = `SELECT * FROM filedata WHERE createrid = ?`
                        dbpan.query(sql3, toSend.userid, (err, results) => {
                            if (err) return err
                            socket.emit('updatepage', results)
                        })
                    })
                } else {
                    // 定义数据库查询语句语句 查询该属于用户的所有文件
                    const sql3 = `SELECT * FROM filedata WHERE createrid = ?`
                    dbpan.query(sql3, toSend.userid, (err, results) => {
                        if (err) return err
                        socket.emit('updatepage', results)
                    })
                }
            })
        })
    })
})

//启动服务器
server.listen(30020, () => {
    console.log("localhost:30020")
});