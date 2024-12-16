<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { onMounted, ref } from 'vue';
  import { useStore } from '../../../store/Store';
  import { useScheduleStore } from '@/store/ScheduleStore';

  import usePingStatus from '@/composeable/usePingStatus.js';
  import useAds from '@/composeable/useAds';
  import departureCodes from '../../../config/departureCodes';
  import AdsFullScreen from '@/components/v2/Idle/AdsFullScreen.vue';
  import LanguageSelector from '@/components/LanguageSelector.vue';

  const store = useStore();
  const scheduleStore = useScheduleStore();
  const route = useRoute();

  const isDepartureCodeConfigured = ref(true);
  const clientId = document.querySelector('[name=clientId]').content;
  const { adsFullScreenRef, resetShowAdsDuration } = useAds(clientId, route);
  onMounted(() => {
    store.isRouteToIdle = false;
    
    const departureCode = route.params.departureCode;
    usePingStatus({ clientId, outlet: departureCode });
    if (departureCode) {
      store.departureCode = departureCodes[clientId][departureCode];
      localStorage.setItem('departureCode', departureCode);
    } else {
      const departureCodeLS = localStorage.getItem('departureCode');
      if (departureCodeLS) {
        store.departureCode = departureCodes[clientId][departureCodeLS];
      } else {
        isDepartureCodeConfigured.value = false;
      }
    }
  });
</script>

<template>
  <Teleport to='.appWrapper'>
    <div
      @click="resetShowAdsDuration"
      class="w-full h-full absolute flex flex-col items-center" :class="[ isDepartureCodeConfigured ? '' : 'justify-center' ]"
    >
      <AdsFullScreen
        v-if="features.isAds && scheduleStore.ads.length > 0"
        ref="adsFullScreenRef"
      />
      <template v-if="isDepartureCodeConfigured">
        <LanguageSelector dynamicClass="rounded-[30px] z-[50] py-6 px-8 text-[32px] absolute top-[80px] right-[80px]" />
        <img src="./../../../assets/images/logo-blue-text.png" class="mt-[241px] z-[20] relative w-[427px]">
          <router-link :to="{ name: 'schedule' }" class="w-[427px] h-[126px] font-bold mt-[55px] flex justify-center items-center z-[20] rounded-[30px] text-[50px]" :class="`text-[${colors.fontSecondaryColor}]`"
            style="background: linear-gradient(90deg, #00A4BA 0%, #006CBA 68.02%, #0061BA 97.19%);"
          >
          {{ $t('idle.buttonReservation') }}
          </router-link>
        <div class="orangeButtonWrapper mt-[38px] z-[20] flex ">
            <router-link :to="{ name: 'sendEticket' }" class="w-[427px] h-[126px] mr-[66px] font-bold flex justify-center items-center z-[20] rounded-[30px] text-[50px]" :class="`text-[${colors.fontSecondaryColor}]`"
              style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);"
            >
            {{ $t('idle.buttonSendEticket') }}
            </router-link>
            <router-link :to="{ name: 'boarding' }" class="w-[427px] h-[126px] font-bold flex justify-center items-center z-[20] rounded-[30px] text-[50px]" :class="`text-[${colors.fontSecondaryColor}]`"
              style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);"
            >
              Boarding
            </router-link>
        </div>
      </template>
      <template v-else>
        <span class="text-white text-[40px] z-20 bg-black p-[30px]">DEPARTURE CODE NOT AVAILABLE</span> 
      </template>
      
      <img src="./../../../assets/images/idle.png" class="absolute top-0 left-0 z-[10]">
    </div>
    
  </Teleport>
</template>