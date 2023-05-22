class Observer {
    constructor() {
        this.message = {};
    }
    $on(key, func) {
        if (!this.message[key]) this.message[key] = [];
        this.message[key].push(func);
    }
    $off(key, func) {
        if (!this.message[key]) return;
        this.message[key] = this.message[key].filter(item => item !== func);
    }
    $emit(key) {
        this.message[key]?.forEach(func => func());
    }
}

const ob = new Observer();
function func1() {
    console.log(1)
}
ob.$on('event', func1);
ob.$on('event', ()=>console.log(2));
ob.$on('event2', func1)

ob.$off('event', func1);

ob.$emit('event');
ob.$emit('event2');
ob.$emit('none');