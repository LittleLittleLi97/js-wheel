function mountElement(vnode, container) {
    const el = vnode.el = createElement(vnode.type); // vnode挂上el，卸载的时候可以找到真实dom元素

    // 省略children处理

    // 省略props处理
}

function render(vnode, container) {
    if (vnode) {
        patch(container._vnode, vnode, container);
    } else { // 新的vnode为空
        if (container._vnode) {
            unmount(container._vnode);
        }
    }
}

function unmount(vnode) {
    // 卸载操作
    // 之后还会添加新的操作，如lifecycle中的hook。
    const parent = vnode.el.parent;
    if (parent) {
        parent.removeChild(vnode.el);
    }
}