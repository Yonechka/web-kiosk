import { ref, onMounted, computed } from 'vue';
import { useScheduleStore } from '../store/ScheduleStore';
import Features from '../config/features';
import debounce from 'lodash.debounce';

// const router = useRouter();
// const route = useRoute();

const phoneNo = ref(null);
const showSpinner = ref(false);
const showToast = ref(false);
const toastMessage = ref('test');

// const scheduleStore = useScheduleStore();

export const useReservationInitialData = () => {
  return {
    phoneNo,
    showSpinner,
    showToast,
    toastMessage
  };
}

export const useVoucherCheck = (isNewAsmat = true) => {
  const scheduleStore = useScheduleStore();
  const showModal = ref(false);
  const isSelectOption = ref(true);
  const isInputOption = ref(false);
  const isScanModal = ref(false);
  const voucherCodeInput = ref(null); //Voucher for input manually
  const voucherCodeScan = ref(null); //Voucher for input scan
  const isSuccessState = ref(false);
  const isErrorState = ref(false);
  const isFetching = ref(false);
  const voucherCodeScanElement = ref(null);
  

  const clientId = document.querySelector('[name=clientId]').content;


  /* border input class dynamic */
  const borderInputDynamic = computed(() => {
    if (isSuccessState.value) return 'border-[#16A34A]';
    if (isErrorState.value) return 'border-[#DC2626]';
    return 'border-[#B5B5B5]';
  });


  /* Success Voucher */
  let intervalSuceessVoucher;
  let countDownDuration = ref(3);

  const countDown = async () => {
    if (countDownDuration.value > 0) {
      countDownDuration.value--;
    } else {
      clearInterval(intervalSuceessVoucher);
      showModal.value = false;
      isInputOption.value = false;
      isScanModal.value = false;
      isSelectOption.value = true;
      isSuccessState.value = false;
      voucherCodeInput.value = '';
      setTimeout(() => {
        countDownDuration.value = 3;
      }, 500)
      console.log('done bang');
      
    }
  }
  const startInterval = () => {
    intervalSuceessVoucher = setInterval(countDown, 1000);
  }


  const paramsCheckPrice = {
    departure_date: scheduleStore.departureDate,
    product_id: scheduleStore.selectedDepartureTime.code,
    departure_outlet: scheduleStore.selectedDeparturePool.pool_code,
    destination_outlet: scheduleStore.selectedDestinationPool.destination_code,
    seats: scheduleStore.selectedSeats.map(({ label }) => label).join(','),
    is_insurance: Features[clientId].isInsurance ? 1 : 0,
  };

  if (scheduleStore.isRoundedTrip) { 
    paramsCheckPrice.departure_date_return = scheduleStore.departureDateReturn;
    paramsCheckPrice.product_id_return = scheduleStore.selectedDepartureTimeReturn.code;
    paramsCheckPrice.departure_outlet_return = scheduleStore.selectedDestinationPool.destination_code;
    paramsCheckPrice.destination_outlet_return = scheduleStore.selectedDeparturePool.pool_code;
    paramsCheckPrice.seats_return = scheduleStore.selectedSeatsReturn.map(({ label }) => label).join(',')
  }

  const focus = () => {
    if (isFetching.value) {
      voucherCodeScanElement.value.blur();
    } else {
      voucherCodeScanElement.value.focus();
    }
  };

  const checkVoucherHandler = async (isScanner = false) => {
    if (isScanner && voucherCodeScan.value == null) return;
    isErrorState.value = false;
    const seatsNo = [];
    scheduleStore.selectedSeats.forEach(item => {
        seatsNo.push(item.label);
    });

    const voucherToApply = () => isScanner ? voucherCodeScan.value : voucherCodeInput.value;

    const params = {
      departure_date: scheduleStore.departureDate,
      departure_time: scheduleStore.selectedDepartureTime.departure_time,
      product_id: scheduleStore.selectedDepartureTime.code,
      departure_outlet: scheduleStore.selectedDeparturePool.pool_code,
      destination_outlet: scheduleStore.selectedDestinationPool.destination_id,
      seats: seatsNo,
      phone_no: phoneNo.value,
      isRoundTrip: 0,
      code: voucherToApply(),
    };

    isFetching.value = true;
    isScanner ? voucherCodeScanElement.value.blur() : '';
    const result = await scheduleStore.voucherCheck(params);
    
    if (!result.success) {
      if (isScanner) {
        voucherCodeScanElement.value.focus();
        voucherCodeScan.value = null;
      };
      isErrorState.value = true;
      isFetching.value = false;
      throw new Error();
    };

    if (isNewAsmat) { 
      const resultCheckPrice = await scheduleStore.getPriceTotal(
        {
          ...paramsCheckPrice,
          voucher_code: voucherToApply(),
        }
      );
      
      if (!resultCheckPrice) {
        if (isScanner) {
          voucherCodeScanElement.value.focus();
          voucherCodeScan.value = null;
        };
        isErrorState.value = true;
        throw new Error();
      };
    }
    isFetching.value = false;

    // focus();
    startInterval();
    isErrorState.value = false;
    isSuccessState.value = true;
    scheduleStore.appliedVoucher = voucherToApply();
  }

  const clearVoucherHandler = async () => {
    scheduleStore.appliedVoucher = null;
    if (isNewAsmat) {
      await scheduleStore.getPriceTotal({...paramsCheckPrice, voucher_code: null});
    }
    voucherCodeScan.value = null;
    voucherCodeInput.value = null;
    scheduleStore.voucherData = null;
  }

  let debounceVoucherScan = debounce(() => { 
    checkVoucherHandler(true);

    console.log('debounce active')
  }, 30);

  

  return {
    showModal,
    voucherCodeInput,
    voucherCodeScan,
    isSelectOption,
    isInputOption,
    isScanModal,
    isFetching,
    debounceVoucherScan,
    isErrorState,
    isSuccessState,
    voucherCodeScanElement,
    countDownDuration,
    borderInputDynamic,
    focus,
    startInterval,
    checkVoucherHandler,
    clearVoucherHandler,
  };
}

export const useBookingTicket = (router, isNewAsmat = true) => {
  const scheduleStore = useScheduleStore();


  const freepassBooking = async () => {

    let isPaid;
    if (isNewAsmat) {
      isPaid = await scheduleStore.checkPaymentStatus();
      await scheduleStore.getDetailBooking();
    } else {
      isPaid = await scheduleStore.getDetailBooking();
    }

    isPaid ? router.push({ name: 'completed' }) : router.push({ name: 'payment' });
  }

  const bookingTicket = async () => {
    try {
      scheduleStore.customerInfo.PhoneNo = phoneNo.value;
      showSpinner.value = true;
      scheduleStore.registeredCustomer = null;
      await scheduleStore.getListPayment();
      const checkUser = await scheduleStore.userCheck({ phone_number: phoneNo.value });
      const booking = await scheduleStore.bookingTicket(); 
      
      if (booking.success) {
        /* Redirect dynamically based on using voucher freepass or not  */
        if (
            scheduleStore.appliedVoucher &&
            (scheduleStore.voucherData.deduction_type == 'Freepass' || scheduleStore?.voucherData?.total == 0)
        ) {
          await freepassBooking(); 
        } else {
          router.push({ name: 'payment' });
        }
        
      } else {
        toastMessage.value = booking?.message;
        showToast.value = true;
        console.log('error Payment');
      }
      showSpinner.value = false;
    } catch (error) {
      console.log('this is error message', error);
      showSpinner.value = false;
      toastMessage.value = error?.msg
      showToast.value = true;
    }
  }
  return { bookingTicket };
}

export const useOnBeforeRouteLeave = (to, from) => {
  const init = () => {
    if (to.name === 'payment' || to.name == 'idle') {
      return true;
    } else if (to.name === 'schedule') {
      console.log(`routing from ${from.name} to ${to.name}`);
      return true;
    } else if (to.name === 'completed') {
      console.log(`freepas, routing from ${from.name} to ${to.name}`);
      return true;
    } else {
      console.log(`else, routing from ${from.name} to ${to.name}`);
      return false;
    }
  }
  return { init };
}

const inputV2 = ref(null);
export const useKeyboard = () => {
  const scheduleStore = useScheduleStore();
  const input = ref(null);
  const isDeleteButtonPressed = ref(false);
  const intervalDuration = ref(230);
  const pointerPosition = ref(0);

  const onPointerChange = () => {
    pointerPosition.value = input.value.selectionStart
    console.log('pointer', pointerPosition.value)
  }
  
  const { clearVoucherHandler } = useVoucherCheck();

  const keyboardClick = async (value, e) => {
    if (scheduleStore.appliedVoucher) {
      showSpinner.value = true;
      await clearVoucherHandler();
      showSpinner.value = false;
    }
    if (phoneNo.value === null) {
      phoneNo.value = value;
      pointerPosition.value += 1;
    } else if(phoneNo?.value.length < 15) {
      phoneNo.value = phoneNo.value.substring(0, pointerPosition.value) + value + phoneNo.value.substring(pointerPosition.value);
      pointerPosition.value += 1 ;
    }
    setTimeout(() => {
      input.value.focus();
      input.value.setSelectionRange(pointerPosition.value, pointerPosition.value);
    })

  };
  
  const deleteLetter = async () => {
    if (scheduleStore.appliedVoucher) {
      showSpinner.value = true;
      await clearVoucherHandler();
      showSpinner.value = false;
    }
    if (phoneNo.value !== null && pointerPosition.value !== 0) {
      // phoneNo.value = phoneNo.value.slice(0, -1)
      phoneNo.value = phoneNo.value.substring(0, pointerPosition.value - 1) + phoneNo.value.substring(pointerPosition.value);
      pointerPosition.value -= 1;
      setTimeout(() => {
        input.value.focus();
        input.value.setSelectionRange(pointerPosition.value, pointerPosition.value);
      })
    };
  };
  const getIntervalDuration = () => {
    return intervalDuration.value - 100;
  };
  const keyDownDeleteLetter = () => {
    // input.value.focus();
    isDeleteButtonPressed.value = true;
    deleteLetter();

    let intervalId = setInterval(() => {
      if (isDeleteButtonPressed.value) {
        deleteLetter();
        intervalDuration.value -= 100;
        clearInterval(intervalId);
        intervalId = setInterval(keyDownDeleteLetter(), intervalDuration.value);
      } else {
        intervalDuration.value = 230;
        clearInterval(intervalId);
      }
    }, intervalDuration.value);
  };
  const keyUpDeleteLetter = () => {
    isDeleteButtonPressed.value = false;
    intervalDuration.value = 230;
  };

  return {
    input,
    inputV2,
    isDeleteButtonPressed,
    intervalDuration,
    keyboardClick,
    deleteLetter,
    getIntervalDuration,
    keyUpDeleteLetter,
    keyDownDeleteLetter,
    onPointerChange
  };
}

export const useOnActivatedEvent = () => {
  const init = () => {
    phoneNo.value = null;
  }

  return { init };
}