<script setup>
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useStore } from '../../../store/Store';
  import { ref, onActivated, onDeactivated, onMounted } from 'vue';
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import { sha256, sha224 } from 'js-sha256';
  import {
    useInitialData,
    useSelectDepartureTimeEvent,
    useBackToSelectTime,
    useRoutingValidation,
    useResetStore
  } from '../../../composeable/schedule';

  import DeparturePool from '../../../components/jackal/schedule/DeparturePool.vue';
  import DestinationPool from '../../../components/jackal/schedule/DestinationPool.vue';
  import DepartureDate from '../../../components/jackal/schedule/DepartureDate.vue';
  import DepartureTime from '../../../components/jackal/schedule/DepartureTime.vue';
  import SeatsLayout from '../../../components/jackal/schedule/SeatsLayout.vue';
  import OverlaySpinner from '../../../components/jackal/OverlaySpinner.vue';
  import LetterKeyboard from '../../../components/jackal/completed/LetterKeyboard.vue';
  import Colors from '../../../config/colors';
  

  const router = useRouter();
  const route = useRoute();
  const scheduleStore = useScheduleStore();
  const store = useStore();
  // const { selectedSeats } = storeToRefs(scheduleStore);

  /* Initial Data */
  const { isDepTimeShow, isSeatsShow, showSpinner, departureCode } = useInitialData();

  /* Fetching Data */
  await scheduleStore.getDeparture();
  await scheduleStore.getDestination({
    destination:  departureCode,
  });
  await scheduleStore.getSchedule({
    destination_id: scheduleStore.selectedDestinationPool.destination_id,
    departure_date: scheduleStore.departureDate
  });
  
  /* Select Departure Function */
  const { selectDepartureTimeEvent } = useSelectDepartureTimeEvent();
  
  //Event When Fetching New Destination Pool, date etc
  const { isResetScroll, backToSelectTime } = useBackToSelectTime();

  /* Resetting the store  */
  const { showSpinnerParent, resetStore } = useResetStore();
  onActivated(async () => {
    resetStore();
  });

  /* Routing */
  onBeforeRouteLeave((to, from) => {
    const { routeValidate } = useRoutingValidation(to, from);
    return routeValidate();
  });

  const showSpinnerEvent = (value) => showSpinner.value = value;

</script>
<template>
    <OverlaySpinner v-if="showSpinnerParent"/>
    <DeparturePool @backToSelectTime="backToSelectTime" @showSpinnerEvent="showSpinnerEvent" />
    <DestinationPool
      @backToSelectTime="backToSelectTime"
      @showSpinnerEvent="showSpinnerEvent"
    />
    <DepartureDate
      @backToSelectTime="backToSelectTime"
      @showSpinnerEvent="showSpinnerEvent"
    />
    <DepartureTime v-if="isDepTimeShow" :resetScroll="isResetScroll" @selectDepartureTimeEvent="selectDepartureTimeEvent">
      <template #overlaySpinner>
        <OverlaySpinner v-show="showSpinner" />
      </template>
    </DepartureTime>
    <SeatsLayout v-if="isSeatsShow" @backToSelectTime="backToSelectTime">
      <template #overlaySpinner>
        <OverlaySpinner v-show="showSpinner" />
      </template>
    </SeatsLayout>
    <div v-if="isDepTimeShow" class="flex w-[645px] absolute bottom-[30px] justify-around">
        <router-link :to="{ name: 'sendEticket' }" style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);
        box-shadow: -5px 4px 9px 0px rgba(0, 0, 0, 0.20);" class=" send w-[303px] h-20 rounded-[30px] flex items-center justify-center">
            <div class="font-bold text-[36px]" :class="`text-[${Colors.jackal.fontSecondaryColor}]`">Kirim E-tiket</div>
        </router-link>

        <router-link :to="{ name: 'boarding' }" style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);
        box-shadow: -5px 4px 9px 0px rgba(0, 0, 0, 0.20);" class=" send w-[303px] h-20 rounded-[30px] flex items-center justify-center">
            <div class="font-bold text-[36px]" :class="`text-[${Colors.jackal.fontSecondaryColor}]`">Boarding</div>
        </router-link>
    </div>
</template>

<style>
  .Toastify__toast-container {
    width: 1080px;
    text-align: center;
    font-size: 40px !important;
    font-weight: bold;
  }

  .Toastify__toast-theme--colored.Toastify__toast--success {
    height: 150px !important;
  }
  .Toastify__progress-bar-theme--colored.Toastify__progress-bar--info, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--success, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {
    opacity: 0 !important;
  }

  

</style>