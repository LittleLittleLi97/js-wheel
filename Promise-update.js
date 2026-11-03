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
                setTimeout(() => {
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
            let count = 0;
            const result = new Array(arr.length);
            const _func = (v, index) => {
                result[index] = v;
                count++;
                if (count === arr.length) resolve(result);
            }
            for (let i = 0; i < arr.length; i++) {
                const p = arr[i];
                if (p instanceof Promise) {
                    p.then(v => {
                        _func(v, i);
                    }, reject);
                } else {
                    _func(p, i);
                }
            }
        })
    }

    static race(arr) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                const p = arr[i];
                if (p instanceof Promise) {
                    p.then(resolve, reject);
                } else {
                    resolve(p);
                }
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