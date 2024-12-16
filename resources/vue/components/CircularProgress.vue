<script setup>
import { ref, onMounted, watch } from 'vue';

import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
import { useCountDown } from '@/composeable/useCountDown.js';

const props = defineProps({ duration: Number });

const { countDownDuration, skipCountDown, startInterval } = useCountDown(props.duration);
const emits = defineEmits(['onComplete']);

watch(countDownDuration, () => {
  countDownDuration.value == 0 ? emits('onComplete') : '';
});

onMounted(() => {
  startInterval();
});

</script>

<template>
  <div class="relative w-[90px] h-[90px]">
    <circle-progress
      :border-width="4"
      :is-bg-shadow="false"
      :percent="countDownDuration * 3.3"
      empty-color="#00000000"
      fill-color="#ffffff"
      :size="90"
    />
    <div class="centerDuration text-5xl top-[30px] left-[30px] text-white leading-[0px]">
      {{ countDownDuration }}
    </div>
  </div>
</template>

<style scoped>
.centerDuration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
}
</style>