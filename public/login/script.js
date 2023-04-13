let passwords = document.querySelectorAll('.passwordBox')
let logoButtons = document.querySelectorAll('.logoButton')
for (let i = 0; i < logoButtons.length; i++) {
    logoButtons[i].onclick = function () {
        if (passwords[i].type === 'password') {
            passwords[i].setAttribute('type', 'text')
            logoButtons[i].classList.add('hide')
        }
        else {
            passwords[i].setAttribute('type', 'password')
            logoButtons[i].classList.remove('hide')
        }
    }
}

let msg = document.getElementsByClassName("msg")[0]
let from = document.getElementsByClassName("from")[0]

// 获取每日一言
let xhr = new XMLHttpRequest()
// xhr.onreadystatechange = function () {
//     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        
//     }
// }
xhr.open('POST', 'https://v1.hitokoto.cn/', false)
xhr.send()
let resData = JSON.parse(xhr.responseText)
let datamsg = resData.hitokoto
let datafrom = '—— 「 ' + resData.from + ' 」'
// 修改每日一言内容
msg.textContent = datamsg
from.textContent = datafrom

const loginForm = document.getElementById("loginForm")

loginForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let xhr = new XMLHttpRequest()
    let data = {
        username: this.username.value,
        password: this.password.value
    }
    let formData = ''
    for (let key in data) {
        formData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
    }
    formData = formData.slice(0, -1)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let resData = JSON.parse(this.response)
            if (resData.status == 0) {
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(resData.token))
                window.location = 'https://godxu.top'
            } else {
                alert(resData.message)
            }
        } 
    }
    xhr.open('POST', 'http://localhost:30019/api/login', true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(formData)
})

let borderbox = document.getElementsByClassName("borderbox")[0]
let inputbox = document.getElementsByTagName("input")

for (let i = 0; i < inputbox.length; i++) {
    inputbox[i].addEventListener('focus', function() {
        borderbox.classList.add("hidden")
    });
    inputbox[i].addEventListener('blur', function() {
        borderbox.classList.remove("hidden")
    });
}