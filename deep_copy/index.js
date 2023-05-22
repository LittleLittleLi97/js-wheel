const a = {
    name: 'hisname',
};

const b = JSON.parse(JSON.stringify(a));
b.name = 'name';

console.log(a);
console.log(b);
