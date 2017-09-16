'use babel';

function on(eventType, target, callback) {
    this.addEventListener(eventType, (e) => {
        const el = e.target;
        if (el && el.matches(target)) {
            callback(e);
        }
    });
}

//DOM没有提供insertAfter()方法
function insertAfter(el) {
    var parent = this.parentNode;
    if (parent.lastChild == this) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parent.appendChild(el);
    } else {
        parent.insertBefore(el, this.nextSibling);
        //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
    }
}

export default function (el) {
    return {
        on: on.bind(el),
        insertAfter: insertAfter.bind(el)
    };
}
