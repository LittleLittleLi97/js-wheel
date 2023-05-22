import { mergeOptions } from "../utils";

export function initMixinGlobalAPI(Vue) {
    Vue.options = {};

    Vue.mixin = function(mixin) {
        this.options = mergeOptions(this.options, mixin);

        return this;
    }

}