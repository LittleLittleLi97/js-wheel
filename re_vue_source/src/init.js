import { parseTemplateToRender } from "./compile";
import { mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options;

        initState(vm);

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
            if (!template) {
                template = el.outerHTML;
            }
            options.render = parseTemplateToRender(template);
        }

        mountComponent(vm, el);
    }
}