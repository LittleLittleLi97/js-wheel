const arr = [
    [1, 2, [3, 4, [5]]],
    [6, [7, 8]],
    9,
    [10]
];

function flatten(arr) {
    const out = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) out.push(...flatten(arr[i]));
        else out.push(arr[i]);
    }
    return out;
}

console.log(flatten(arr));

// console.log(arr.flat(Infinity))