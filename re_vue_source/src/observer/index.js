import { newArrayPrototype } from "./array";

class Observer {
    constructor(data) {
        if (Array.isArray(data)) {
            data.__proto__ = newArrayPrototype;
            this.walkArray(data);
        } else {
            this.walk(data);
        }
    }
    walk(data) {
        for (let key in data) {
            defineReactive(data, key, data[key]);
        }
    }
    walkArray(data) {
        for (let i = 0; i < data.length; i++) {
            observe(data[i]);
        }
    }
}

export function observe(data) {
    if (typeof data !== 'object' || data === null) {
        return;
    }
    return new Observer(data);
}

function defineReactive(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue;
                observe(newValue);
            }
        }
    })
}