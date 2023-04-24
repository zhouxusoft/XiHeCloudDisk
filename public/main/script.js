//拿到登录的token
//判断值是否为空
let token = JSON.parse(localStorage.getItem("token"))
if (!token) {
    window.location = '../login/'
}

// 定义socket对象
const socket = io('http://127.0.0.1:30020')

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
            alert(666)
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

var filedata = document.getElementsByClassName("filedata")
var back = document.getElementById("back")
var next = document.getElementById("next")
var topmenu = document.getElementsByClassName("topmenu")[0]
var selected = null
var dirselected = 0

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
            console.log(event.target)
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
    return sonlist
}

// 刷新文件列表
function resetFilePage(parentid) {
    // 删除元素在添加 以刷新
    clearRowbox()
    // 清除选中文件夹
    dirselected = 0
    let filelist = getDirSonData(globalfilelist, parentid)
    // console.log(filelist)
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
                                    <div class="btn-group-vertical menubtngroup">
                                        <button type="button" class="copy btn btn-sm btn-outline-secondary secondbtn">复制</button>
                                        <button type="button" class="move btn btn-sm btn-outline-secondary secondbtn">移动</button>
                                        <button type="button" class="share btn btn-sm btn-outline-secondary secondbtn">分享</button>
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
                                    <div class="btn-group-vertical menubtngroup">
                                        <button type="button" class="copy btn btn-sm btn-outline-secondary secondbtn">复制</button>
                                        <button type="button" class="move btn btn-sm btn-outline-secondary secondbtn">移动</button>
                                        <button type="button" class="share btn btn-sm btn-outline-secondary secondbtn">分享</button>
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

// 清除文件夹导航栏的元素
function clearPosition() {
    while (position.firstChild) {
        position.removeChild(position.firstChild)
    }
    position.innerHTML += `<div class="positionbtn" id="0">主目录</div>`
}

// 获取文件夹导航栏元素
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

// 向文件夹导航栏添加子元素
function addDirNavBar(name, id) {
    position.innerHTML += `
        <div class="positionwhite"></div>
        <div class="positionbtn" id="${id}">${name}</div>`
    
}

// 刷新文件夹导航栏
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
    if(dirlist.length > 0) {
        const id = dirlist[dirlist.length - 1]
        resetFilePage(id)
        resetDirNavBar(id)
    } else {
        resetFilePage(0)
        resetDirNavBar(0)
    }
    resetNext()
})

const pop = document.getElementsByClassName("pop")[0]
const overlay = document.getElementsByClassName("overlay")[0]

function showpop () {
    pop.style.display = "block";
    overlay.style.height = "100%";
    overlay.style.transition = "none"

    //添加并获取关闭按钮 注册监听事件
    pop.innerHTML += `<div class="closebtn"></div>`;
    pop.addEventListener("click", function (event) {
        if (event.target.classList.contains("closebtn")) {
            hidePop();
        }
    });
}

function hidePop() {
    pop.style.display = "none";
    overlay.style.height = "0";
    overlay.style.transition = "0.5s ease-out"
}

const uploadfile = document.getElementById("uploadfile")
const newdir = document.getElementById("newdir")
const getshare = document.getElementById("getshare")

uploadfile.addEventListener('click', function () {
    showpop()
    pop.innerHTML += `
        <div class="uploading">
            <div class="uploadingspan">正在上传：</div>
            <div class="uploadingdata">
                <span class="spinner-border spinner-border-sm"></span>
                HelloWorld.mp4
            </div>
            <div class="uploadingdata">
                <span class="spinner-border spinner-border-sm"></span>
                HelloWorld.mp4
            </div>
            <div class="uploadingdata">
                <span class="spinner-border spinner-border-sm"></span>
                HelloWorldadwadawdawdwad.mp4
            </div>
            <div class="uploadingdata">
                <span class="spinner-border spinner-border-sm"></span>
                HelloWorld.mp4
            </div>
            <div class="uploadingdata">
                <span class="spinner-border spinner-border-sm"></span>
                HelloWorld.mp4
            </div>
            <div class="uploadingdata">
                <span class="spinner-border spinner-border-sm"></span>
                HelloWorld.mp4
            </div>
        </div>
        <div class="uploadapi">
            <span class="fileapispan">将文件拖拽于此或</span>
            <button type="button" class="btn btn-outline-secondary secondbtn" id="uploadfile">点击上传</button>
        </div>
    `
})

newdir.addEventListener('click', function () {
    showpop()
})

getshare.addEventListener('click', function () {
    showpop()
})