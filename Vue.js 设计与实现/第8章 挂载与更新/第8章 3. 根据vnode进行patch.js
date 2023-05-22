// 新vnode与旧vnode的类型可能不同，如一个是input标签，一个是p标签，这时需要将之前的dom卸载，然后挂载新的dom。
// 而且vnode描述的不仅有元素，也有组件、Fragment等，具有不同的操作。

function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
        unmount(n1);
        n1 = null; // 保证之后的挂载能够执行
    }

    const { type } = n2;
    if (typeof type === 'string') { // 普通标签元素
        if (!n1) {
            mountElement(n2, container);
        } else {
            patchElement(n1, n2);
        }
    } else if (typeof type === 'object') {
        // 组件
    } else {
        // 其它类型
    }
}