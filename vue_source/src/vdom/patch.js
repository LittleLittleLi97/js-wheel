import { isSameVNode } from ".";

export function createElement(vnode) {
    const {tag, data, children, text} = vnode;
    let element;
    if (typeof tag === 'string') {
        element = document.createElement(tag);
        vnode.el = element;
        patchAttrs(element, data);
        children.forEach(child => {
            element.appendChild(createElement(child));
        });
    } else {
        element = document.createTextNode(text);
        vnode.el = element;
    }
    return vnode.el;
}
export function patchAttrs(element, attrs) {
    for (let key in attrs) {
        if (key === 'style') {
            for (let styleName in attrs[key]) {
                element.style[styleName] = attrs[key][styleName];
            }
        } else {
            element.setAttribute(key, attrs[key]);
        }
    }
}

export function patch(oldVNode, vnode) {
    if (oldVNode.nodeType) { // 第一次patch
        const oldElement = oldVNode;
        const newElement = createElement(vnode);
        const parentDom = oldElement.parentNode;
        parentDom.insertBefore(newElement, oldElement.nextSibling);
        parentDom.removeChild(oldElement);

        return newElement;
    } else { // diff
        return patchVNode(oldVNode, vnode);
    }
}

function patchVNode(oldVNode, vnode) {
    if (!isSameVNode(oldVNode, vnode)) {
        let el = createElement(vnode);
        oldVNode.el.parentNode.replaceChild(el, oldVNode);
        return el;
    }

    // 文本
    let el = vnode.el = oldVNode.el;
    if (!oldVNode.tag) {
        if (oldVNode.text !== vnode.text) {
            el.textContent = vnode.text;
        }
    }
}