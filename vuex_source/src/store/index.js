import { createStore } from '@/vuex/index.js'

export default createStore({
	state: {
		count: 0,
	},
	mutations: {
		plus(state, num) {
			state.count += num;
		}
	},
	actions: {
		plus({ commit, state }, num) {
			setTimeout(() => {
				commit('plus', num);
			}, 1000);
		}
	},
})
