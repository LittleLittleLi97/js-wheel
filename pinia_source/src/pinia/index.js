import { reactive } from "vue"

export function createPinia() {
    return {
        install(app) {
            const store = reactive({});
        }
    }
}

export function defineStore(storeName, options) {
    const store = reactive({});
    const state = options.state();
    const actions = options.actions;

    for (let key in state) {
        state[key] = state[key];
    }
    for (let method in actions) {
        state[method] = actions[method]
    }
    return function() {

    }
}