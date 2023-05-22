function Promise(executor) {
    this.PromiseState = 'pending';
    this.PromiseResult = null;

    this.callbacks = [];

    function resolve(value) {
        if (this.PromiseState !== 'pending')  return;
        this.PromiseState = 'fulfilled';
        this.PromiseResult = value;
        this.callbacks.forEach(callback => callback.onResolved(this.PromiseResult));
    }
    function reject(reason) {
        if (this.PromiseState !== 'pending') return;
        this.PromiseState = 'rejected';
        this.PromiseResult = reason;
        this.callbacks.forEach(callback => callback.onRejected(this.PromiseResult));
    }

    try {
        executor(resolve.bind(this), reject.bind(this));
    } catch (error) {
        reject(error);
    }
}

Promise.prototype.then = function(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };
    return new Promise((resolve, reject)=>{
        const callback = (fn)=>{
            setTimeout(() => {
                try {
                    let result = fn(this.PromiseResult);
                    if (result instanceof Promise) {
                        result.then(onResolved, onRejected);
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }
        if (this.PromiseState === 'pending') {
            this.callbacks.push({
                onResolved: ()=>callback(onResolved),
                onRejected: ()=>callback(onRejected)
            });
        }
        if (this.PromiseState === 'fulfilled') {
            callback(onResolved);
        }
        if (this.PromiseState === 'rejected') {
            callback(onRejected);
        }
    })
}

Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
}

Promise.resolve = function(value) {
    return new Promise((resolve, reject)=>{
        resolve(value);
    });
}

Promise.reject = function(reason) {
    return new Promise((resolve, reject)=>{
        reject(reason);
    })
}

Promise.all = function(arr) {
    return new Promise((resolve, reject)=>{
        let count = 0;
        const result = [];
        const _func = (data, index)=>{
            result[index] = data;
            count++;
            if (count === result.length) resolve(result);
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

Promise.race = function(arr) {
    return new Promise((resolve, reject)=>{
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

// const p = new Promise((resolve, reject)=>{
//     setTimeout(()=>{
//         resolve(1);
//     })
// })
// p.then((value)=>{
//     console.log(value);
//     return 2;
// }).then((value)=>{
//     console.log(value);
//     throw 'error'
// }).then(()=>{
//     console.log(3);
// }).catch((error)=>{
//     console.log(error);
// })

console.log(1);
const a = new Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve(4);
        console.log(3);
    })
});
a.then((data)=>{
    console.log(data);
    return 5;
}).then((data)=>{
    console.log(data);
})
console.log(2)