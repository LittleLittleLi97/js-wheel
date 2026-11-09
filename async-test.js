console.log(1);

async function async1() {
    console.log(2);
    await async2();
    console.log(4);
}

async function async2() {
    console.log(3);
}

async1();