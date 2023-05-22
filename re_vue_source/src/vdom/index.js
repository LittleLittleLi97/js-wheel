export function createElementVNode(vm, tag, data, ...children) {
    const key = data.key;
    if (key) delete data.key;
    return createVNode(vm, tag, key, data, children, undefined);
}

export function createTextVNode(vm, text) {
    return createVNode(vm, undefined, undefined,undefined,undefined, text);
}

export function createVNode(vm, tag, key, data, children, text) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}