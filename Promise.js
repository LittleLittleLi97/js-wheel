// https://github.com/qiruohan/article/blob/master/promise/promise.js

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) return reject('cycle');

    let called = false;
    if ((typeof x === 'object' && x != null) || typeof x === 'function') {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, (y)=>{
                    if (called) return;
                    called = true;
                    resolvePromise(promise, y, resolve, reject);
                }, (r)=>{
                    if (called) return;
                    called = true;
                    reject(r);
                })
            } else {
                resolve(x);
            }
        } catch (error) {
            if (called) return;
            called = true;
            reject(error);
        }
    } else {
        resolve(x);
    }
}

// 简化版resolvePromise
function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) return new Error('cycle');

    if (x instanceof MyPromise) {
        x.then(resolve, reject);
    } else {
        resolve(x);
    }
}

class MyPromise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.resolveCallbacks = [];
        this.rejectCallbacks = [];

        const resolve = (value)=>{
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.resolveCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason)=>{
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.rejectCallbacks.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};
        const promise2 = new MyPromise((resolve, reject)=>{
            if (this.status === PENDING) {
                this.resolveCallbacks.push(()=>{
                    setTimeout(()=>{
                        try {
                            const x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    })
                });
                this.rejectCallbacks.push(()=>{
                    setTimeout(()=>{
                        try {
                            const x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    })
                })
            }
            if (this.status === FULFILLED) {
                setTimeout(()=>{
                    try {
                        const x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                })
            }
            if (this.status === REJECTED) {
                setTimeout(()=>{
                    try {
                        const x = onRejected(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                })
            }
        });
        return promise2;
    }
}

MyPromise.resolve = function(fn) {
    return new MyPromise((resolve, reject)=>{
        resolve(fn);
    });
}

MyPromise.race = function(array) {
    if (!Array.isArray(array)) return new Error('type error');
    return new MyPromise((resolve, reject)=>{
        for (let i = 0; i < array.length; i++) {
            const p = array[i];
            if (p && typeof p.then === 'function') { // 数组元素是promise
                p.then(resolve, reject);
            } else { // 数组元素是值
                resolve(p);
            }
        }
    })
}

MyPromise.all = function(array) {
    if (!Array.isArray(array)) return new Error('type error');
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
        const _func = (data, index)=>{
            result[index] = data;
            count++;
            if (count === result.length) resolve(result);
        }
        for (let i = 0; i < array.length; i++) {
            const p = array[i];
            if (p && typeof p.then === 'function') {
                p.then((data)=>{
                    _func(data, i);
                }, reject);
            } else {
                _func(p, i);
            }
        }
    })
}

// console.log(1);
// const a = new MyPromise((resolve, reject) => {
//     setTimeout(()=>{
//         resolve(3);
//         console.log(2);
//     })
// });
// a.then((data)=>{
//     console.log(data);
//     return 4;
// }).then((data)=>{
//     console.log(data);
// })

// MyPromise.race([
//     new MyPromise((resolve, reject) => {
//         setTimeout(()=>resolve(1), 1000);
//     }),
//     new MyPromise((resolve, reject) => {
//         setTimeout(()=>resolve(2), 2000);
//     })
// ]).then((data)=>console.log(data));

// MyPromise.all([
//     new MyPromise((resolve, reject)=>{
//         setTimeout(()=>resolve(1), 1000);
//     }),
//     new MyPromise((resolve, reject)=>{
//         setTimeout(()=>resolve(2), 2000);
//     }),
//     3
// ]).then((data)=>{
//     console.log(data);
// })