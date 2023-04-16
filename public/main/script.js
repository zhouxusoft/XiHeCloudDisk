function handleClick(event) {
    //点击菜单不触发事件
    if (!event.target.classList.contains("filemenu") && !event.target.classList.contains("dirmenu")) {
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

var filedata = document.getElementsByClassName("filedata")
var back = document.getElementById("back")
var next = document.getElementById("next")
var selected = null

function selectedClick(event) {
    console.log(event.target)
    // console.log(this)
    // 点击菜单不触发事件
    if (!event.target.classList.contains("filemenu") && !event.target.classList.contains("dirmenu")) {
        // 遍历所有 filedata 元素，判断当前点击的元素是否是 filedata 元素
        for (var i = 0; i < filedata.length; i++) {
            if (this === filedata[i]) {
                // 把之前被选中的元素的 selected 类名和事件监听器移除
                if (selected !== null && selected != this) {
                    selected.classList.remove("selected");
                    selected.removeEventListener("click", handleClick);
                }
                // 给当前被点击的元素添加 selected 类名，并存储
                this.classList.add("selected");
                selected = this;
                // 给当前被点击的元素绑定事件监听器
                this.addEventListener("click", handleClick);
                break;
            }
        }
    }
    // 判断下一级按钮是否可以被点击
    resetnext()
}

// 给所有 filedata 元素绑定点击事件监听器
for (var i = 0; i < filedata.length; i++) {
    filedata[i].addEventListener("click", selectedClick);
}