<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { useStore } from '../../store/Store';
  import { storeToRefs } from 'pinia';

  import ToastCustom from '../../components/jackal/ToastCustom.vue';
  import Colors from '../../config/colors';
  import NetworkIndicator from '@/components/NetworkIndicator.vue';
  import LanguageSelector from '@/components/LanguageSelector.vue';
  
  const route = useRoute();
  const router = useRouter();

  const store = useStore();
  const { departureCode } = storeToRefs(store);

  const showToast = ref(false);
  const departureCodeLS = localStorage.getItem('departureCode');

  const homeButtonHandler = () => {
    
    if (route.name == 'schedule' || route.name == 'reservation' || route.name == 'payment') {
      if (route.name == 'payment') store.isRouteToIdle = true;
      store.isReset = true;
      router.push({ name: 'idle', params: { departureCode: departureCodeLS } });
    }

    if (route.name == 'completed') {
      showToast.value = true
    }
  }
  
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
    <div class="w-[323px] flex flex-col justify-between" :class="`bg-[${colors?.secondaryColor}]`">
        <div class="flex flex-col">
            <div class="w-[294px] self-end">
                <img :src="images.logoPrimary" alt="" class="w-[190px] mt-[67px] mx-auto">
            </div>
            
            <div  class="self-end cursor-default rounded-l-[26px] w-[294px] h-[150px] mt-[81.4px] flex items-center justify-center"
            :class="[ $route.name === 'schedule' ? 'active' : '', `text-[${colors.fontSecondaryColor200}]` ]">
                <span class="font-bold text-[30px] ">{{ $t('theNavbar.schedule') }}</span>
            </div>

            <router-link :to="{ name: 'reservation' }" class="self-end cursor-default rounded-l-[26px] w-[294px] h-[150px] flex items-center justify-center"
            :class="[ $route.name === 'reservation' ? 'active' : '', `text-[${colors.fontSecondaryColor200}]` ]">
                <span class="font-bold text-[30px]">{{ $t('theNavbar.reservation') }}</span>
            </router-link>

            <div :class="[ $route.name === 'payment' ? 'active' : '', `text-[${colors.fontSecondaryColor200}]` ]" class="self-end cursor-default rounded-l-[26px] w-[294px] h-[150px] flex items-center justify-center">
                <span class="py-[57px] font-bold text-[30px]">{{ $t('theNavbar.payment') }}</span>
            </div>

            <div :to="{ name: 'completed' }" class="self-end cursor-default rounded-l-[26px] w-[294px] h-[150px] flex items-center justify-center"
            :class="[ $route.name === 'completed' ? 'active' : '', `text-[${colors.fontSecondaryColor200}]` ]">
                <span class="py-[57px] font-bold text-[30px]">{{ $t('theNavbar.complete') }}</span>
            </div>
        </div>
        <div class="flex flex-col items-center">
          <LanguageSelector dynamicClass="mb-6 py-[16.5px] rounded-[16px] px-[12px] text-[20px]" />
          <div @click="homeButtonHandler" class="w-[100px] h-[100px] rounded-full self-center mb-[24px] flex justify-center items-center" :class="`bg-[${colors.primaryColor}]`">
            <img src="../../assets/images/ic_home.svg" alt="ic_home">
          </div>
          <NetworkIndicator class="top-[20px] right-[20px] mb-[80px]" />
        </div>
    </div>
</template>

<style scoped>
  .active {
    background: v-bind('colors.primaryColor');
    color:v-bind('colors.secondaryColor');
  }
</style>

