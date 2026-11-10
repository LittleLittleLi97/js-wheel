const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.result = undefined;
        this.callbacks = []; // { onResolved: () => {}, onRejected: () => {} }
        
        const resolve = (data) => {
            if (this.status !== PENDING) return;
            this.status = FULFILLED;
            this.result = data;
            this.callbacks.forEach(fn => fn.onResolved());
        }

        const reject = (data) => {
            if (this.status !== PENDING) return;
            this.status = REJECTED;
            this.result = data;
            this.callbacks.forEach(fn => fn.onRejected());
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
                        const p = fn(this.result);
                        if (p instanceof Promise) {
                            p.then(resolve, reject);
                        } else {
                            resolve(p);
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
                })
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
    static all(arr) {
        return new Promise((resolve, reject) => {
            let result = [];
            let count = 0;
            const _func = (data, index) => {
                result[index] = data;
                count++;
                if (count === arr.length) resolve(result);
            }
            for (let i = 0; i < arr.length; i++) {
                const p = arr[i];
                if (p instanceof Promise) {
                    p.then(v => _func(v, i), reject);
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