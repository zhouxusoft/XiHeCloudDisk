//拿到登录的token
//判断值是否为空
let token = JSON.parse(localStorage.getItem("token"))
if (!token) {
    window.location = '../login/'
}

// 定义socket对象
const socket = io('http://127.0.0.1:30020')

/* 获取每日一言 */
function getSentence() {
    let text = '我会一直写代码，直到我看不清屏幕的那一天。'
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://v1.hitokoto.cn/', false)
    xhr.send()
    let resData = JSON.parse(xhr.responseText)
    if (resData) {
        text = resData.hitokoto
    }
    return text
}

function handleClick(event) {
    //点击菜单不触发事件
    if (!event.target.classList.contains("btn-sm") && !event.target.classList.contains("dirmenu") && !event.target.classList.contains("filemenu")) {
        let isfile
        for (let i = 0; i < globalfilelist.length; i++) {
            if (globalfilelist[i].id == event.currentTarget.id) {
                isfile = globalfilelist[i].isfile
            }
        }
        if (isfile == 0) {
            // console.log(event.currentTarget.id)
            // 进入下一级菜单 刷新页面元素
            resetFilePage(event.currentTarget.id)
            resetDirNavBar(event.currentTarget.id)
            // console.log('6', getDirList(event.currentTarget.id))
        } else {
            for (let i = 0; i < globalfilelist.length; i++) {
                if (event.currentTarget.id == globalfilelist[i].id) {
                    downloadfilebtn.click()
                    while (downloadingdatabox.firstChild) {
                        downloadingdatabox.removeChild(downloadingdatabox.firstChild)
                    }
                    downloadingdatabox.innerHTML += `
                        <div class="filebox">
                            <div class="filelogois">\uf15b</div>
                            <div class="filenameis">${globalfilelist[i].name}</div>
                            <div>( ${getFileSize(globalfilelist[i].size)} )</div>
                        </div>
                    `
                    // 获取每日一言
                    downloadtip.textContent = getSentence()
                    yesdownload.removeEventListener('click', downLoadFile)
                    yesdownload.addEventListener('click', function() {
                        downLoadFile(globalfilelist[i].url);
                    })
                    break
                }
            }    
        }
        // 选中事件点击过一次后，移除被选中属性并且移除监听事件
        selected.classList.remove("selected")
        selected.removeEventListener('click', handleClick)
        selected = null
        dirselected = 0
        // 判断下一级按钮是否可以被点击
        resetNext()
    }
}

function resetNext() {
    // 判断下一级菜单是否可点击
    if (dirselected != 0) {
        next.classList.remove("disabled")
    } else {
        next.classList.add("disabled")
    }
    if (dirlist.length > 0) {
        back.classList.remove("disabled")
    } else {
        back.classList.add("disabled")
    }
}

function downLoadFile(url) {
    let downloadUrl = 'http://sharewh1.xuexi365.com/share/download/' + url
    var iframe_box = document.querySelector('#iframe_box')
    while (iframe_box.firstChild) {
        iframe_box.removeChild(iframe_box.firstChild)
    }
    iframe_box.innerHTML = iframe_box.innerHTML + '<iframe src="' + downloadUrl + '"><iframe>'
}

const downloadtip = document.getElementsByClassName("downloadtip")[0]
const downloadingdatabox = document.getElementsByClassName("downloadingdatabox")[0]
const downloadfilebtn = document.getElementById("downloadfilebtn")
const yesdownload = document.getElementById("yesdownload")
const yeslogout = document.getElementById("yeslogout")
var filedata = document.getElementsByClassName("filedata")
var back = document.getElementById("back")
var next = document.getElementById("next")
var topmenu = document.getElementsByClassName("topmenu")[0]
var selected = null
var dirselected = 0

yeslogout.addEventListener('click', function () {
    localStorage.clear()
    window.location = '../login/'
})

// 获取文件操作菜单按钮和文件操作菜单
var filemenus = document.getElementsByClassName("filemenu")
var filepops = document.getElementsByClassName("filepop")
var dirmenus = document.getElementsByClassName("dirmenu")
var dirpops = document.getElementsByClassName("dirpop")
var rowborder = document.getElementsByClassName("rowborder")[0]

// 选中后再次点击
function selectedClick(event) {
    // console.log(event.target)
    // console.log(this)
    // 点击菜单不触发事件
    if (!event.target.classList.contains("btn-sm")) {
        // 遍历所有 filedata 元素，判断当前点击的元素是否是 filedata 元素
        for (let i = 0; i < filedata.length; i++) {
            if (this === filedata[i]) {
                // 把之前被选中的元素的 selected 类名和事件监听器移除
                if (selected !== null && selected != this) {
                    selected.classList.remove("selected")
                    selected.removeEventListener("click", handleClick)
                }
                // 给当前被点击的元素添加 selected 类名，并存储
                this.classList.add("selected")
                selected = this;
                if (this.classList.contains("dir")) {
                    dirselected = 1
                } else {
                    dirselected = 0
                }
                // console.log(selected.id)
                // 给当前被点击的元素绑定事件监听器
                this.addEventListener("click", handleClick)
                break;
            }
        }
    }
    // 判断下一级按钮是否可以被点击
    resetNext()
}

// 下一级按钮
next.addEventListener('click', function () {
    resetFilePage(selected.id)
    resetDirNavBar(selected.id)
    resetNext()
})

// 上一级按钮
back.addEventListener('click', function () {
    // console.log(dirlist)
    if (dirlist.length > 1) {
        resetFilePage(dirlist[dirlist.length - 2])
        resetDirNavBar(dirlist[dirlist.length - 2])
    } else {
        resetFilePage(0)
        resetDirNavBar(0)
    }
    resetNext()
})

// 顶部返回按钮
topmenu.addEventListener('click', function () {
    if (dirlist.length > 0) {
        if (dirlist.length > 1) {
            resetFilePage(dirlist[dirlist.length - 2])
            resetDirNavBar(dirlist[dirlist.length - 2])
        } else {
            resetFilePage(0)
            resetDirNavBar(0)
        }
        resetNext()
    }
})

// 获取所有菜单元素
const copy = document.getElementsByClassName("copy")
const move = document.getElementsByClassName("move")
const share = document.getElementsByClassName("share")
const rename = document.getElementsByClassName("rename")
const remove = document.getElementsByClassName("remove")
const menubtngroup = document.getElementsByClassName("menubtngroup")
const copysharecodemodal = document.getElementById("copysharecodemodal")
const sharecode = document.getElementsByClassName("sharecode")[0]

copysharecodemodal.addEventListener('click', function () {
    let text = sharecode.textContent
    text = text.slice(4)
    // console.log(text)
    navigator.clipboard.writeText(text)
})

function filecopy() {
    
}

function filemove() {
    
}

function fileshare(fileid) {
    // 获得一个六位随机数
    let randomNum = Math.floor(Math.random() * 1000000)
    let randomsharecode = '' + fileid + randomNum
    randomsharecode = randomsharecode.slice(0, 6)
    // console.log(randomsharecode)
    let toSend = {
        fileid: fileid,
        sharecode: randomsharecode,
        sharerid: token.id
    }
    socket.emit('sharefile', JSON.stringify(toSend))
}

function filerename() {
    
}

function fileremove () {

}

// 用于在页面元素变化时，确定每个元素菜单弹出的位置
function resetPageFun() {
    // 给所有 filedata 元素绑定点击事件监听器
    for (let i = 0; i < filedata.length; i++) {
        filedata[i].addEventListener("click", selectedClick)
    }

    for (let i = 0; i < dirmenus.length; i++) {
        // 添加鼠标进入的监听事件，用于判断菜单弹出的位置
        dirmenus[i].addEventListener('mouseenter', function () {
            // 获取文件框的位置和文件菜单按钮的位置
            const rowborderP = rowborder.getBoundingClientRect()
            const dirmenuP = dirmenus[i].getBoundingClientRect()
            // 判断距离，根据位置调整菜单位置
            if (rowborderP.top + rowborderP.height / 5 * 3 < dirmenuP.top) {
                dirpops[i].classList.remove("dirpopdown")
                dirpops[i].classList.add("dirpopup")
            } else {
                dirpops[i].classList.remove("dirpopup")
                dirpops[i].classList.add("dirpopdown")
            }
        })
    }

    for (let i = 0; i < filemenus.length; i++) {
        filemenus[i].addEventListener('mouseenter', function () {
            const rowborderP = rowborder.getBoundingClientRect()
            const filemenuP = filemenus[i].getBoundingClientRect()

            if (rowborderP.top + rowborderP.height / 5 * 3 < filemenuP.top) {
                filepops[i].classList.remove("filepopdown")
                filepops[i].classList.add("filepopup")
            } else {
                filepops[i].classList.remove("filepopup")
                filepops[i].classList.add("filepopdown")
            }
        })
    }

    // 给所有菜单添加点击监听事件
    for (let i = 0; i < menubtngroup.length; i++) {
        menubtngroup[i].addEventListener('click', function (event) {
            // console.log(event.target.classList[0])
            // console.log(event.currentTarget.id)
            if (event.target.classList[0] == 'copy') {

            } 
            else if (event.target.classList[0] == 'move') {

            } 
            else if (event.target.classList[0] == 'share') {
                fileshare(event.currentTarget.id)
            } 
            else if (event.target.classList[0] == 'rename') {

            } 
            else if (event.target.classList[0] == 'remove') {

            } 
        })
    }
}

// 获取到文件项的容器
const rowbox = document.getElementsByClassName("rowbox")[0]

// 清除文件列表的所有元素
function clearRowbox() {
    while (rowbox.firstChild) {
        rowbox.removeChild(rowbox.firstChild)
    }
}

// 格式化时间字符串
function getDate(datetime) {
    // console.log(datetime)
    let date = datetime.slice(0, 10)
    date = date.replace(/-/g, '/')
    return date
}

// 格式化文件大小
function getFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + " Bytes";
    } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1073741824) {
        return (bytes / 1048576).toFixed(2) + " MB";
    } else {
        return (bytes / 1073741824).toFixed(2) + " GB";
    }
}

// 获取文件夹的子文件数量
function getDirSonNum(filelist, id) {
    let count = 0
    for (let i = 0; i < filelist.length; i++) {
        if (filelist[i].parentid == id) {
            count++
        }
    }
    return count
}

// 获取文件夹的一级子文件对象
function getDirSonData(filelist, id) {
    let sonlist = []
    for (let i = 0; i < filelist.length; i++) {
        if (filelist[i].parentid == id) {
            sonlist.push(filelist[i])
        }
    }
    // 检查重名文件 在前端加以区分
    for (let i = 0; i < sonlist.length; i++) {
        let count = 1
        for (let j = i + 1; j < sonlist.length; j++) {
            if (sonlist[i].name == sonlist[j].name) {
                sonlist[j].name = sonlist[j].name + ' (' + count + ')'
                count ++
            }
        }
    }
    return sonlist
}

// 刷新文件列表
function resetFilePage(parentid) {
    // 删除元素在添加 以刷新
    clearRowbox()
    // 清除选中文件夹
    dirselected = 0
    let filelist = getDirSonData(globalfilelist, parentid)
    if (filelist.length > 0) {
        // 文件夹在前 文件在后
        for (let i = 0; i < filelist.length; i++) {
            if (filelist[i].isfile == 0) {
                const filename = filelist[i].name
                const updatetime = getDate(filelist[i].update)
                const dirson = getDirSonNum(globalfilelist, filelist[i].id) + ' 项'
                rowbox.innerHTML += `
                    <div class="col-md-6 col-xl-4 databox mb-2">
                        <div class="filedata dir" id="${filelist[i].id}">
                            <div class="dirfont"></div>
                            <div class="fileinfo">
                                <div class="filename">
                                    ${filename}
                                </div>
                                <div class="filemsg">
                                    ${dirson} | ${updatetime}
                                </div>
                            </div>
                            <div class="dirmenu">
                                <div class="dirpop dirpopdown">
                                    <div class="btn-group-vertical menubtngroup" id="${filelist[i].id}">
                                        <button type="button" class="copy btn btn-sm btn-outline-secondary secondbtn">复制</button>
                                        <button type="button" class="move btn btn-sm btn-outline-secondary secondbtn">移动</button>
                                        <button type="button" class="share btn btn-sm btn-outline-secondary secondbtn" data-bs-toggle="modal"
                                        data-bs-target="#sharemodal">分享</button>
                                        <button type="button"
                                            class="rename btn btn-sm btn-outline-secondary secondbtn">重命名</button>
                                        <button type="button" class="remove btn btn-sm btn-outline-secondary secondbtn">删除</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
            }
        }
        for (let i = 0; i < filelist.length; i++) {
            if (filelist[i].isfile == 1) {
                const filename = filelist[i].name
                const updatetime = getDate(filelist[i].update)
                const filesize = getFileSize(filelist[i].size)
                rowbox.innerHTML += `
                    <div class="col-md-6 col-xl-4 databox mb-2">
                        <div class="filedata file" id="${filelist[i].id}">
                            <div class="filefont"></div>
                            <div class="fileinfo">
                                <div class="filename">
                                    ${filename}
                                </div>
                                <div class="filemsg">
                                    ${filesize} | ${updatetime}
                                </div>
                            </div>
                            <div class="filemenu">
                                <div class="filepop filepopdown">
                                    <div class="btn-group-vertical menubtngroup" id="${filelist[i].id}">
                                        <button type="button" class="copy btn btn-sm btn-outline-secondary secondbtn">复制</button>
                                        <button type="button" class="move btn btn-sm btn-outline-secondary secondbtn">移动</button>
                                        <button type="button" class="share btn btn-sm btn-outline-secondary secondbtn" data-bs-toggle="modal"
                                        data-bs-target="#sharemodal">分享</button>
                                        <button type="button"
                                            class="rename btn btn-sm btn-outline-secondary secondbtn">重命名</button>
                                        <button type="button" class="remove btn btn-sm btn-outline-secondary secondbtn">删除</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
            }
        }
    } else {
        rowbox.innerHTML += `
            <div class="col-md-6 col-xl-4 databox mb-2">
                空文件夹
            </div>`
    }
    resetPageFun()
}

// 用于存放目录列表的数组
let dirlist = []
const position = document.getElementsByClassName("position")[0]
const positionbtns = document.getElementsByClassName("positionbtn")

/* 清除文件夹导航栏的元素 */
function clearPosition() {
    while (position.firstChild) {
        position.removeChild(position.firstChild)
    }
    position.innerHTML += `<div class="positionbtn" id="0">主目录</div>`
}

/* 获取文件夹导航栏元素 */
function getDirList(id) {
    if (id == 0) {
        return dirlist
    } else {
        dirlist.unshift(id)
        for (let i = 0; i < globalfilelist.length; i++) {
            if (globalfilelist[i].id == id) {
                id = globalfilelist[i].parentid
                break
            }
        }
        return getDirList(id)
    }
}

/* 向文件夹导航栏添加子元素 */
function addDirNavBar(name, id) {
    position.innerHTML += `
        <div class="positionwhite"></div>
        <div class="positionbtn" id="${id}">${name}</div>`

}

/* 刷新文件夹导航栏 */
function resetDirNavBar(id) {
    clearPosition()
    dirlist = []
    let dirnavbarlist = getDirList(id)
    for (let i = 0; i < dirnavbarlist.length; i++) {
        for (let j = 0; j < globalfilelist.length; j++) {
            if (globalfilelist[j].id == dirnavbarlist[i]) {
                addDirNavBar(globalfilelist[j].name, globalfilelist[j].id)
            }
        }
    }
    for (let i = 0; i < dirnavbarlist.length; i++) {
        positionbtns[i].addEventListener('click', function () {
            resetFilePage(positionbtns[i].id)
            resetDirNavBar(positionbtns[i].id)
            resetNext()
        })
    }
}

// 用于存放后端拿到的文件列表
let globalfilelist

// 客户端连接成功时触发
socket.on('connect', () => {
    socket.emit('login', JSON.stringify(token))
    socket.emit('sharelist', JSON.stringify(token))
})

// 首次加载文件列表页面时触发
socket.on('firstpage', (filelist) => {
    globalfilelist = filelist
    // console.log(globalfilelist)
    resetFilePage(0)
    resetDirNavBar(0)
    resetNext()
})

// 文件变动时触发
socket.on('updatepage', (filelist) => {
    globalfilelist = filelist
    if (dirlist.length > 0) {
        const id = dirlist[dirlist.length - 1]
        // console.log('update', id)
        resetFilePage(id)
        resetDirNavBar(id)
    } else {
        resetFilePage(0)
        resetDirNavBar(0)
    }
    resetNext()
})

const uploadapibox = document.getElementById("uploadapibox")
const uploadingdatabox = document.getElementsByClassName("uploadingdatabox")[0]
const uploadingdatanull = document.getElementsByClassName("uploadingdatanull")

// 用于存放上传文件的列表
let globaluploadlist = []
let uploadid = 1

/* 重新添加上传列表删除键的监听事件 */
function resetUploadListen (uploadingdatadel) {
    if (uploadingdatadel.id) {
        for (let j = 0; j < globaluploadlist.length; j++) {
            // console.log('j', j)
            if (globaluploadlist[j].id == uploadingdatadel.id) {
                globaluploadlist[j].status = -1
                let dataid = 'uploadingdata' + globaluploadlist[j].id
                const resetuploaddata = document.getElementById(`${dataid}`)
                if (resetuploaddata) {
                    // console.log(resetuploaddata)
                    uploadingdatabox.removeChild(resetuploaddata)
                }
                resetUploadList()
                // console.log(5554123)
                break
            }
        }
    }
}

/* 刷新上传列表 */
function resetUploadList () {

    let length = 0
    for (let i = 0; i < globaluploadlist.length; i++) {
        if (globaluploadlist[i].status != -1) {
            length ++
        }       
    }
    if (length > 0) {
        if (uploadingdatanull.length > 0) {
            for (let i = 0; i < uploadingdatanull.length; i++) {
                uploadingdatabox.removeChild(uploadingdatanull[i])   
            }            
        }
        // console.log(globaluploadlist)
        for (let i = 0; i < globaluploadlist.length ; i++) {
            let dataid = 'uploadingdata' + globaluploadlist[i].id
            let delid = globaluploadlist[i].id
            if (globaluploadlist[i].status != globaluploadlist[i].statusn) {
                if (globaluploadlist[i].status == 0 && globaluploadlist[i].statusn == -2) {
                    globaluploadlist[i].statusn = 0
                    const resetuploaddata = document.getElementById(`${dataid}`)
                    if (resetuploaddata) {
                        uploadingdatabox.removeChild(resetuploaddata)
                    }
                    const b = document.createElement('div')
                    b.className = 'uploadingdata'
                    b.id = dataid
                    b.innerHTML += `
                        <div class="uploadicon">
                            <span class="spinner-border spinner-border-sm" title="正在上传"></span>
                        </div>
                        <div class="uploadinfo">
                            <div class="uploadinfoname">
                                ${globaluploadlist[i].filename}
                            </div>
                            <div class="progress uploadprogress">
                                <div class="progress-bar" style="width:0%" id="${globaluploadlist[i].id}"></div>
                            </div>
                            <div class="uploadinfopro">
                                <div class="uploadinfototle" id="${globaluploadlist[i].id}"></div>
                                <div class="uploadinfospeed" id="${globaluploadlist[i].id}"></div>
                            </div>
                        </div>
                        <div class="uploadingdatadel" title="取消上传">
                            <div class="uploaddelicon" id="${delid}">\uf00d</div>
                        </div>`
                    uploadingdatabox.insertBefore(b, uploadingdatabox.firstChild)
                }
                else if (globaluploadlist[i].status == 1 && globaluploadlist[i].statusn == 0) {
                    globaluploadlist[i].statusn = 1
                    const resetuploaddata = document.getElementById(`${dataid}`)
                    // console.log(resetuploaddata)
                    if (resetuploaddata) {
                        uploadingdatabox.removeChild(resetuploaddata)
                    }
                    const b = document.createElement('div')
                    b.className = 'uploadingdata'
                    b.id = dataid
                    b.innerHTML += `
                        <div class="uploadicon">
                        <span class="badge bg-success" title="上传成功">\uf00c</span>
                        </div>
                        <div class="uploadinfo">
                            <div class="uploadinfoname">
                                ${globaluploadlist[i].filename}
                            </div>
                            <div class="progress uploadprogress">
                                <div class="progress-bar" style="width:100%"></div>
                            </div>
                            <div class="uploadinfopro">
                                <div class="uploadinfototle">${getFileSize(globaluploadlist[i].filesize)}/${getFileSize(globaluploadlist[i].filesize)}</div>
                                <div class="uploadinfospeed"></div>
                            </div>
                        </div>
                        <div class="uploadingdatadel" title="从列表中删除">
                            <div class="uploaddelicon" id="${delid}">\uf00d</div>
                        </div>`
                    uploadingdatabox.insertBefore(b, uploadingdatabox.firstChild)
                }
                else if (globaluploadlist[i].status == 2 && globaluploadlist[i].statusn == 0) {
                    globaluploadlist[i].statusn = 2
                    const resetuploaddata = document.getElementById(`${dataid}`)
                    if (resetuploaddata) {
                        uploadingdatabox.removeChild(resetuploaddata)
                    }
                    const b = document.createElement('div')
                    b.className = 'uploadingdata'
                    b.id = dataid
                    b.innerHTML += `
                        <div class="uploadicon">
                        <span class="badge bg-danger" title="上传失败">\u0021</span>
                        </div>
                        <div class="uploadinfo">
                            <div class="uploadinfoname">
                                ${globaluploadlist[i].filename}
                            </div>
                            <div class="progress uploadprogress">
                                <div class="progress-bar" style="width:0%"></div>
                            </div>
                            <div class="uploadinfopro">
                                <div class="uploadinfototle">0/${getFileSize(globaluploadlist[i].filesize)}</div>
                                <div class="uploadinfospeed"></div>
                            </div>
                        </div>
                        <div class="uploadingdatadel" title="从列表中删除">
                            <div class="uploaddelicon" id="${delid}">\uf00d</div>
                        </div>`
                    uploadingdatabox.insertBefore(b, uploadingdatabox.firstChild)
                }
            }
        }
        const uploadingdatadel = document.getElementsByClassName("uploaddelicon")
        for (let i = 0; i < uploadingdatadel.length; i++) {
            uploadingdatadel[i].removeEventListener("click", resetUploadListen)
            uploadingdatadel[i].addEventListener('click', function(event) {
                resetUploadListen(event.target)
            })       
        }
    } else {
        if (uploadingdatanull.length == 0) {
            uploadingdatabox.innerHTML += `
            <div class="uploadingdatanull">
                暂无下载记录
            </div>`
        }
    }
}

/* 显示文件拖拽上传页面 */
function showUpLoadApi() {
    while (uploadapibox.firstChild) {
        uploadapibox.removeChild(uploadapibox.firstChild)
    }
    uploadapibox.innerHTML += `
        <div class="uploadapi" id="drop-zone">
            <span class="fileapispan">将文件拖拽于此或</span>
            <button type="button" class="btn btn-outline-secondary secondbtn"
                id="uploadfileclick">点击上传</button>
        </div>
    `
    /* 点击上传文件 */
    const uploadfileclick = document.getElementById("uploadfileclick")

    uploadfileclick.addEventListener('click', function () {
        
        // console.log('uploadfile')
        const fileInput = document.createElement('input')

        fileInput.type = 'file'
        fileInput.name = 'file'

        fileInput.onchange = function () {
            let file = this.files[0]
            // console.log(file.name)
            // console.log(file.size)
            // console.log(file.type)
            // console.log(file.lastModified)

            //选择好文件后进入预览，选择是否上传
            showMakeSureUpLoadApi(file.name, file.size)
            upLoadFile(file)
        }
        //自动触发input的点击事件
        fileInput.click()
    })

    /* 拖拽上传文件 */
    const dropZone = document.getElementById('drop-zone')

    // 防止浏览器默认打开文件
    dropZone.addEventListener('dragover', function (event) {
        event.preventDefault()
    });

    // 当文件被拖放到区域内时触发
    dropZone.addEventListener('drop', function (event) {
        event.preventDefault()
        // console.log("dropfile")
        let items = event.dataTransfer.items
        let files = event.dataTransfer.files
        let file = files[0]
        // console.log(file.name)
        // console.log(file.size)
        // console.log(file.type)
        // console.log(file.lastModified)
        let item = items[0].webkitGetAsEntry()
        if (item) {
            // 判断是否为文件夹
            if (item.isDirectory) {
                showErrUpLoadApi()
            } else {
                //选择好文件后进入预览，选择是否上传
                showMakeSureUpLoadApi(file.name, file.size)
                upLoadFile(file)
            }
        }
        
    })
}

/* 显示确认上传的文件详情页面 */
function showMakeSureUpLoadApi(filename, filesize) {
    while (uploadapibox.firstChild) {
        uploadapibox.removeChild(uploadapibox.firstChild)
    }
    uploadapibox.innerHTML += `
        <div class="uploadapi">
            <div class="makesuresend">
                <div class="filebox">
                    <div class="filelogois">\uf15b</div>
                    <div class="filenameis">${filename}</div>
                    <div>( ${getFileSize(filesize)} )</div>
                </div>
                <div class="makesure">
                    <button type="button" class="btn btn-outline-secondary secondbtn" id="yesbtn">上传</button>
                    <button type="button" class="btn btn-outline-secondary secondbtn" id="nobtn">取消</button>
                </div>
            </div>
        </div>
    `
}

/* 上传错误格式文件时显示 */
function showErrUpLoadApi() {
    while (uploadapibox.firstChild) {
        uploadapibox.removeChild(uploadapibox.firstChild);
    }
    uploadapibox.innerHTML += `
        <div class="uploadapi">
            <div class="makesuresend">
                <div class="makesuresendimage">功能待完善中</div>
                <div class="makesuresendimage">目前只支持单文件上传</div>
                <br>
                <div class="makesure">
                    <button type="button" class="btn btn-outline-secondary secondbtn" id="yesbtn">我已知晓</button>
                </div>
            </div>
        </div>
    `
    let yesbtn = document.getElementById("yesbtn")
    yesbtn.addEventListener("click", function () {
        showUpLoadApi()
    });
}

/* 文件上传功能 */
function upLoadFile(file) {
    //选择好文件后进入预览，选择是否上传

    let yesbtn = document.getElementById("yesbtn")
    let nobtn = document.getElementById("nobtn")
    //点击确认上传
    yesbtn.addEventListener("click", function () {
        // 将文件加至上传列表

        let uploadtask = {
            id: uploadid++,
            filename: file.name,
            filesize: file.size,
            statusn: -2,
            status: 0
        }
        globaluploadlist.unshift(uploadtask)
        resetUploadList()

        showUpLoadApi()

        let formData = new FormData()
        // 将文件对象添加到formData对象中
        formData.append('file', file)
        formData.append('name', file.name)
        formData.append('_token', '99ad00c891d3e9e9bc9a613314ef9890')
        formData.append('puid', '198665227')

        // console.log(formData.get("file"))

        let parentid = 0
        if (dirlist.length > 0) {
            parentid = dirlist[dirlist.length - 1]
        }

        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                let resmsg = JSON.parse(this.response)
                // console.log(resmsg.msg)
                if (this.status === 200) {
                    // 上传成功
                    for (let i = 0; i < globaluploadlist.length; i++) {
                        if (globaluploadlist[i].id == uploadtask.id) {
                            globaluploadlist[i].status = 1
                            resetUploadList()
                            break
                        }
                    }
                    let resData = JSON.parse(this.response)
                    // console.log(resData.data.objectId)
                    // console.log(parentid)
                    let toSend = { name: file.name, createrid: token.id, url:resData.data.objectId ,isfile: 1, size: file.size, parentid: parentid}
                    if (toSend) {
                        socket.emit('uploadfile', JSON.stringify(toSend))
                    }
                } else {
                    // 上传失败
                    for (let i = 0; i < globaluploadlist.length; i++) {
                        if (globaluploadlist[i].id == uploadtask.id) {
                            globaluploadlist[i].status = 2
                            resetUploadList()
                            break
                        }
                    }
                }
            }
        };

        const progressbar = document.getElementsByClassName(`progress-bar`)
        const uploadinfototle = document.getElementsByClassName(`uploadinfototle`)
        const uploadinfospeed = document.getElementsByClassName(`uploadinfospeed`)
        // 获取上传进度
        xhr.upload.addEventListener('progress', function (e) {
            let progresspercent = e.loaded / e.total * 100 + '%'
            for (let i = 0; i < progressbar.length; i++) {
                if (progressbar[i].id == uploadtask.id) {
                    progressbar[i].style.width = progresspercent
                }        
            }
            for (let i = 0; i < uploadinfototle.length; i++) {
                if (uploadinfototle[i].id == uploadtask.id) {
                    uploadinfototle[i].textContent = getFileSize(e.loaded) + '/' + getFileSize(e.total)
                }
            }
        })
        xhr.open('POST', 'http://pan-yz.chaoxing.com/upload/uploadfile?fldid=857365562672803840', true)
        xhr.send(formData)
    });
    nobtn.addEventListener("click", function () {
        showUpLoadApi()
    })
}

const uploadfile = document.getElementById("uploadfile")
const newdir = document.getElementById("newdir")
const getshare = document.getElementById("getshare")
const uploadfilemodal = document.getElementById("uploadfilemodal")
const makesureuploadfilemodal = document.getElementById("makesureuploadfilemodal")
const newfilename = document.getElementsByClassName("newfilename")[0]
const yesnewfile = document.getElementById("yesnewfile")
const newfiletip = document.getElementsByClassName("newfiletip")[0]

uploadfile.addEventListener('click', function () {
    showUpLoadApi()
})

newdir.addEventListener('click', function () {
    // 刷新一言句子
    newfiletip.textContent = getSentence()
    // 重置文件夹名输入框内容
    newfilename.value = ''
})

yesnewfile.addEventListener('click', function () {
    let newname = newfilename.value
    if (newname == '') {
        newname = '新建文件夹'
    }
    newDir(newname)
})

function newDir(name) {
    let parentid = 0
    if (dirlist.length > 0) {
        parentid = dirlist[dirlist.length - 1]
    }
    let toSend = { name: name, createrid: token.id, isfile: 0, parentid: parentid}
    if (toSend) {
        socket.emit('newdir', JSON.stringify(toSend))
    }
}

const getsharefiledatabody = document.getElementsByClassName("getsharefiledatabody")[0]
const getsharefilecodedel = document.getElementsByClassName("getsharefilecodedel")

let globalsharelist = []

/* 修改日期格式 */
function getTimeFull(timestrap) {
    const date = timestrap.slice(0, 10).replace(/-/g, '/')
    const time = timestrap.slice(11, 19)
    const formattedDateTime = `${date} ${time}`
    return formattedDateTime
}

function resetShareList () {
    while (getsharefiledatabody.firstChild) {
        getsharefiledatabody.removeChild(getsharefiledatabody.firstChild)
    }
    if (globalsharelist.length > 0) {
        for (let i = globalsharelist.length - 1; i > -1; i--) {
            getsharefiledatabody.innerHTML += `
                <tr class="getsharefiledata">
                    <td>${globalsharelist[i].filename}</td>
                    <td>${getTimeFull(globalsharelist[i].sharetime)}</td>
                    <td class="getsharefilecode">
                        <div style="width: 64px;"></div>
                        <div class="getsharefilecodenum">${globalsharelist[i].sharecode}</div>
                        <div class="getsharefilecodedel" id="${globalsharelist[i].id}">取消分享</div>
                    </td>
                </tr>
            `
        }
    } else {
        getsharefiledatabody.innerHTML += `
            <div class="sharenull">暂无分享记录</div>`
    }
    for (let i = 0; i < getsharefilecodedel.length; i++) {
        getsharefilecodedel[i].addEventListener('click', function () {
            let toSend = {
                id: getsharefilecodedel[i].id,
                sharerid: token.id
            }
            socket.emit('delshare', JSON.stringify(toSend))
            // console.log(getsharefilecodedel[i].id)
        })
    }
}

socket.on('sharelist', (sharelist) => {
    globalsharelist = sharelist
    resetShareList()
})

getshare.addEventListener('click', function () {
    resetShareList()
})