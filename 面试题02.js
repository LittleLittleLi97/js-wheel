function fnA() {
    console.log(this.value);
}

const objA = {
    value: "a",
    fn: fnA
};

objA.fn(); // "a"

function fnB() {
    const arrowFn = () => {
        console.log(this.value);
    };

    arrowFn();
}

const objB = {
    value: "b",
    fn: fnB
};

objB.fn(); // "b"

function fnC() {
    const arrowFn = () => {
        console.log(this.value);
    };

    return arrowFn;
}

const objC = {
    value: "c",
    fn: fnC()
};

objC.fn(); // "v"