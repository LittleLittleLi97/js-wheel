// 可被关闭的红绿灯

function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    })
}

function trafficLight() {

    let running = true;

    async function run() {
        while (true) {
            console.log('红灯');
            await sleep(3000);
            if (!running) break;

            console.log('绿灯');
            await sleep(2000);
            if (!running) break;

            console.log('黄灯');
            await sleep(1000);
            if (!running) break;
        }
    }

    run();

    function stop() {
        running = false;
    }

    return stop;
}

const stop = trafficLight();
setTimeout(stop, 5000);