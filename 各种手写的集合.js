Function.prototype.call = function(obj, ...args) {
    obj = obj ? obj : window;

    const key = Symbol();
    obj[key] = this;

    const result = obj[key](...args);
    delete obj[key];

    return result;
}

Function.prototype.apply = function(obj, args) {
    obj = obj ? obj : window;

    const key = Symbol();
    obj[key] = this;

    const result = obj[key](...args);
    delete obj[key];

    return result;
}

Function.prototype.bind = function() {
    const args = Array.prototype.slice.call(arguments);
    const _this = args.shift();
    const fn = this;

    if (typeof fn !== 'function') {
        throw new Error('not a function');
    }

    const resultFunction = function() {
        const newArgs = Array.prototype.slice.call(arguments);
        // 普通调用：new.target 是 undefined。
        // new 调用：new.target 是构造函数本身。
        // 如果函数被当作构造函数使用时，this不能被修改
        return fn.apply(new.target ? this : _this, args.concat(newArgs));
    }

    resultFunction.prototype = fn.prototype;

    return resultFunction;
}

function myNew(func, ...args) {
    const obj = {};
    obj.__proto__ = func.prototype;
    const result = func.apply(obj, args);
    return result instanceof Object ? result : obj;
}

function instance(obj, className) {
    if (!['function', 'object'].includes(typeof obj) || obj === null) {
        return false;
    }

    while (obj) {
        if (obj.__proto__ === className.prototype) {
            return true;
        }
        obj = obj.__proto__;
    }

    return false;
}