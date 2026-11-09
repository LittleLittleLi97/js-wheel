class B {}

class A extends B {}

console.log(A.prototype); // 控制台输出 B {}
// 因为 A.prototype 是一个继承自 B.prototype 的对象，浏览器开发者工具可能将它显示为 B {}。
// 但这只是开发者工具的展示方式，不代表 A.prototype === B。
console.log(A.prototype === B);           // false
console.log(A.prototype === B.prototype); // false
console.log(A.prototype.__proto__ === B.prototype); // true
console.log(A.__proto__ === B); // true 构造函数的原型链

const a = new A();
console.log(a.__proto__);
console.log(a.__proto__ === A.prototype); // true
console.log(a.__proto__ === B.prototype); // false

