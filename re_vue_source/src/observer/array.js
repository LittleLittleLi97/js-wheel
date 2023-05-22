import { observe } from ".";

const oldArrayPrototype = Array.prototype;

const arrMethods = [
    'pop',
    'push',
    'shift',
    'unshift',
    'reverse',
    'splice',
    'sort'
];

export const newArrayPrototype = Object.create(oldArrayPrototype);

arrMethods.forEach((method)=>{
    newArrayPrototype[method] = function(...args) {

        const result = Array.prototype[method].call(this, ...args);

        let newValue;
        switch(method) {
            case 'push':
            case 'unshift':
                newValue = args;
                break;
            case 'splice':
                newValue = args.slice(2);
                break;
            default:
                break;
        }

        if (newValue) {
            observe(newValue);
        }

        return result;
    }
})