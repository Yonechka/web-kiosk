import { ref, watch } from 'vue';
import { useScheduleStore } from '../store/ScheduleStore';
import { useStore } from '../store/Store';
import { storeToRefs } from 'pinia'
import { oldAsmatBoardingTicket } from '../utils';

import debounce from 'lodash.debounce';

//const scheduleStore = useScheduleStore();
// const store = useStore();

/* Initial Data */
const input = ref(null); // QR Text Input
const noTicket = ref(null); 
const isFetching = ref(false);
const isModal = ref(false);
const isBoardingCompleted = ref(false);
const isSpinner = ref(false);
const isNewAsmat = ref(false);
export const useBoardingInitialData = ({ _isNewAsmat = false }) => {
  const store = useStore();
  const { departureCode } = storeToRefs(store);
  isNewAsmat.value = _isNewAsmat
  return { input, noTicket, isFetching, isModal, isBoardingCompleted, isSpinner, departureCode: departureCode.value };
}

/* Toast */
const showToast = ref(false);
const toastTitle = ref(null);
const toastMessage = ref(null);

export const useToast = () => {
  const toastConfig = (title, message = null) => {
    showToast.value = true;
    toastTitle.value = title;
    toastMessage.value = message;
  }

  return { showToast, toastTitle, toastMessage, toastConfig };
}

/* Event Boarding */
export const useEventInput = (t, isNewAsmat = false) => {
  const scheduleStore = useScheduleStore();
  const store = useStore();
  const { toastConfig } = useToast();
  const blurInput = () => {
    input.value.blur();
  };

  const focus = () => {
    if (isFetching.value) {
        blurInput();
    } else {
        input.value.focus();
    }
  };

  const changeEvent = async () => {
    if (noTicket.value === null) return;
    try {
      isSpinner.value = true;
      isFetching.value = true;
      let result;
      const params = {
        noTicket: isNewAsmat ? noTicket.value : oldAsmatBoardingTicket(noTicket.value),
        departureCode: store.departureCodeFromLS
      }
      blurInput();
      result = await scheduleStore.detailBoardingAction(params, isNewAsmat);
      isSpinner.value = false;
      if (result.success) {
        // noTicket.value = null;
        isModal.value = true;
      } else {
        isFetching.value = false;
        focus();
        noTicket.value = null;
        toastConfig(t('boarding.toast.boardingFail'), result?.message?.message);
      }
    } catch (error) {
        console.log(error)
      isSpinner.value = false;
      toastConfig(t('boarding.toast.onError'), error?.msg);
    }
  };

  let debounceBoarding = debounce(() => { 
    changeEvent();
    console.log('debounce active')
  }, 30);

  // watch(noTicket, (newValue, oldValue) => {
  //   console.log('watch triggered', { newValue, oldValue })
  // // debounce(changeEvent, 500);
  //   debounceBoarding();
  // });

  return { blurInput, focus, changeEvent, debounceBoarding };
}

/* Countdow Success */
const countdownDefault = 5;
let countDownDuration = ref(countdownDefault);
let intervalSuccessBoarding;
export const useBoardingSuccess = () => {
  const { focus } = useEventInput();
  const countDown = async () => {
    if (countDownDuration.value > 0) {
      countDownDuration.value--;
    } else {
      focus();
      clearInterval(intervalSuccessBoarding);
      countDownDuration.value = countdownDefault;
      isBoardingCompleted.value = false;
    }
  }

  const startInterval = () => {
    intervalSuccessBoarding = setInterval(countDown, 1000);
  }

  return {
    countDownDuration,
    startInterval,
  };
}

/* Handle Button */
export const useHandleButton = (toast, t,  isNewAsmat = false) => {
  const scheduleStore = useScheduleStore();
  const store = useStore();

  const { focus } = useEventInput();
  const { toastConfig } = useToast();
  const boarding = async () => {
    try {
      const params = {
        noTicket: isNewAsmat ? noTicket.value : oldAsmatBoardingTicket(noTicket.value),
        departureCode: store.departureCodeFromLS
      }

      isSpinner.value = true;
      let isBoarding = await scheduleStore.boarding(params);
      isSpinner.value = false;
      isModal.value = false;
      isFetching.value = false;
      noTicket.value = null;

      if (isBoarding.success) {
        toast.success(t('boarding.toast.boardingSuccess'), {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
          icon: false
        });
        const { startInterval } = useBoardingSuccess();
        startInterval();
        isBoardingCompleted.value = true;
      } else {
        toastConfig(t('boarding.toast.boardingFail'), isBoarding?.message);
      }
    } catch (error) {
      console.log(error)
      isSpinner.value = false;
      toastConfig(t('boarding.toast.onError'), error?.msg);
    }
  };

  const cancelBoarding = () => {
    noTicket.value = null;
    scheduleStore.detailBoarding = null;
    isModal.value = false;
    isFetching.value = false;
    focus();
  };

  const backToBoarding = () => {
    noTicket.value = null;
    focus();
    isBoardingCompleted.value = false; 
    countDownDuration.value = countdownDefault;
    clearInterval(intervalSuccessBoarding);   
  };

  return { boarding, cancelBoarding, backToBoarding };
}

/* Unmounted */
export const useUnMountedHook = () => {
  const resetGlobalState = () => { 
    input.value = null; // QR Text Input
    noTicket.value = null; 
    isFetching.value = false;
    isModal.value = false;
    isBoardingCompleted.value = false;
    isSpinner.value = false;

    showToast.value = false;
    toastTitle.value = null;
    toastMessage.value = null;

    clearInterval(intervalSuccessBoarding);
  }

  return { resetGlobalState };
}