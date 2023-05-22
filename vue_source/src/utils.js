const strategies = {};
const LIFECYCLE = [
    'beforeCreate',
    'created',
];
LIFECYCLE.forEach((hook)=>{
    strategies[hook] = function(parent, child) {
        if (child) {
            if (parent) {
                return parent.concat(child);
            } else {
                return [child];
            }
        } else {
            return parent;
        }
    }
})

export function mergeOptions(parent, child) {
    const options = {};

    for (let key in parent) {
        mergeField(key);
    }
    for (let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        if (strategies[key]) {
            options[key] = strategies[key](parent[key], child[key]);
        } else {
            options[key] = parent[key] || child[key];
        }
    }

    return options;
}