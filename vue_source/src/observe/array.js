import { observe } from "./index";

const oldArrayProto = Array.prototype;

export const newArrayProto = Object.create(oldArrayProto);

const arrMethods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'splice',
    'sort'
];

arrMethods.forEach(method=>{
    newArrayProto[method] = function(...args) {

        const result = oldArrayProto[method].call(this, ...args);

        const ob = this.__ob__; // this指向数组本身，数组挂上了Observer对象

        let inserted;

        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }

        // inserted && observe(inserted);
        ob.observeArray(inserted);
        ob.dep.notify();

        return result;
    }
})