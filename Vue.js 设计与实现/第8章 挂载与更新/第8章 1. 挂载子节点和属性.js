const vnode = {
    type: 'div',
    props: {
        id: 'foo'
    },
    children: [
        {
            type: 'p',
            children: 'hello'
        }
    ]
};

function mountElement(vnode, container) {
    const el = createElement(vnode.type);

    if (typeof vnode.children === 'string') {
        setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) { // 如果有多个子节点
        vnode.children.forEach(child => {
            patch(null, child, el);
        });
    }
    
    if (vnode.props) { // 设置元素的属性
        for (let key in vnode.props) {
            // 这里只是简单实现，具体情况要更复杂，参考8.2～8.4节。
            // 代码可以封装为patchProps，如第7章中使用options指定。
            el.setAttribute(key, vnode.props[key]);
            // el[key] = vnode.props[key]; // 也可以这样设置
        }
    }
    
    insert(el, container);
}