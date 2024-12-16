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
    useResetStore,
    useDestinationOnMountedEvent
  } from '../../../composeable/schedule';

  import DeparturePool from '../../../components/jackal/schedule/DeparturePool.vue';
  import DestinationPool from '../../../components/jackal/schedule/DestinationPool.vue';
  import DepartureDate from '../../../components/jackal/schedule/DepartureDate.vue';
  import DepartureTime from '../../../components/jackal/schedule/DepartureTime.vue';
  import SeatsLayout from '../../../components/jackal/schedule/SeatsLayout.vue';
  import OverlaySpinner from '../../../components/jackal/OverlaySpinner.vue';
  import LetterKeyboard from '../../../components/jackal/completed/LetterKeyboard.vue';
  import ErrorState from '../../../components/jackal/schedule/ErrorState.vue'

  const router = useRouter();
  const route = useRoute();
  const scheduleStore = useScheduleStore();
  const store = useStore();
  // const { selectedSeats } = storeToRefs(scheduleStore);

  
  /* Initial Data */
  const { isDepTimeShow, isSeatsShow, showSpinner, departureCode, showSpinnerParent, showSpinnerToReservation , isSelectPoolError, isSelectScheduleError } = useInitialData();

  /* Fetching Initial Data */
  const isFetching = ref(true);
  const isError = ref(false);
  const { init } = useDestinationOnMountedEvent(); 
  const fetchInitialData = async () => {
    // isError.value = false
    showSpinnerParent.value = true
    try {
      await scheduleStore.getDeparture();
      await scheduleStore.getDestination({
        destination:  departureCode,
      });
      
      isError.value = false;
      isFetching.value = false;
      showSpinnerParent.value = false;
      init();
      console.log('success!')
    } catch (error) {
      isError.value = true
      isFetching.value = false
      showSpinnerParent.value = false
      console.log('on error', error)
    }
  }
  

  /* On Retry Select Destination */
  const onRetrySelectDestinationPool = async () => {
    try {
      isSelectScheduleError.value = false;
      isSelectPoolError.value = false;
      showSpinner.value = true;
      await scheduleStore.getSchedule({
        destination_id: scheduleStore.selectedDestinationPool.destination_id,
        departure_date: scheduleStore.departureDate,
        departure_id: departureCode
      });
      showSpinner.value = false
      
    } catch (error) {
      showSpinner.value = false
      isSelectPoolError.value = true;
    }
  }

  const onRetrySelectSchedule = async () => {
    try {
      showSpinner.value = true;
      isSelectScheduleError.value = false;
      await scheduleStore.getSeat({
        schedule_code: scheduleStore.selectedDepartureTime.code,
        departure_date: scheduleStore.departureDate,
        departure_id: scheduleStore.selectedDeparturePool.pool_code,
        destination_id: scheduleStore.selectedDestinationPool.destination_id
      });
      showSpinner.value = false
      
    } catch (error) {
      showSpinner.value = false
      isSelectScheduleError.value = true;
    }
  }

  // await scheduleStore.getSchedule({
  //   destination_id: scheduleStore.selectedDestinationPool.destination_id,
  //   departure_date: scheduleStore.departureDate,
  //   departure_id: departureCode
  // });
  
  /* Select Departure Function */
  const { selectDepartureTimeEvent } = useSelectDepartureTimeEvent();
  
  //Event When Fetching New Destination Pool, date etc
  const { isResetScroll, backToSelectTime } = useBackToSelectTime();

  /* Resetting the store  */
  const { resetStore } = useResetStore();
  onActivated(async () => {
    resetStore();
  });

  /* Routing */
  onBeforeRouteLeave((to, from) => {
    const { routeValidate } = useRoutingValidation(to, from);
    return routeValidate();
  });

  onMounted(async () => {
    await fetchInitialData();
  })

  const showSpinnerEvent = (value) => showSpinner.value = value;

</script>
<template>
    <ErrorState @retryOnClick="fetchInitialData" :bg="`bg-[${colors.primaryColor}]`" v-show="isError"></ErrorState>
    <OverlaySpinner :bg="`bg-[${colors.primaryColor}]`" spinnerColor="white" v-show="showSpinnerParent" zIndex="z-[99]"/>
    <OverlaySpinner :bg="`bg-[#0000003f]`" :spinnerColor="colors.primaryColor" v-show="showSpinnerToReservation" zIndex="z-[99]"/>
    <DeparturePool @backToSelectTime="backToSelectTime" @showSpinnerEvent="showSpinnerEvent" />
    <DestinationPool
      v-if="!isError"
      @backToSelectTime="backToSelectTime"
      @showSpinnerEvent="showSpinnerEvent"
    />
    <DepartureDate
      @backToSelectTime="backToSelectTime"
      @showSpinnerEvent="showSpinnerEvent"
    />
    <DepartureTime v-if="isDepTimeShow" :resetScroll="isResetScroll" @selectDepartureTimeEvent="selectDepartureTimeEvent">
      <template #overlaySpinner>
        <ErrorState bg="bg-[white]" :textColor="colors.fontPrimaryColor" v-show="isSelectPoolError" @retryOnClick="onRetrySelectDestinationPool"></ErrorState>
        <OverlaySpinner v-show="showSpinner" />
      </template>
    </DepartureTime>
    <Transition>
      <SeatsLayout v-if="isSeatsShow" :isSelectScheduleError="isSelectScheduleError"  @backToSelectTime="backToSelectTime">
        <template #overlaySpinner>
          <ErrorState bg="bg-[white]" :textColor="colors.fontPrimaryColor" v-show="isSelectScheduleError"  @retryOnClick="onRetrySelectSchedule"></ErrorState>
          <OverlaySpinner v-show="showSpinner" />
        </template>
      </SeatsLayout>
    </Transition>
    <div v-if="isDepTimeShow" class="flex w-[645px] absolute bottom-[30px]">
        <!-- <router-link :to="{ name: 'sendEticket' }" style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);
        box-shadow: -5px 4px 9px 0px rgba(0, 0, 0, 0.20);" class=" send w-[303px] h-20 rounded-[30px] flex items-center justify-center">
            <div class="font-bold text-[36px]" :class="`text-[${colors.fontSecondaryColor}]`">Kirim E-tiket</div>
        </router-link> -->

        <router-link
          :to="{ name: 'boarding' }"
          class="send w-[303px] h-20 rounded-[30px] flex items-center justify-center"
          :class="[`bg-[${colors.secondaryColor}]`]"
        >
            <div class="font-bold text-[36px]" :class="`text-[${colors.primaryColor}]`">Boarding</div>
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