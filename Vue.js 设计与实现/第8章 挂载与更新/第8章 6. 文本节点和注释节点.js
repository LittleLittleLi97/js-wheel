// 文本节点和注释节点不同于普通标签节点，没有标签名称。
// 如：<div><!-- 注释节点 -->文本节点</div>

const Text = Symbol();
const Comment = Symbol();

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
            const el = n2.el = document.createTextNode(n2.children);
            insert(el, container);
        } else {
            const el = n2.el = n1.el;
            if (n2.children !== n1.children) {
                el.nodeValue = n2.children;
            }
        }
    }
}