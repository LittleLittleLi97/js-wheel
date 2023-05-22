import { Watcher } from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vdom";
import { patch } from "./vdom/patch";

export function initLifeCycle(Vue) {
    Vue.prototype._c = function() {
        return createElementVNode(this, ...arguments);
    }
    Vue.prototype._v = function() {
        return createTextVNode(this, ...arguments);
    }
    Vue.prototype._s = function(value) {
        if (typeof value === 'object') return JSON.stringify(value);
        else return value;
    }
    Vue.prototype._update = function(vnode) {
        const vm = this;
        const el = vm.$el;

        vm.$el = patch(el, vnode);
    }
    Vue.prototype._render = function() {
        return this.$options.render.call(this);
    }
}

export function mountComponent(vm, el) {
    vm.$el = el;
    const updateFunc = ()=>{
        vm._update(vm._render());
    };
    new Watcher(vm, updateFunc, {});
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook];
    if (handlers) {
        handlers.forEach((handler)=>{
            handler.call(vm);
        })
    }
}