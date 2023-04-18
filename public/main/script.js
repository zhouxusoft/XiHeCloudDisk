function handleClick(event) {
    //点击菜单不触发事件
    if (!event.target.classList.contains("btn-sm") && !event.target.classList.contains("dirmenu") && !event.target.classList.contains("filemenu")) {
        alert(666)
        // 选中事件点击过一次后，移除被选中属性并且移除监听事件
        selected.classList.remove("selected")
        selected.removeEventListener('click', handleClick)
        selected = null
        // 判断下一级按钮是否可以被点击
        resetnext()
    }
}

function resetnext() {
    if (selected != null) {
        next.classList.remove("disabled")
    } else {
        next.classList.add("disabled")
    }
}

const filedata = document.getElementsByClassName("filedata")
const back = document.getElementById("back")
const next = document.getElementById("next")
const selected = null

function selectedClick(event) {
    // console.log(event.target)
    // console.log(this)
    // 点击菜单不触发事件
    if (!event.target.classList.contains("btn-sm")) {
        // 遍历所有 filedata 元素，判断当前点击的元素是否是 filedata 元素
        for (var i = 0; i < filedata.length; i++) {
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
    resetnext()
}

// 给所有 filedata 元素绑定点击事件监听器
for (var i = 0; i < filedata.length; i++) {
    filedata[i].addEventListener("click", selectedClick)
}

const filemenus = document.getElementsByClassName("filemenu")
const filepops = document.getElementsByClassName("filepop")
const dirmenus = document.getElementsByClassName("dirmenu")
const dirpops = document.getElementsByClassName("dirpop")
const rowborder = document.getElementsByClassName("rowborder")[0]

for (var i = 0; i < dirmenus.length; i++) {
    dirmenus[i].addEventListener('mouseenter', function () {
        const rowborderP = rowborder.getBoundingClientRect()
        const dirmenuP = dirmenus[i].getBoundingClientRect()

        if (rowborderP.top + rowborderP.height / 2 < dirmenuP.top) {
            dirpops[i].classList.remove("dirpopdown")
            dirpops[i].classList.add("dirpopup")
        } else {
            dirpops[i].classList.remove("dirpopup")
            dirpops[i].classList.add("dirpopdown")
        }
    })
}

for (var i = 0; i < filemenus.length; i++) {
    filemenus[i].addEventListener('mouseenter', function () {
        const rowborderP = rowborder.getBoundingClientRect()
        const filemenuP = filemenus[i].getBoundingClientRect()

        if (rowborderP.top + rowborderP.height / 2 < filemenuP.top) {
            filepops[i].classList.remove("filepopdown")
            filepops[i].classList.add("filepopup")
        } else {
            filepops[i].classList.remove("filepopup")
            filepops[i].classList.add("filepopdown")
        }
    })
}