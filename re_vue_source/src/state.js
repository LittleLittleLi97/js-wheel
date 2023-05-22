import { observe } from "./observer";

export function initState(vm) {
    const options = vm.$options;

    initData(vm);

    for (let key in vm._data) {
        proxyData(vm, '_data', key);
    }
}

function initData(vm) {
    let data = vm.$options.data;
    if (data) {
        data = typeof data === 'function' ? data() : data || {};
    }
    vm._data = data;
    observe(vm._data);
}

function proxyData(target, inter, key) {
    let value = target[inter][key];
    Object.defineProperty(target, key, {
        get() {
            return target[inter][key];;
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue;
                observe(newValue);
            }
        }
    });
}