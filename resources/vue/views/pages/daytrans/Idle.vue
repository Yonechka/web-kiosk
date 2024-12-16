<script setup>
import { useRouter, useRoute } from 'vue-router';
import { onMounted, ref, nextTick } from 'vue';
import { useStore } from '../../../store/Store';
import { useScheduleStore } from '@/store/ScheduleStore';
import usePingStatus from '@/composeable/usePingStatus.js';
import {
  useSelectPool,
  useSelectDepartureTime,
  useSelectDepartureTimeEvent,
} from '@/composeable/schedule.js';
import useAds from '@/composeable/useAds';
import departureCodes from '@/config/departureCodes';
import { useIntervalFn } from '@vueuse/core';
import LanguageSelector from '@/components/LanguageSelector.vue';
import { adsFullScreen } from '@/data/adsDummy.js';
import Features from '@/config/features.js';
import useRefreshMidnight from '@/composeable/useRefreshMidnight'

import AdsFullScreen from '@/components/v2/Idle/AdsFullScreen.vue';


const store = useStore();
const scheduleStore = useScheduleStore();
const route = useRoute();
const router = useRouter();
const isDepartureCodeConfigured = ref(true);

/* Select Pool */
const emit = defineEmits(['backToSelectTime', 'showSpinnerEvent', 'selectDepartureTimeEvent']);
const {
  selectPool,
} = useSelectPool(emit);

/* Select Departure Time */
const { selectDepartureTime } = useSelectDepartureTime(emit);

/* Select Departure Function */
const { selectDepartureTimeEvent } = useSelectDepartureTimeEvent();

const addFullScreenOnClickHandler = async (ads) => {
  store.routingFromAds = true;
  scheduleStore.date = new Date(ads.data.departure_date)
  await scheduleStore.getDeparture();
  await scheduleStore.getDestination({
    destination:  ads.data.departure_id,
  });
  
  await selectPool(ads.data.destination_id);

  if (ads.data.id_product) {
    console.log('select seat should triggered');
    selectDepartureTime(ads.data.id_product, ads.data.destination_id);
    selectDepartureTimeEvent(ads.data.id_product);
  }
  await router.push({ name: 'schedule' });
}


const clientId = document.querySelector('[name=clientId]').content;
const { adsFullScreenRef, resetShowAdsDuration } = useAds(clientId, route);
onMounted( async () => {
  useRefreshMidnight();
  const departureCode = route.params.departureCode;
  
  /* Restart Date */
  scheduleStore.date = new Date();
  
  /* For Route Guard */
  store.isRouteToIdle = false;

  /* Ping Status Every 5 minutes */
  usePingStatus({ clientId, outlet: departureCode });

  /* Set Departure Code */
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

/* Member on-click */
const onClickMember = () => {
  store.selectedNavbar = 'member';
  router.push({ name: 'memberCheck' });
}

/* Reservation on-click */
const onClickReservation = () => {
  store.selectedNavbar = 'reservation';
  router.push({ name: 'schedule' });
}
// const adsFullScreenRef = ref(null);
// const resetShowAdsDuration = () => {
//   adsFullScreenRef?.value?.resetShowAdsHandler();
// }

const validation = {
  message: 'Nomor HP tidak valid',
  validate: (value) => (/^\d+$/).test(value)
}

const value = ref(null);
const isShow = ref(false);
</script>

<template>
  <Teleport to='.appWrapper'>
    <div
      @click="resetShowAdsDuration"
      class="w-full h-full absolute flex flex-col items-center"
      :class="[ isDepartureCodeConfigured ? '' : 'justify-center' ]"
    >
      <AdsFullScreen
        v-if="features.isAds && scheduleStore.ads.length > 0"
        ref="adsFullScreenRef"
      />

      <template v-if="isDepartureCodeConfigured">
        <LanguageSelector dynamicClass="rounded-[30px] py-6 px-8 text-[32px] absolute top-[80px] right-[80px] z-[50]" />
        <img :src="images.logoOnIdle" class="mt-[285px] z-[20] relative w-[427px]">
        
        <div class="orangeButtonWrapper mt-[120px] z-[20] flex ">
            <button
              @click="onClickReservation"
              id="btnReservation"
              style="box-shadow: 8px 8px 0px 0px #000000;"
              class="w-[427px] h-[126px] mr-[38px] font-bold flex justify-center items-center z-[20] rounded-[30px] text-[45px]"
              :class="[`text-[${colors.secondaryColor}]`, `bg-[${colors.primaryColor}]`]"
            >
              {{ $t('idle.buttonReservation') }}
              <!-- Pesan Tiket  -->
            </button>
            <router-link
              v-if="features.isBoarding"
              :to="{ name: 'boarding' }"
              style="box-shadow: 8px 8px 0px 0px #000000;"
              class="w-[427px] h-[126px] font-bold flex justify-center items-center z-[20] rounded-[30px] text-[45px]"
              :class="[`text-[${colors.secondaryColor}]`, `bg-[${colors.primaryColor}]`]"
            >
              Boarding
            </router-link>

             
        </div>
        
        <button
          v-if="features.isMember"
          @click="onClickMember"
          style="box-shadow: 8px 8px 0px 0px #000000;"
          class="w-[427px] h-[126px] font-bold flex justify-center items-center z-[20] rounded-[30px] text-[45px] mt-8"
          :class="[`text-[${colors.secondaryColor}]`, `bg-[${colors.primaryColor}]`]"
        >
        {{ $t('idle.buttonMemberCheck') }}
        </button>
        <router-link
          v-if="features.isPrintTicket"
          :to="{ name: 'printTicket' }"
          style="box-shadow: 8px 8px 0px 0px #000000;"
          class="w-[427px] h-[126px] mt-[25px] font-bold flex justify-center items-center z-[20] rounded-[30px] text-[45px]"
          :class="[`text-[${colors.secondaryColor}]`, `bg-[${colors.primaryColor}]`]"
        >
          {{ $t('idle.buttonPrintTicket') }}
        </router-link>
       
      </template>
      
      <template v-else>
        <span class="text-white text-[40px] z-20 bg-black p-[30px]">DEPARTURE CODE NOT AVAILABLE</span> 
      </template>
      
      <img :src="images.idle" class="absolute top-0 left-0 z-[10]">
    </div>
  </Teleport>
</template>

<style>
.ic_flag {
  box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.39);
-webkit-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.39);
-moz-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.39);
}

</style>