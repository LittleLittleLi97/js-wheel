const url = 'https://www.baidu.com/?aaa=1&bbb=2';

// const re = /[\?&](\w+)=(\w+)/g;
const key = 'aaa';
const re = new RegExp(`[\\?&]${key}=(\\w+)`, 'g');
console.log(re)
const result = re.exec(url);
console.log(result);

// 获取key和value
// 没处理没有问号的情况
function main(url) {
    const index = url.indexOf('?');
    url = url.substring(index + 1);
    const map = {};
    while (url) {
        const indexEqual = url.indexOf('=');
        let indexAnd = url.indexOf('&');
        if (indexAnd === -1) indexAnd = url.length;
        const key = url.substring(0, indexEqual);
        const value = url.substring(indexEqual + 1, indexAnd);
        map[key] = value;
        url = url.substring(indexAnd + 1);
    }
    console.log(map);
}

// 获取key和value
function main2(url) {
    const urlObj = new URL(url);
    console.log(Object.fromEntries(urlObj.searchParams));
}
