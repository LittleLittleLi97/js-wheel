import { newArrayProto } from "./array";
import { Dep } from "./dep";

class Observer {
    constructor(data) {
        
        this.dep = new Dep();

        // data.__ob__ = this; // this指向此对象，可以用于调用observeArray，但是这么写会被遍历到，重复调用而报错
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false // 设置不可被遍历
        })

        if (Array.isArray(data)) {
            data.__proto__ = newArrayProto;
            this.observeArray(data);

        } else {
            this.walk(data);
        }
    }
    walk(data) {
        Object.keys(data).forEach(key=>defineReactive(data, key, data[key]));
    }
    observeArray(data) {
        data.forEach(item=>observe(item));
    }
}

function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        const current = value[i];
        current.__ob__ && current.__ob__.dep.depend();
        if (Array.isArray(current)) {
            dependArray(current);
        }
    }
}

export function defineReactive(target, key, value) {
    const childOb = observe(value);
    const dep = new Dep();
    Object.defineProperty(target, key, {
        get() {
            if (Dep.target !== null) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set(newValue) {
            if (value === newValue) return;
            observe(value);
            value = newValue;
            dep.notify();
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data === null) return;

    return new Observer(data);
}