// 第7章和第8章的代码总结

const Text = Symbol();
const Comment = Symbol();

function createRenderer(options) {
    const {
        createElement,
        setElementText,
        insert,
        createText,
        setText,
        patchProps
    } = options;

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
    function patch(n1, n2, container) {
        if (n1 && n1.type !== n2.type) {
            unmount(n1);
            n1 = null;
        }
    
        const { type } = n2;
        if (typeof type === 'string') {
            if (!n1) {
                mountElement(n2, container);
            } else {
                patchElement(n1, n2);
            }
        } else if (type === Text) {
            if (!n1) {
                const el = n2.el = createText(n2.children);
                insert(el, container);
            } else {
                const el = n2.el = n1.el;
                if (n2.children !== n1.children) {
                    setText(el, n2.children);
                }
            }
        } else if (typeof type === 'object') {
            // 组件
        } else {
            // 其它类型
        }
    }
    function mountElement(vnode, container) {
        const el = vnode.el = createElement(vnode.type);
    
        if (typeof vnode.children === 'string') {
            setElementText(el, vnode.children);
        } else if (Array.isArray(vnode.children)) { // 如果有多个子节点
            vnode.children.forEach(child => {
                patch(null, child, el);
            });
        }
        
        if (vnode.props) { // 设置元素的属性
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key]);
            }
        }
        
        insert(el, container);
    }
    function patchElement(n1, n2) {
        const el = n2.el = n1.el;
        const oldProps = n1.props;
        const newProps = n2.props;
    
        // 更新props
        for (const key in newProps) {
            if (newProps[key] !== oldProps[key]) { // props不一致，更新props
                patchProps(el, key, oldProps[key], newProps[key]);
            }
        }
        for (const key in oldProps) {
            if (!(key in newProps)) { // 新的props中不包含旧的props，则去掉
                patchProps(el, key, oldProps[key], null)
            }
        }
    
        patchChildren(n1, n2, el); // 更新children
    }
    function patchChildren(n1, n2, container) {
        if (typeof n2.children === 'string') { // 新vnode子节点为文本
            if (Array.isArray(n1.children)) { // 如果旧vnode有一组子节点，需要删除
                n1.children.forEach(child => unmount(child));
            }
            setElementText(container, n2.children); // 设置文本
        } else if (Array.isArray(n2.children)) { // 新vnode有一组子节点
            if (Array.isArray(n1.children)) { // 如果旧vnode也有一组子节点，需要diff
                // 这里简单将旧节点全部unmount，新节点全部patch
                n1.children.forEach(child => unmount(child));
                n2.children.forEach(child => patch(null, child, container));
            } else { // 如果旧vnode子节点为文本，将文本删除，然后patch新节点
                setElementText(container, '');
                n2.children.forEach(child => patch(null, child, container));
            }
        } else { // 新vnode没有子节点
            if (Array.isArray(n1.children)) { // 如果旧vnode有一组子节点，需要删除
                n1.children.forEach(child => unmount(child));
            } else if (typeof n1.children === 'string') { // 如果旧vnode子节点为文本，需要删除
                setElementText(container, '');
            }
        }
    }

    return {
        render,
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
    },
    createText(text) {
        return document.createTextNode(text);
    },
    setText(el, text) {
        el.nodeValue = text;
    },
    patchProps(el, key, preValue, nextValue) { // 看8.3和8.4节
        if (key === 'class') {
            el.className = nextValue || '';
        } else if (shouldSetAsProps(el, key, nextValue)) {
            const type = typeof el[key];
            if (type === 'boolean' && nextValue === '') {
                el[key] = true;
            } else {
                el[key] = nextValue;
            }
        } else {
            el.setAttribute(key, nextValue);
        }
    }
});

function shouldSetAsProps(el, key, value) {
    if (key === 'form' && el.tagName === 'INPUT') return false;
    return key in el;
}