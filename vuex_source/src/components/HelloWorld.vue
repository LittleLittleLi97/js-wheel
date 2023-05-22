<template>
    <div class="hello">
        <h1>{{ store.state.count }}</h1>
        <button @click="mutationPlus(1)">mutation-plus</button>
        <button @click="actionPlus(2)">action-plus</button>
   </div>
</template>

<script setup>
import { useStore } from '@/vuex/index.js';

const store = useStore();
const mutationPlus = (num) => {
    store.commit('plus', num);
}

const actionPlus = (num) => {
    store.dispatch('plus', num);
}
</script>