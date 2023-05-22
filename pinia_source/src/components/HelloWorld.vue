<template>
  <div class="hello">
    {{ counter.count }}
    <button @click="plus(1)">plus</button>
    <button @click="plusAsync(2)">plus-async</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/store';

const counter = useCounterStore();

const plus = (num)=>{
  counter.$patch({
    count: counter.count += num,
  })
}
const plusAsync = (num)=>{
  counter.plusAsyc(num);
}
</script>
