import { Dep, popTarget, pushTarget } from "./dep";

let id = 0;

export class Watcher {
    constructor(vm, exprOrFn, options, callback) {
        this.vm = vm;
        this.id = id++;
        this.renderWacher = options;
        if (typeof exprOrFn === 'string') {
            this.getter = function() {
                return vm[exprOrFn];
            }
        } else {
            this.getter = exprOrFn;
        }
        this.deps = [];
        this.depIdSet = new Set();
        this.lazy = options.lazy;
        this.cb = callback;
        this.dirty = this.lazy;
        this.user = options.user;

        // this.value watch的初始值，或computed的计算值
        // watch第一次执行get()，也就是获取了一下data属性，让其dep记录此watcher
        this.value = this.lazy ? undefined : this.get();
    }
    get() {
        pushTarget(this);
        const value = this.getter.call(this.vm); // 在计算属性fn的执行时，this指向vm
        popTarget();
        return value;
    }
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    addDep(dep) {
        const id = dep.id;
        if (!this.depIdSet.has(id)) {
            this.deps.push(dep);
            this.depIdSet.add(id);
            dep.addSub(this);
        }
    }
    update() {
        if (this.lazy) { // 计算属性watcher修改dirty
            this.dirty = true;
        } else { // 渲染watcher加入更新队列
            queueWatcher(this);
        }
    }
    run() {
        let oldValue = this.value;
        let newValue = this.get();
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue);
        }
    }
    depend() {
        this.deps.forEach((dep)=>{
            dep.depend();
        });
    }
}

const queue = [];
let has = {};
function queueWatcher(watcher) {
    const id = watcher.id;
    if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        nextTick(flushQueueWatcher);
    }
}

/* 
这里的实现是简化之后的
Vue 源码中的注释：
在刷新之前对队列进行排序。
这可确保：
1. 组件从父级更新到子级。 （因为父母总是在孩子之前创建）
2. 组件的用户观察者在其渲染观察者之前运行（因为用户观察者是在渲染观察者之前创建的）
3. 如果一个组件在父组件的 watcher 运行过程中被销毁，它的 watchers 可以跳过。
*/
function flushQueueWatcher() {
    const watchers = queue.slice(0);
    queue.length = 0;
    has = {};
    watchers.forEach((watcher)=>{
        watcher.run();
    })
}

const nextTickCallbacks = [];
let waiting = false;
export function nextTick(callback) {
    nextTickCallbacks.push(callback);
    if (!waiting) {
        waiting = true;
        Promise.resolve().then(flushNextTickCallbacks);
    }
}

function flushNextTickCallbacks() {
    const callbacks = nextTickCallbacks.slice(0);
    nextTickCallbacks.length = 0;
    waiting = false;
    callbacks.forEach((callback)=>{
        callback();
    })
}