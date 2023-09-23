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

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')
const toastbody = document.getElementsByClassName("toast-body")[0]

if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample, { delay: 4000 })
        toast.show()
    })
}

const getsharefiledatabody = document.getElementsByClassName("getsharefiledatabody")[0]
const getshareinputbtn = document.getElementsByClassName("getshareinputbtn")[0]
const getshareinput = document.getElementsByClassName("getshareinput ")[0]
const downloadfilesizetip = document.getElementById("downloadfilesizetip")
const downloadfilenametip = document.getElementById("downloadfilenametip")

let currenturl = window.location.href
let code = currenturl.split('=')[1]
if (code != undefined && code != '') {
    getshareinput.value = code
    getShareFile(code)
}

function getShareFile(shareid) {
    // console.log(fileid)
    let toSend = {
        shareid: shareid,
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
                    id="closesharemodal">&nbsp;返回&nbsp;</button>
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
                    <button type="button" class="btn btn-outline-secondary secondbtn mx-1" data-bs-dismiss="modal"
                        id="yesgetshare">&nbsp;下载&nbsp;</button>
                    <button type="button" class="btn btn-outline-secondary secondbtn mx-1"
                        id="closesharemodal">&nbsp;取消&nbsp;</button>
                </div>
            `
        } else {
            getsharefiledatabody.innerHTML += `<span class="noshare">无法直接获取文件夹</span>`
        }
        const yesgetshare = document.getElementById("yesgetshare")
        yesgetshare.addEventListener('click', function () {
            getshareinput.value = ''
            downLoadFile(hasfile.url)
            toastbody.textContent = hasfile.name
            downloadfilesizetip.textContent = getFileSize(hasfile.size)
            downloadfilenametip.textContent = '即将开始下载'
            liveToastBtn.click()
        })
    }
    const closesharemodal = document.getElementById("closesharemodal")
    closesharemodal.addEventListener('click', function () {
        getshareinput.value = ''
        while (getsharefiledatabody.firstChild) {
            getsharefiledatabody.removeChild(getsharefiledatabody.firstChild)
        }
        getsharefiledatabody.innerHTML += `<h1 class="modal-title fs-5" id="sharefiletitle">获取分享</h1>`
    })
})