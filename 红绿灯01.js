function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    })
}

async function trafficLight() {
    while (true) {
        console.log('红灯');
        await sleep(1000);
        console.log('绿灯');
        await sleep(1000);
        console.log('黄灯');
        await sleep(1000);
    }
}

trafficLight();