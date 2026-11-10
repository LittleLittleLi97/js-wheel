const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.callbacks = []; // { onResolved: () => {}, onRejected: () => {} }
        this.result = undefined;
        
        const resolve = (data) => {
            if (this.status !== PENDING) return;
            this.status = FULFILLED;
            this.result = data;
            this.callbacks.forEach(item => item.onResolved());
        }
        const reject = (data) => {
            if (this.status !== PENDING) return;
            this.status = REJECTED;
            this.result = data;
            this.callbacks.forEach(item => item.onRejected());
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onResolved, onRejected) {
        onResolved = typeof onResolved === 'function' ? onResolved : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };
        return new Promise((resolve, reject) => {
            const callback = (fn) => {
                queueMicrotask(() => { // not setTimeout
                    try {
                        const result = fn(this.result);
                        if (result instanceof Promise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            if (this.status === PENDING) {
                this.callbacks.push({
                    onResolved: () => callback(onResolved),
                    onRejected: () => callback(onRejected),
                });
            }
            if (this.status === FULFILLED) {
                callback(onResolved);
            }
            if (this.status === REJECTED) {
                callback(onRejected);
            }
        })
    }
    
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    static resolve(data) {
        if (data instanceof Promise) { // 如果传入的为Promise对象，那么直接返回
            return data;
        }

        return new Promise((resolve, reject) => {
            resolve(data);
        });
    }

    static reject(data) {
        return new Promise((resolve, reject) => {
            reject(data);
        });
    }

    static all(arr) {
        return new Promise((resolve, reject) => {
            const result = [];
            let count = 0;

            if (arr.length === 0) { // 空数组直接返回，不然下面的代码改变不了状态
                resolve(result);
                return;
            }

            for (let i = 0; i < arr.length; i++) { // 简化逻辑
                Promise.resolve(arr[i]).then((value) => {
                    result[i] = value;
                    count++;
                    
                    if (count === arr.length) resolve(result);
                }, reject);
            }
        })
    }

    static race(arr) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                // 统一处理Promise和普通值，因为Promise.resolve传入Promise后，会直接返回
                Promise.resolve(arr[i]).then(resolve, reject);
            }
        })
    }
}


// console.log(1);
// const a = new Promise((resolve, reject) => {
//     setTimeout(()=>{
//         resolve(4);
//         console.log(3);
//     })
// });
// a.then((data)=>{
//     console.log(data);
//     return 5;
// }).then((data)=>{
//     console.log(data);
// })
// console.log(2)


// Promise.race([
//     new Promise((resolve, reject) => {
//         setTimeout(()=>resolve(1), 1000);
//     }),
//     new Promise((resolve, reject) => {
//         setTimeout(()=>resolve(2), 2000);
//     })
// ]).then((data)=>console.log(data));

// Promise.all([
//     new Promise((resolve, reject)=>{
//         setTimeout(()=>resolve(1), 1000);
//     }),
//     new Promise((resolve, reject)=>{
//         setTimeout(()=>resolve(2), 2000);
//     }),
//     3
// ]).then((data)=>{
//     console.log(data);
// })