let id = 0;

export class Dep {
    constructor() {
        this.id = id++;
        this.subs = [];
    }
    depend() {
        Dep.target && Dep.target.addDep(this);
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach((watcher)=>watcher.update())
    }
}

Dep.target = null;

const stack = [];
export function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
}
export function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
}