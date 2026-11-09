function fn() {
    const where = 'inside'; // 如果注释掉这一行，打印什么
    return function() {
        console.log(where);
    }
}

function caller() {
    const where = 'outside';
    fn()();
}

caller();