const url = 'https://www.baidu.com/?aaa=1&bbb=2';

// const re = /[\?&](\w+)=(\w+)/g;
const key = 'aaa';
const re = new RegExp(`[\\?&]${key}=(\\w+)`, 'g');
console.log(re)
const result = re.exec(url);
console.log(result);