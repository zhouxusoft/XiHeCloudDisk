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
        alert(666)
        // 选中事件点击过一次后，移除被选中属性并且移除监听事件
        selected.classList.remove("selected")
        selected.removeEventListener('click', handleClick)
        selected = null
        // 判断下一级按钮是否可以被点击
        resetNext()
    }
}

function resetNext() {
    // 判断下一级菜单是否可点击
    if (selected != null) {
        next.classList.remove("disabled")
    } else {
        next.classList.add("disabled")
    }
}

var filedata = document.getElementsByClassName("filedata")
var back = document.getElementById("back")
var next = document.getElementById("next")
var selected = null

// 获取文件操作菜单按钮和文件操作菜单
var filemenus = document.getElementsByClassName("filemenu")
var filepops = document.getElementsByClassName("filepop")
var dirmenus = document.getElementsByClassName("dirmenu")
var dirpops = document.getElementsByClassName("dirpop")
var rowborder = document.getElementsByClassName("rowborder")[0]

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
                // 给当前被点击的元素绑定事件监听器
                this.addEventListener("click", handleClick)
                break;
            }
        }
    }
    // 判断下一级按钮是否可以被点击
    resetNext()
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
}

// 获取到文件项的容器
const rowbox = document.getElementsByClassName("rowbox")[0]

function clearRowbox() {
    while (rowbox.firstChild) {
        rowbox.removeChild(rowbox.firstChild)
    }
}

function getDate(datetime) {
    // console.log(datetime)
    let date = datetime.slice(0, 10)
    date = date.replace(/-/g, '/')
    return date
}

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

function resetFilePage(filelist) {
    if (filelist.length > 0) {
        // 文件夹在前 文件在后
        for (let i = 0; i < filelist.length; i++) {
            if (filelist[i].isfile == 0) {
                const filename = filelist[i].name
                const updatetime = getDate(filelist[i].update)
                const dirson = filelist[i].subitem + ' 项'
                rowbox.innerHTML += `
                    <div class="col-md-6 col-xl-4 databox mb-2">
                        <div class="filedata">
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
                                    <div class="btn-group-vertical">
                                        <button type="button" class="btn btn-sm btn-outline-secondary secondbtn">复制</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary secondbtn">移动</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary secondbtn">分享</button>
                                        <button type="button"
                                            class="btn btn-sm btn-outline-secondary secondbtn">重命名</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary secondbtn">删除</button>
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
                        <div class="filedata">
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
                                    <div class="btn-group-vertical">
                                        <button type="button" class="btn btn-sm btn-outline-secondary secondbtn">复制</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary secondbtn">移动</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary secondbtn">分享</button>
                                        <button type="button"
                                            class="btn btn-sm btn-outline-secondary secondbtn">重命名</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary secondbtn">删除</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
            }
        }
    } else {

    }
    resetPageFun()
}

// 客户端连接成功时触发
socket.on('connect', () => {
    socket.emit('login', JSON.stringify(token))
})

// 更新文件列表页面时触发
socket.on('updatepage', (filelist) => {
    // console.log(filelist)
    resetFilePage(filelist)
})