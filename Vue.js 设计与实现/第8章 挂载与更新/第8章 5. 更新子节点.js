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