import { reactive, inject } from "vue";

class Store {
    constructor(state, actions, mutations) {
        this.state = state;
        this.actions = actions;
        this.mutations = mutations;
    }
    install(app) {
        const store = {};

        store.state = reactive(this.state);
        store.commit = (mutationName, data)=>{
            this.mutations[mutationName](store.state, data);
        }
        store.dispatch = (actionName, data)=>{
            this.actions[actionName]({
                commit: store.commit,
                state: store.state
            }, data);
        }

        app.provide('store', store);
    }
}

export function createStore({state, actions, mutations}) {
    return new Store(state, actions, mutations);
}

export function useStore() {
    const store = inject('store');
    return store;
}