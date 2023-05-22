import { compileToRender } from "./compiler/index";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { mergeOptions } from "./utils";

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {

        const vm = this;

        // LifeCycle 定义的全局指令和过滤器，都会挂载到实例上
        vm.$options = mergeOptions(this.constructor.options, options); // 将用户的选项挂载到实例上

        callHook(vm, 'beforeCreate');

        // LifeCycle 初始化状态，如data、计算属性、watch
        initState(vm);

        callHook(vm, 'created');

        if (options.el) {
            vm.$mount(options.el);
        }

    }
    Vue.prototype.$mount = function(el) {
        const vm = this;
        const options = vm.$options;

        el = document.querySelector(el);

        if (!options.render) {
            let template = options.template;
            if (!template && el) template = el.outerHTML;

            const render = compileToRender(template);
            options.render = render;
        }

        mountComponent(vm, el);
    }
}