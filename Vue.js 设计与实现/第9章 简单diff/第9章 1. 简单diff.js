function patchChildren(n1, n2, container) {
    if (typeof n2.children === 'string') {
        // 省略
    } else if (Array.isArray(n2.children)) {
        if (Array.isArray(n1.children)) {
            
            const newChildren = n2.children;
            const oldChildren = n1.children;

            let lastIndex = 0;
            // lastIndex相当于pivot，找到一个pivot后，将pivot对应的节点视为已经放到新的newVNode序列的正确位置。
            // 如果节点在oldVNode的索引小于pivot，说明此节点在newVNode序列中在pivot节点之后，在oldVNode序列中在pivot节点之前，将其后置。
            // 如果大于pivot，此节点在正确的位置，并更新pivot。
            for (let i = 0; i < newChildren.length; i++) {
                const newVNode = newChildren[i];

                let find = false; // 标记是否在oldVNode中找到了此节点

                for (let j = 0; j < oldChildren.length; j++) {
                    const oldVNode = oldChildren[j];

                    if (newVNode.key === oldVNode.key) {
                        find = true;
                        if (j < lastIndex) {
                            // 将节点插入到上一个节点(newVnode中的)之后
                            const preVNode = newChildren[i - 1];
                            if (preVNode) {
                                const anchor = preVNode.el.nextSibling;
                                insert(el, container, anchor);
                            } // 如果没有上一个节点，那就不用移动
                        } else {
                            lastIndex = j;
                        }
                    }
                    break;
                }
                if (!find) { // 没有找到此节点，需要添加
                    const preVNode = newChildren[i - 1];
                    let anchor = null;

                    if (preVNode) {
                        anchor = preVNode.el.nextSibling;
                    } else { // 没有前一个vnode，说明新节点是第一个子节点
                        anchor = container.firstChild; // 使用container的firstChild作为anchor
                    }

                    patch(null, newVNode, container, anchor);
                }
            }

            // 遍历寻找应该删除的节点
            for (let i = 0; i < oldChildren.length; i++) {
                const oldVNode = oldChildren[i];
                const has = newChildren.find(newVNode => newVNode.key === oldVNode.key);
                if (!has) {
                    unmount(oldVNode);
                }
            }
        } else {
            // 省略
        }
    } else {
        // 省略
    }
}

// patch和mountElement需要加上anchor参数

function patch(n1, n2, container, anchor) {
    // 省略

    if (typeof n2.type === 'string') {
        if (!n1) {
            mountElement(n2, container, anchor);
        } else {
            patchElement(n1, n2);
        }
    }

    // 省略
}

function mountElement(vnode, container, anchor) {
    // 省略

    insert(el, container, anchor);
}