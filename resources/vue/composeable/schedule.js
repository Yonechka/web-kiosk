import { ref, reactive, computed, watch } from 'vue';
import { useScheduleStore } from '../store/ScheduleStore';
import { storeToRefs } from 'pinia'
import { useStore } from '../store/Store';
import Features from '../config/features';

const isDepTimeShow = ref(true);
const isSeatsShow = ref(false);
const isSeatsReturnShow = ref(false);
const showSpinner = ref(false);
const showSpinnerParent = ref(true);
const showSpinnerToReservation = ref(false);
const isSelectPoolError = ref(false);
const isSelectScheduleError = ref(false);

export const useInitialData = () => {
  const store = useStore();
  const { departureCode } = storeToRefs(store);
  return {
    isDepTimeShow,
    isSeatsShow,
    isSeatsReturnShow,
    showSpinner,
    isSelectPoolError,
    isSelectScheduleError,
    showSpinnerParent,
    showSpinnerToReservation,
    departureCode: departureCode.value,
  };
}

export const useSelectDepartureTimeEvent = (isReturn = false) => {
  const scheduleStore = useScheduleStore();

  const selectDepartureTimeEvent = async (code) => {
    try {
      let params = {
        schedule_code: code,
        departure_date: scheduleStore.departureDate,
        departure_id: scheduleStore.selectedDeparturePool.pool_code,
        destination_id: scheduleStore.selectedDestinationPool.destination_id,
        is_round_trip: scheduleStore.isRoundedTrip ? 1 : 0,
      }
      isSelectScheduleError.value = false;
  
      if (isReturn) {
        params.schedule_code = scheduleStore.selectedDepartureTime.code,
        params.schedule_code_return = code,
        params.departure_date_return = scheduleStore.departureDateReturn;
        params.departure_id_return = scheduleStore.selectedDestinationPool.destination_id;
        params.destination_id_return = scheduleStore.selectedDeparturePool.pool_code;
        isSeatsReturnShow.value = !isSeatsReturnShow.value;
      } else {
        isSeatsShow.value = !isSeatsShow.value;
      }
      
      isDepTimeShow.value = !isDepTimeShow.value;
      showSpinner.value = true;
      await scheduleStore.getSeat(params, isReturn);
      showSpinner.value = false;
    } catch (error) {
      isSelectScheduleError.value = true;
      console.log('selectSchedule onError', error)
    }
  };

  return {
    isDepTimeShow,
    isSeatsShow,
    showSpinner,
    selectDepartureTimeEvent
  };
}

export const useBackToSelectTime = () => {

  const scheduleStore = useScheduleStore();
  const isResetScroll = ref(0);  //Reset Scroll On Select Destination Pool
  const backToSelectTime = (isReturn = false) => {
    const seats = isReturn ? 'seatsReturn' : 'seats';
    const departureTime = isReturn ? 'departureTimeReturn' : 'departureTime';
    scheduleStore[seats] = { seats_layout: [] };
    scheduleStore[departureTime].forEach(time => {
      time.isSelected = false;
    });
    poolHeightContainer.value.forEach((item, index) => {
      poolHeightContainer.value[index] = 59;
      isDestinationWrapperExpanded.value[index] = false;
    });
    isReturn ? isSeatsReturnShow.value = false : isSeatsShow.value = false;
    isDepTimeShow.value = true;
    isResetScroll.value++;
  }
  return {
    isResetScroll,
    backToSelectTime
  };
}

export const useRoutingValidation = (to, from) => {
  const scheduleStore = useScheduleStore();
  const routeValidate = () => {
    if (to.name === 'sendEticket' || to.name === 'boarding' || to.name === 'idle') {
      return true;
    }
    if (scheduleStore.selectedSeats.length > 0) {
      console.log('seat is selected');
      return true;
    } else {
      console.log('seat is not selected');
      return false;
    }
  }
  return { routeValidate }
}

export const useResetStore = () => {
  const store = useStore();
  const scheduleStore = useScheduleStore();

  const { departureCode } = storeToRefs(store);
  

  const resetStore = async () => {
    if (store.isReset){
      console.log('reset true');
      // store.$reset();
      scheduleStore.$reset();
      showSpinnerParent.value = true;
      scheduleStore.date = new Date();
      const { backToSelectTime } = useBackToSelectTime();
      backToSelectTime();
      await scheduleStore.getDeparture();
      await scheduleStore.getDestination({
        destination: departureCode.value,
      });
      await scheduleStore.getSchedule({
        destination_id: scheduleStore.selectedDestinationPool.destination_id,
        departure_date: scheduleStore.departureDate
      });
      showSpinnerParent.value = false;
      store.isReset = false;
    }
  }

  return { resetStore };

}

/* Destination Component */
const showSelectDestinationModal = ref(true);
const isMapShow = ref(false);
const poolItemWrapper = ref([]);
const poolHeightContainer = ref([]);
const isDestinationWrapperExpanded = ref([]);

export const useDestinationInitialData = () => {
  return {
    showSelectDestinationModal,
    isMapShow,
    poolItemWrapper,
    poolHeightContainer,
    isDestinationWrapperExpanded
  };
}

export const useMapModal = () => {
  const urlMaps = ref(null);
  const location = reactive({
    id: null,
    city: null,
    address: null
  });
  const mapModalShow = (latitude, longitude, { id, city, address }) => {
    isMapShow.value = true;
    urlMaps.value = `//maps.google.com/maps?zoom=0&q=${latitude},${longitude}&z=15&output=embed`;
    location.id = id;
    location.city = city;
    location.address = address;
  };
  const mapModalClose = () => {
    isMapShow.value = false;
    console.log('test');
  };

  return { urlMaps, location, mapModalShow, mapModalClose };
}

export const useSelectPool = (emit) => {
  const scheduleStore = useScheduleStore();
  const backToSelectTime = () => emit('backToSelectTime'); 
  const showSpinnerEvent = (value) => showSpinner.value = value; 
  const openModalSelectDestination = () => showSelectDestinationModal.value = !showSelectDestinationModal.value;
  const selectPool = async (destination_id) => {
    try {
      isSelectPoolError.value = false;
      isSelectScheduleError.value = false;
      openModalSelectDestination();
      
      isMapShow.value = false;
      scheduleStore.destinationPools.forEach(pool => {
        pool.isSelected = false;
        if (pool.destination_id === destination_id) pool.isSelected = true;
      });
      showSpinnerEvent(true);
      backToSelectTime();
      await scheduleStore.getSchedule({
        destination_id,
        departure_date: scheduleStore.departureDate,
        departure_id: scheduleStore.selectedDeparturePool.pool_code
      });

      if (scheduleStore.isRoundedTrip) {
        backToSelectTime(true);
        await scheduleStore.getSchedule({
          departure_date: scheduleStore.departureDateReturn,
          destination_id: scheduleStore.selectedDeparturePool.pool_code,
          departure_id: destination_id
        }, true);
      }
      showSpinnerEvent(false);
    } catch (error) {
      console.log('selectPool on Error', error);
      isSelectPoolError.value = true;
      showSpinner.value = false
    }
  }

  /* On Retry Select Destination */
  const onRetrySelectDestinationPool = async () => {
    const destinationId = scheduleStore.selectedDestinationPool.destination_id;
    await selectPool(destinationId);
    isSelectPoolError.value = false;
  }

  return {
    openModalSelectDestination,
    selectPool,
    backToSelectTime,
    showSpinnerEvent,
    onRetrySelectDestinationPool,
    isSelectPoolError
  };
}

export const useExpandPoolWrapper = () => {
  const poolContainer = ref([]);
  const expandPool = (index) => {
    isDestinationWrapperExpanded.value.forEach((item, _index) => {
      if (index != _index){
        isDestinationWrapperExpanded.value[_index] = false;
        poolHeightContainer.value[_index] = 59
      };
    });
    isDestinationWrapperExpanded.value[index] = !isDestinationWrapperExpanded.value[index];
    if (!isDestinationWrapperExpanded.value[index]) {
      poolHeightContainer.value[index] = 59
    } else {
      poolHeightContainer.value[index] += (poolItemWrapper.value[index].scrollHeight + 63);
    };
  }
  return { poolContainer, expandPool }; 
}

export const useDestinationOnMountedEvent = () => {
  const init = () => {
    poolItemWrapper.value.forEach((item, index) => {
      const height = 59;
      poolHeightContainer.value.push(height);
      isDestinationWrapperExpanded.value.push(false);
    });
  }

  return { init };
}

export const useDestinationOnActivatedEvent = () => {
  const store = useStore();
  const init = () => {
    if (store.isReset) {
      showSelectDestinationModal.value = true;
    };
    poolHeightContainer.value.forEach((item, index) => {
      poolHeightContainer.value[index] = 59;
      isDestinationWrapperExpanded.value[index] = false;
    });
  }
  return { init };
}


/* Departure Date Component */
export const useSelectDate = (emit, returnDate = false) => {
  const scheduleStore = useScheduleStore();
  const store = useStore();

  const { departureCode } = storeToRefs(store);
  let isShow = ref(false);

  const backToSelectTime = () => emit('backToSelectTime', returnDate); 
  const showSpinnerEvent = (value) => emit('showSpinnerEvent', value); 

  const dateModal = () => isShow.value = !isShow.value;
  const dateChange = async (date) => {
    try {
      returnDate ? scheduleStore.dateReturn = date : scheduleStore.date = date;
      const params = {
        departure_id: returnDate ? scheduleStore.selectedDestinationPool.destination_id : scheduleStore.selectedDeparturePool.pool_code,
        destination_id: returnDate ? scheduleStore.selectedDeparturePool.pool_code : scheduleStore.selectedDestinationPool.destination_id,
        departure_date: returnDate ? scheduleStore.departureDateReturn : scheduleStore.departureDate
      };
      backToSelectTime();
      isShow.value = false;
      showSpinnerEvent(true);
      await scheduleStore.getSchedule(params, returnDate);
      showSpinnerEvent(false);
    } catch (error) {
      showSpinner.value = false;
      isSelectPoolError.value = true;
      console.log('dateChange onError', error);
    }
  };

  return {
    isShow,
    backToSelectTime,
    showSpinnerEvent,
    dateModal,
    dateChange,
  };
}

export const useMaxYears = () => {
  const maxYears = ref(new Date());
  maxYears.value.setMonth(new Date().getMonth() + 1);

  return { maxYears }; 
}

export const useTodayTomorrowDate = (emit) => { //also used in departure time component
  const scheduleStore = useScheduleStore();

  const today = ref(new Date());
  const tomorrow = ref(new Date(today.value.getTime()));
  tomorrow.value.setDate(today.value.getDate() + 1);

  const isToday = computed(() => scheduleStore.date.toLocaleDateString() === today.value.toLocaleDateString());
  const isTomorrow = computed(() => scheduleStore.date.toLocaleDateString() === tomorrow.value.toLocaleDateString());
  const { dateChange } = useSelectDate(emit);  

  const selectToday = () => {
    dateChange(today.value);
    console.log('today select', today.value);
  };
  const selectTomorrow = () => {
    dateChange(tomorrow.value);
    console.log('tomorrow select', tomorrow.value);
  };

  return {
    today,
    tomorrow,
    isToday,
    isTomorrow,
    selectToday,
    selectTomorrow
  };
}

/* Deaprture Time Component */
export const useSelectDepartureTime = (emit, isReturn = false) => {
  const scheduleStore = useScheduleStore();
  const departureTimeToChange = isReturn ? 'departureTimeReturn' : 'departureTime';
  const selectDepartureTime = (code) => {
    scheduleStore[departureTimeToChange].forEach(time => {
      time.isSelected = false;
      if (code === time.code) time.isSelected = true;
    });
    emit('selectDepartureTimeEvent', code);
  };

  return { selectDepartureTime };
}

export const useResetScroll = (isResetScroll) => {
  const wrapperDepartureTime = ref(null);
  watch(isResetScroll, () => {
    console.log('trigger watch');
    if (wrapperDepartureTime.value?.scrollTop) wrapperDepartureTime.value.scrollTop = 0;
  });

  return { wrapperDepartureTime };
}

export const useDepartureTimeModal = () => {
  let isShow = ref(false);
  const departureTimeModal = () => isShow.value = !isShow.value;

  return { isShow, departureTimeModal };
}

/* Seats Layout Component */
export const useSeatsNo = () => {
  const seatsNo = reactive([]);
  for (let i = 1; i <= 200; i++) {
    seatsNo.push(i.toString());
  }

  return { seatsNo };
}

export const useSelectSeats = (router, isReturn = false) => {
  const scheduleStore = useScheduleStore();
  const seatsToSelect = isReturn ? 'seatsReturn' : 'seats';
  const selectSeat = (label) => {
    scheduleStore[seatsToSelect].seats_layout.forEach((item) => {
     if (item.label === label) {
       item.isSelected = !item.isSelected
     }
    })
  }

  const toReservation = async () => {
    const clientId = document.querySelector('[name=clientId]').content;
    const params = {
      departure_date: scheduleStore.departureDate,
      product_id: scheduleStore.selectedDepartureTime.code,
      departure_outlet: scheduleStore.selectedDeparturePool.pool_code,
      destination_outlet: scheduleStore.selectedDestinationPool.destination_code,
      seats: scheduleStore.selectedSeats.map(({ label }) => label).join(','),
      is_insurance: Features[clientId].isInsurance ? 1 : 0,
      voucher_code: scheduleStore.appliedVoucher
    }
    if (scheduleStore.isRoundedTrip) {
      
      params.departure_date_return = scheduleStore.departureDateReturn;
      params.product_id_return = scheduleStore.selectedDepartureTimeReturn.code;
      params.departure_outlet_return = scheduleStore.selectedDestinationPool.destination_code;
      params.destination_outlet_return = scheduleStore.selectedDeparturePool.pool_code;
      params.seats_return = scheduleStore.selectedSeatsReturn.map(({ label }) => label).join(',')
    }

    showSpinnerToReservation.value = true
    const result = await scheduleStore.getPriceTotal(params);
    showSpinnerToReservation.value = false
    if (result.success) {
      router.push({ name: 'reservation' })
    }
  }

  return { selectSeat, toReservation, showSpinnerToReservation };
}

export const useScrollIndicator = () => {
  const seatsWrapper = ref(null);
  const isScrollMax = ref(false);
  const scrollSeatsWrapper = () => {
    isScrollMax.value = seatsWrapper.value.scrollTop + seatsWrapper.value.clientHeight >= seatsWrapper.value.scrollHeight - 5;
  }
  const scrollBottom = () => {
    seatsWrapper.value.scrollTop += 25;
  }

  return {
    seatsWrapper,
    isScrollMax,
    scrollSeatsWrapper,
    scrollBottom
  };
}
