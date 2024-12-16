<script setup>
import { ref } from 'vue';
import { useNetwork } from '@vueuse/core';
import { Vue3Lottie } from 'vue3-lottie';
import NoInternet from '@/assets/lottie/no_internet.json';

import ScreenTemplate from './ScreenTemplate.vue';

const { isOnline } = useNetwork();
const isSpinner = ref(false);

const retry = () => {
  isSpinner.value = true;
  setTimeout(() => {
    isSpinner.value = false;
  }, 3000)
}

</script>

<template>
  <ScreenTemplate v-show="!isOnline" :title="$t('noInternet.title')" :show-outlet="false">
    <div class=" w-full flex flex-col items-center">

      <Vue3Lottie
        class=" mt-20"
        :animation-data="NoInternet"
        :height="600"
        :width="600"
        src="@/assets/lottie/no_internet.lottie"
      />

      <div class=" mt-16 text-center text-[32px] text-white leading-[48px] mx-[42px]">
        {{ $t('noInternet.description') }}
      </div>

      <div @click="retry" class="text-white py-[14px] px-6 text-2xl bg-[#00990F] mt-8 rounded-2xl">
        {{ $t('noInternet.retryCta') }}
      </div>
      <span v-if="isSpinner" class="loader mt-6"></span>


    </div>
    
  </ScreenTemplate>
</template>

<style scoped>
  .loader {
  width: 48px;
  height: 48px;
  border: 5px solid #FFF;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
</style>