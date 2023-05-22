// 渲染器，将vnode渲染为特定平台上的真实元素。

function createRenderer() {

    function mountElement(vnode, container) { // 挂载vnode
        const el = document.createElement(vnode); // 创建dom
        if (typeof vnode.children === 'string') { // 如果子节点是字符串，代表元素具有文本节点
            el.textContent = vnode.children;
        }
        container.appendChild(el); // 将元素添加到container中
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
            if (container._vnode) { // 如果旧节点_vnode不存在，说明dom的内容为空，不需要卸载
                container.innerHTML = ''; // 具体卸载节点的方法看第8章
            }
        }

        container._vnode = vnode; // 保存vnode
    }
    return {
        render
    }
}