/**
 * 题目：
 * HelloMan('jack') // 输出 hello jack
 * HelloMan('jack').rest(10).learn('en') // 输出 hello jack，10秒后输出10 seconds，最后输出learn en
 * HelloMan('jack').restFirst(5).learn('cn') // 5秒后输出5 seconds，然后输出hello jack，最后输出learn cn
 */

function HelloMan(name) {
    if (!(this instanceof HelloMan)) {
        return new HelloMan(name);
    }

    this.queue = [
        () => {
            return new Promise((resolve, reject) => {
                console.log(`hello ${name}`);
                resolve();
            });
        }
    ];
    setTimeout(() => {
        let p = Promise.resolve();
        let i = 0;
        while (i < this.queue.length) {
            p = p.then(this.queue[i]);
            i++;
        }
    });
    return this;
}

HelloMan.prototype.rest = function (delay) {
    this.queue.push(() => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`${delay} seconds`);
                resolve();
            }, delay * 1000);
        })
    });
    return this;
}

HelloMan.prototype.restFirst = function (delay) {
    this.queue.unshift(() => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`${delay} seconds`);
                resolve();
            }, delay * 1000);
        })
    });
    return this;
}

HelloMan.prototype.learn = function (language) {
    this.queue.push(() => {
        return new Promise((resolve, reject) => {
            console.log(`learn ${language}`);
            resolve();
        })
    })
    return this;
}

// HelloMan('jack');
// HelloMan('jack').rest(10).learn('en');
// HelloMan('jack').restFirst(5).learn('cn');