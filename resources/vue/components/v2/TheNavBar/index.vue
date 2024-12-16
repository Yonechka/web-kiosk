<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/store/Store';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

import TimeDisplay from '@/components/v2/TimeDisplay.vue';
import Menus from './Menus.vue';
import LanguageSelector from '@/components/LanguageSelector.vue';
import ToastCustom from '@/components/jackal/ToastCustom.vue';
import useNavbarMenu from '@/composeable/useNavbarMenu.js'


const route = useRoute();
const router = useRouter();

const store = useStore();
const { departureCode } = storeToRefs(store);

const { menu } = useNavbarMenu(router, store.selectedNavbar)

const showToast = ref(false);
const departureCodeLS = localStorage.getItem('departureCode');

/* Home button Handler */
const allowedRoute = ['schedule', 'reservation', 'payment', 'memberCheck', 'memberDetail', 'memberRegister']
const homeButtonHandler = () => {
  if (allowedRoute.includes(route.name)) {
    if (route.name == 'payment') store.isRouteToIdle = true;
    store.isReset = true;
    router.push({ name: 'idle', params: { departureCode: departureCodeLS } });
  }

  if (route.name == 'completed') {
    showToast.value = true
  }
};

const dynamicClass = () => route.name === 'schedule' ? 'active' : '';


</script>

<template>
  <transition>
      <ToastCustom
          type="failed"
          :title="$t('theNavbar.toast')"
          message=""
          @closeToast="showToast = false"
          v-if="showToast"
      />
  </transition>
  <div class="w-[320px]  relative border-slate-950 bg-white">
    <TimeDisplay class=" absolute top-0 left-0" />

    <img :src="images.logoPrimary" class=" w-40 mt-[203px] mx-auto" />

    <Menus :menus="menu" />
    <div class="flex flex-col items-center absolute bottom-0 pb-[100px] w-full">
      <LanguageSelector dynamicClass="mb-6 py-[16.5px] rounded-[16px] px-[12px] text-[20px]" />
      <div @click="homeButtonHandler" class="w-[100px] h-[100px] rounded-full self-center flex justify-center items-center" :class="`bg-[${colors.primaryColor}]`">
        <img src="@/assets/images/ic_home.svg" alt="ic_home">
      </div>
    </div>
    
  </div>
</template>
