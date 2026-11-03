function deepClone(obj, map = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;

    if (map.has(obj)) {
        return map.get(obj);
    }

    const result = Array.isArray(obj) ? [] : {};

    map.set(obj, result);

    for (const key of Object.keys(obj)) {
        result[key] = deepClone(obj[key], map);
    }

    return result;
}

const obj = {
    info: { c: { d: 1 } },
    age: undefined,
    func: function () {
        console.log('Hello World')
    },
    key: Symbol('一个独一无二的key'),
}

const obj2 = deepClone(obj);

console.log(obj, obj2);