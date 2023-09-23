// 定义socket对象
const socket = io('http://127.0.0.1:30020')


function downLoadFile(url) {
    // console.log('down')
    let downloadUrl = 'https://sharewh1.xuexi365.com/share/download/' + url
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
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')
const toastbody = document.getElementsByClassName("toast-body")[0]
const downloadfilesizetip = document.getElementById("downloadfilesizetip")
const downloadfilenametip = document.getElementById("downloadfilenametip")
const yeslogout = document.getElementById("yeslogout")
var filedata = document.getElementsByClassName("filedata")
var back = document.getElementById("back")
var next = document.getElementById("next")
var topmenu = document.getElementsByClassName("topmenu")[0]
var selected = null
var dirselected = 0
let downloadfileurl = ''
let downloadfilename = ''
let downloadfilesize = ''

if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample, { delay: 3000 })
        toast.show()
    })
}

yesdownload.addEventListener('click', function () {
    downLoadFile(downloadfileurl)
    toastbody.textContent = downloadfilename
    downloadfilesizetip.textContent = downloadfilesize
    downloadfilenametip.textContent = '即将开始下载'
    liveToastBtn.click()
})

// 获取文件操作菜单按钮和文件操作菜单
var filemenus = document.getElementsByClassName("filemenu")
var filepops = document.getElementsByClassName("filepop")
var dirmenus = document.getElementsByClassName("dirmenu")
var dirpops = document.getElementsByClassName("dirpop")
var rowborder = document.getElementsByClassName("rowborder")[0]

// 选中后再次点击

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

const getsharefiledatabody = document.getElementsByClassName("getsharefiledatabody")[0]
const getsharefilecodedel = document.getElementsByClassName("getsharefilecodedel")
const getsharefiledatahead = document.getElementsByClassName("getsharefiledatahead")[0]
const sharefiletitle = document.getElementById("sharefiletitle")

let globalsharelist = []

socket.on('sharelist', (sharelist) => {
    globalsharelist = sharelist
    resetShareList()
})

getshare.addEventListener('click', function () {
    resetShareList()
})

const getshareinputbtn = document.getElementsByClassName("getshareinputbtn")[0]
const getshareinput = document.getElementsByClassName("getshareinput ")[0]

function getShareFile(shareid) {
    // console.log(fileid)
    let toSend = {
        shareid: shareid,
        userid: token.id
    }
    socket.emit('getsharefile', JSON.stringify(toSend))
}

// 点击获取分享按钮
getshareinputbtn.addEventListener('click', function () {
    let shareid = getshareinput.value
    if (shareid != '') {
        getShareFile(shareid)
    }
})

// 点击获取分享后发生，选择是否获取
socket.on('getsharefile', (hasfile) => {
    // console.log(hasfile)
    while (getsharefiledatabody.firstChild) {
        getsharefiledatabody.removeChild(getsharefiledatabody.firstChild)
    }
    if (hasfile == 0) {
        getsharefiledatabody.innerHTML += `<span class="noshare">分享码有误</span>
            <div class="sharebtnbox">
                <button type="button" class="btn btn-outline-secondary secondbtn"
                    id="closesharemodal">返回</button>
            </div>
        `
    } else {
        if (hasfile.isfile == 1) {
            getsharefiledatabody.innerHTML += `
                <div class="filebox">
                    <div class="filelogois">\uf15b</div>
                    <div class="filenameis">${hasfile.name}</div>
                    <div>( ${getFileSize(hasfile.size)} )</div>
                </div>
                <div class="sharebtnbox">
                    <button type="button" class="btn btn-outline-secondary secondbtn" data-bs-dismiss="modal"
                        id="yesgetshare">下载</button>
                    <button type="button" class="btn btn-outline-secondary secondbtn"
                        id="closesharemodal">取消</button>
                </div>
            `
        } else {
            getsharefiledatabody.innerHTML += `<span class="noshare">无法直接获取文件夹</span>`
        }
        const yesgetshare = document.getElementById("yesgetshare")
        yesgetshare.addEventListener('click', function () {
            getshareinput.value = ''
            let parentid = 0
            if (dirlist.length > 0) {
                parentid = dirlist[dirlist.length - 1]
            }
            let toSend = {
                file: hasfile,
                userid: token.id,
                parentid: parentid
            }
            // console.log(parentid)
            socket.emit('yesgetsharefile', JSON.stringify(toSend))
        })
    }
    const closesharemodal = document.getElementById("closesharemodal")
    closesharemodal.addEventListener('click', function () {
        getshareinput.value = ''
        resetShareList()
    })
})