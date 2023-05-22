import { createElementVNode, createTextVNode } from "./vdom";
import { patch } from "./vdom/patch";

export function initLifeCycle(Vue) {
    Vue.prototype._c = function(tagName, attrs, ...children) {
        return createElementVNode(this, tagName, attrs, ...children);
    }
    Vue.prototype._v = function(text) {
        return createTextVNode(this, text);
    }
    Vue.prototype._s = function(value) {
        return value;
    }
    Vue.prototype._render = function() {
        return this.$options.render.call(this);
    }
    Vue.prototype._update = function(vnode) {
        const vm = this;
        const el = vm.$el;

        vm.$el = patch(el, vnode);
    }
}

export function mountComponent(vm, el) {
    vm.$el = el;
    vm._update(vm._render(), el);
}