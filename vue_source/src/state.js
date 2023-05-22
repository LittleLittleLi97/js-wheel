import { Dep } from "./observe/dep";
import { observe } from "./observe/index";
import { nextTick, Watcher } from "./observe/watcher";

export function initState(vm) {
    const opts = vm.$options;
    
    if (opts.data) {
        initData(vm);
    }

    if (opts.computed) {
        initComputed(vm);
    }

    if (opts.watch) {
        initWatch(vm);
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key];
        },
        set(newValue) {
            observe(newValue);
            vm[target][key] = newValue;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;

    vm._data = data;

    observe(data);

    for (let key in data) {
        proxy(vm, '_data', key);
    }
}

function initComputed(vm) {
    const computed = vm.$options.computed;
    const watchers = vm._computedWatchers = {};

    for (let key in computed) {
        const userDef = computed[key];

        const fn = typeof userDef === 'function' ? userDef : userDef.get;
        watchers[key] = new Watcher(vm, fn ,{lazy: true});

        defineComputed(vm, key, userDef);
    }
}

function defineComputed(target, key, userDef) {
    const setter = userDef.set || (()=>{});

    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
    });
}

function createComputedGetter(key) {
    return function() {
        const watcher = this._computedWatchers[key];
        if (watcher.dirty) {
            watcher.evaluate();
        }
        if (Dep.target) {
            watcher.depend();
        }
        return watcher.value;
    }
}

function initWatch(vm) {
    const watch = vm.$options.watch;

    for (let key in watch) {
        const handler = watch[key];
        if (Array.isArray(handler)) {
            handler.forEach((item)=>createWatch(vm, key, item));
        } else {
            createWatch(vm, key, handler);
        }
    }
}

function createWatch(vm, key, handler) {
    if (typeof handler === 'string') {
        handler = vm[handler];
    }
    return vm.$watch(key, handler);
}

export function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;
    Vue.prototype.$watch = function(exprOrFn, callback) {
        new Watcher(this, exprOrFn, {user:true}, callback);
    }
}