import { initMixinGlobalAPI } from "./global-api/mixin";
import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";
import { initStateMixin } from "./state";

function Vue(options) {
    this._init(options);
}

initMixin(Vue); // 引入包的时候就调用了，所以在Vue实例化的时候已经有了_init方法
initLifeCycle(Vue);
initMixinGlobalAPI(Vue);
initStateMixin(Vue);



export default Vue;