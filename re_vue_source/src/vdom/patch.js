function createElement(vnode) {
    const {tag, data, children, text} = vnode;

    
    if (tag) { // element
        const dom = document.createElement(tag);
        for (let key in data) {
    
            if (key === 'style') {
    
                const styleObj = data[key];
                for (let styleKey in styleObj) {
                    dom.style[styleKey] = styleObj[styleKey];
                }
            } else {
                dom.setAttribute(key, data[key]);
            }
        }
    
        if (children) {
            children.forEach((child)=>{
                dom.appendChild(createElement(child));
            });
        }

        return dom;
    } else { // text
        return document.createTextNode(text);
    }
}

export function patch(oldNode, vnode) {
    if (oldNode.nodeType) {
        const dom = createElement(vnode);
        const parentDom = oldNode.parentNode;

        parentDom.insertBefore(dom, oldNode.nextSibling);
        parentDom.removeChild(oldNode);

        return dom;
    }
}