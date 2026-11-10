// await 后面的代码会在异步操作完成后，以微任务的形式继续执行；微任务按照入队顺序执行。
// 每执行完一个宏任务，都要清空微任务队列，再执行下一个宏任务。

console.log(1);

setTimeout(() => {
  console.log(2);

  Promise.resolve().then(() => {
    console.log(3);
  });
}, 0);

async function foo() {
  console.log(4);

  await Promise.resolve();

  console.log(5);

  setTimeout(() => {
    console.log(6);
  }, 0);
}

async function bar() {
  console.log(7);

  await foo();

  console.log(8);
}

bar();

new Promise((resolve) => {
  console.log(9);
  resolve();
}).then(() => {
  console.log(10);
});

setTimeout(() => {
  console.log(11);
}, 0);

console.log(12);
