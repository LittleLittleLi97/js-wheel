// https://github.com/febobo/web-interview/issues/69

function Person(name) {
    this.name = name;
}

function mynew(func, ...args) {
    const obj = {};
    obj.__proto__ = func.prototype;
    const result = func.apply(obj, args);
    return result instanceof Object ? result : obj;
}

const p = mynew(Person, 'hisname');
console.log(p);