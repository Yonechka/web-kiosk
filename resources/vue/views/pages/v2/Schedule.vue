<script setup>
  
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useStore } from '../../../store/Store';
  import { ref, onActivated, onDeactivated, onMounted, watch } from 'vue';
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
  } from '@/composeable/schedule';

  import DeparturePool from '@/components/v2/Schedule/DeparturePool.vue';
  import DestinationPool from '@/components/v2/Schedule/DestinationPool';
  import DepartureDate from '@/components/v2/Schedule/DepartureDate';
  import DepartureTime from '@/components/v2/Schedule/DepartureTime.vue';
  import SeatsLayout from '@/components/v2/Schedule/SeatsLayout/SeatsLayout.vue';
  import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';
  import ErrorState from '@/components/daytrans/schedule/ErrorState.vue';
  import IcDeparturePrice from '@/components/v2/ic/IcDeparturePrice.vue';
  import IcDestinationPrice from '@/components/v2/ic/IcDestinationPrice.vue';

  const router = useRouter();
  const route = useRoute();
  const scheduleStore = useScheduleStore();
  const {
    seats,
    selectedSeats,
    subTotalTicketNewAsmat,
    selectedDepartureTime,
    selectedDeparturePool,
    selectedDestinationPool,
    date,

    /* Return */
    seatsReturn,
    selectedSeatsReturn,
    subTotalTicketNewAsmatReturn,
    selectedDepartureTimeReturn,
    dateReturn
  } = storeToRefs(scheduleStore);
  const store = useStore();
  // const { selectedSeats } = storeToRefs(scheduleStore);

  
  /* Initial Data */
  const { isDepTimeShow, isSeatsShow, isSeatsReturnShow, showSpinner, departureCode, showSpinnerParent, showSpinnerToReservation , isSelectPoolError, isSelectScheduleError } = useInitialData();

  /* Fetching Initial Data */
  const isFetching = ref(true);
  const isError = ref(false);
  const { init } = useDestinationOnMountedEvent(); 
  const fetchInitialData = async () => {
    // isError.value = false
    showSpinnerParent.value = true
    try {
      if (!store.routingFromAds) {
        console.log('Not From Ads')
        scheduleStore.date = new Date();
        await scheduleStore.getDeparture();
        await scheduleStore.getDestination({
          destination:  departureCode,
        });
      }
      
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

  /* Select Departure Function */
  const { selectDepartureTimeEvent } = useSelectDepartureTimeEvent();
  
  //Event When Fetching New Destination Pool, date etc
  const { isResetScroll, backToSelectTime } = useBackToSelectTime();

  /* Departure Date Return Modal Handler */
  const departureDateReturnRef = ref(null);
  
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
  <div>
    <OverlaySpinner :bg="`bg-[${colors.primaryColor}]`" spinnerColor="white" v-show="showSpinnerParent" zIndex="z-[99]"/>
    <OverlaySpinner :bg="`bg-[${colors.primaryColor}]`" spinnerColor="white" v-show="showSpinnerParent" zIndex="z-[99]"/>
    <OverlaySpinner :bg="`bg-[#0000003f]`" :spinnerColor="colors.primaryColor" v-show="showSpinnerToReservation" zIndex="z-[99]"/>
    <DeparturePool
      @backToSelectTime="backToSelectTime" @showSpinnerEvent="showSpinnerEvent"
    />
    <DestinationPool
      v-if="!isError"
      @backToSelectTime="backToSelectTime"
    />

    <!-- Departure Date -->
    <DepartureDate
      :date="scheduleStore.date"
      @backToSelectTime="backToSelectTime"
      @showSpinnerEvent="showSpinnerEvent"
    />

    <!-- Departure Date Return -->
    <DepartureDate
      v-show="scheduleStore.isRoundedTrip"
      ref="departureDateReturnRef"
      :minDate="scheduleStore.date"
      :date="scheduleStore.dateReturn"
      :returnDate="true"
      @backToSelectTime="backToSelectTime(true)"
      @showSpinnerEvent="showSpinnerEvent"
    />

    <DepartureTime
      v-if="isDepTimeShow"
      :resetScroll="isResetScroll"
      @selectDepartureTimeEvent="selectDepartureTimeEvent"
      @modalDepartureDateHandler="departureDateReturnRef?.dateModal"
    >
      <template #overlaySpinner>
        <ErrorState bg="bg-[white]" :textColor="colors.fontPrimaryColor" v-show="isSelectPoolError" @retryOnClick="onRetrySelectDestinationPool"></ErrorState>
        <OverlaySpinner :spinnerColor="colors.primaryColor" v-show="showSpinner" />
      </template>
    </DepartureTime>
    <Transition>
      <SeatsLayout
        v-if="isSeatsShow"
        :isSelectScheduleError="isSelectScheduleError"
        :seats="scheduleStore.seats"
        :selectedSeats="selectedSeats"
        :subTotalTicket="subTotalTicketNewAsmat"
        :selectedDepartureTime="selectedDepartureTime"
        :date="date"
        @backToSelectTime="backToSelectTime"
      >
        <template #tripInformation>
          <!-- Departure -->
          <div v-if="selectedDeparturePool?.pool_name.length > 18">
            {{ selectedDeparturePool?.pool_name.slice(0, 13) + "..." }}
          </div>
          <div v-else>
            {{ selectedDeparturePool?.pool_name }}
          </div>
          <img src="@/assets/images/right_arrow.png" alt="right_arrow.png">

          <!-- Destination -->
          <div v-if="selectedDestinationPool?.destination_pool.length > 12">
              {{ selectedDestinationPool?.destination_pool.slice(0, 12) + "..." }}
          </div>
          <div v-else>
            {{ selectedDestinationPool?.destination_pool }}
          </div>
        </template>
        <template #overlaySpinner>
          <ErrorState bg="bg-[white]" :textColor="colors.fontPrimaryColor" v-show="isSelectScheduleError"  @retryOnClick="onRetrySelectSchedule"></ErrorState>
          <OverlaySpinner :spinnerColor="colors.primaryColor" v-show="showSpinner" />
        </template>
      </SeatsLayout>
    </Transition>

    <Transition>
      <SeatsLayout
        v-if="isSeatsReturnShow"
        :isReturn="true"
        :isSelectScheduleError="isSelectScheduleError"
        :seats="scheduleStore.seatsReturn"
        :selectedSeats="selectedSeatsReturn"
        :subTotalTicket="subTotalTicketNewAsmatReturn"
        :selectedDepartureTime="selectedDepartureTimeReturn"
        :date="dateReturn"
        @backToSelectTime="backToSelectTime(true)"
      >
        <template #tripInformation>
          <div v-if="selectedDestinationPool?.destination_pool.length > 12">
              {{ selectedDestinationPool?.destination_pool.slice(0, 12) + "..." }}
          </div>
          <div v-else>
            {{ selectedDestinationPool?.destination_pool }}
          </div>
         
          <img src="@/assets/images/right_arrow.png" alt="right_arrow.png">
          
          <div v-if="selectedDeparturePool?.pool_name.length > 18">
            {{ selectedDeparturePool?.pool_name.slice(0, 13) + "..." }}
          </div>
          <div v-else>
            {{ selectedDeparturePool?.pool_name }}
          </div>
        </template>
        <template #overlaySpinner>
          <ErrorState bg="bg-[white]" :textColor="colors.fontPrimaryColor" v-show="isSelectScheduleError"  @retryOnClick="onRetrySelectSchedule"></ErrorState>
          <OverlaySpinner :spinnerColor="colors.primaryColor" v-show="showSpinner" />
        </template>
      </SeatsLayout>
    </Transition>
    <div v-if="isDepTimeShow" class="flex w-[645px] absolute bottom-[30px]">
      <router-link
        v-if="features.isBoarding"
        :to="{ name: 'boarding' }"
        class="send w-[303px] h-20 rounded-[30px] flex items-center justify-center"
        :class="[`bg-[${colors.secondaryColor}]`]"
      >
          <div class="font-bold text-[36px]" :class="`text-[${colors.primaryColor}]`">Boarding</div>
      </router-link>
    </div>
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