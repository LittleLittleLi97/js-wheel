// 加入options，使渲染器称为一个不依赖于浏览器平台（跨平台）的通用渲染器。
// 也就是把对浏览器特有的API抽离，在createRenderer时指定。

function createRenderer(options) {

    const {
        createElement,
        insert,
        setElementText
    } = options;

    function mountElement(vnode, container) { // 挂载vnode
        const el = createElement(vnode); // 创建dom
        if (typeof vnode.children === 'string') { // 如果子节点是字符串，代表元素具有文本节点
            setElementText(el, vnode.children)
        }
        insert(el, container) // 将元素添加到container中
    }
    function patch(n1, n2, container) { // n1为旧的vnode，n2为新的vnode
        if (!n1) { // 旧的vnode不存在，说明是第一次挂载节点
            mountElement(n2, container);
        } else { // 旧的vnode存在，需要打补丁
            // 此处省略
        }
    }
    function render(vnode, container) {
        if (vnode) { // vnode有值
            patch(container._vnode, vnode, container);
        } else { // vnode为空，删除节点
            if (container._vnode) {  // 如果旧节点_vnode不存在，说明dom的内容为空，不需要卸载
                container.innerHTML = ''; // 具体卸载节点的方法看第8章
            }
        }

        container._vnode = vnode; // 保存vnode
    }
    return {
        render
    }
}

const renderer = createRenderer({
    createElement(tag) {
        return document.createElement(tag);
    },
    setElementText(el, text) {
        el.textContent = text;
    },
    insert(el, parent, anchor=null) { // 这里anchor是个啥，得查一下
        parent.insertBefore(el, anchor);
    }
})