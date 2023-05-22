import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";

export default function Vue(options) {
    this._init(options);
}

initMixin(Vue);
initLifeCycle(Vue);