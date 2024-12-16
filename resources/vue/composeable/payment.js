import { ref, reactive, computed, watch } from 'vue';
import { useScheduleStore } from '../store/ScheduleStore';
import { useStore } from '../store/Store';
import { sha256 } from 'js-sha256';

let intervalCheckPaymentId; //Check Payment Interval Id

/* Initial Data */
const showSpinner = ref(false);
export const usePaymentInitialData = () => {
  return { showSpinner };
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
  
  return {
    showToast,
    toastTitle,
    toastMessage,
    toastConfig
  };
}


/* Payment Cancel Countdown */
let intervalCancelId;
const isCancel = ref(false);
let countDownTime = 60 * 10;
const minutesFormat = ref(null);
const secondFormat = ref(null);
export const usePaymentCancelCountDown = (router, t) => {

  const scheduleStore = useScheduleStore();
  const store = useStore();
  const { toastConfig } = useToast();

  const cancelCountDown = async () => {
    let minutes = Math.floor(countDownTime / 60);
    let seconds = countDownTime % 60;
    
    // Add leading zeros if necessary
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    minutesFormat.value = formattedMinutes;
    secondFormat.value = formattedSeconds;

    countDownTime--;
    if (countDownTime < 0) {
        clearInterval(intervalCancelId);
      try {
        const cancelBooking = await scheduleStore.cancelBooking({ booking_code: scheduleStore.bookingInfo.booking_code });
        if (cancelBooking.success) {
        clearInterval(intervalCheckPaymentId);
        isCancel.value = true;
        store.isReset = true;
        router.push({ name: 'schedule' });
        } else {
          toastConfig(t('payment.modal.failedCancel'), cancelBooking?.message);
        }
      } catch (error) {
        toastConfig(t('payment.modal.errorOccured'));
      } 
    }
  }
  const startCancelCountdown = () => {
    intervalCancelId = setInterval(cancelCountDown, 1000)
  }

  return {
    countDownTime,
    minutesFormat,
    secondFormat,
    isCancel,
    intervalCancelId,
    cancelCountDown,
    startCancelCountdown
  };
}

/* Payment Success Countdown */
const isShow = ref(false);
let intervalSuceessPayment;
let countDownDuration = ref(30);
export const usePaymentSuccess = (router) => {
  const scheduleStore = useScheduleStore();
  const countDown = async () => {
    if (countDownDuration.value > 0) {
      countDownDuration.value--;
    } else {
      clearInterval(intervalSuceessPayment);
      console.log('done bang');
      // await scheduleStore.checkPaymentStatus();
      router.push({ name: 'completed' });
    }
  }

  const startInterval = () => {
    if (!intervalSuceessPayment) {
      intervalSuceessPayment = setInterval(countDown, 1000);
    }
  }

  const toCompleted = async () => {
    clearInterval(intervalSuceessPayment);
    console.log('done bang');
    // await scheduleStore.checkPaymentStatus();
    router.push({ name: 'completed' });
  }

  return {
    countDownDuration,
    isShow,
    countDown,
    startInterval,
    toCompleted
  };

}

/* Check Payment */
export const useCheckPayment = (router, t, isNewAsmat = true) => {
  const scheduleStore = useScheduleStore();
  const { toastConfig } = useToast();
  const { startInterval } = usePaymentSuccess(router);

  const checkPaymentStatus = async () => {
    try {
      showSpinner.value = true;
      const isCompleted = isNewAsmat ? await scheduleStore.checkPaymentStatus() : await scheduleStore.getDetailBooking();
      showSpinner.value = false;
      if (isCompleted) {
        clearInterval(intervalCheckPaymentId);
        clearInterval(intervalCancelId);
        if (isNewAsmat) await scheduleStore.getDetailBooking();
      
        isShow.value = true;
        startInterval();
      } else {
        toastConfig(t('payment.modal.paymentNotConfirmed'));
      }
    } catch (error) {
      showSpinner.value = false;
      toastConfig(t('payment.modal.errorOccured'));
    }
  }
  const intervalCheckPayment = async () => {
    try {
      const isCompleted = isNewAsmat ? await scheduleStore.checkPaymentStatus() : await scheduleStore.getDetailBooking();
      if (isCompleted) {
        clearInterval(intervalCancelId);
        clearInterval(intervalCheckPaymentId);
        if (isNewAsmat) await scheduleStore.getDetailBooking();
        
        isShow.value = true;
        startInterval();
      }
    } catch (error) {
      console.log(error);
    }
  }
  const startIntervalCheckPayment = () => intervalCheckPaymentId = setInterval(intervalCheckPayment, 5000);

  return {
    checkPaymentStatus, startIntervalCheckPayment
  }
}

/* Cancel Booking */
const isModalCancelBooking = ref(false);
const redirectToReservation = ref(false); //To decide if the user want to cancel the reservation
const cancelSpinner = ref(false);
export const useCancelBooking = (router) => {
  const store = useStore();
  const cancelBooking = () => {
    const routeTo = store.isRouteToIdle ? 'idle' : 'reservation';
    redirectToReservation.value = true;
    router.push({
      name: routeTo,
    });
  }

  const closeModal = () => {
    store.isRouteToIdle = false; 
    isModalCancelBooking.value = false;
  }

  return {
    redirectToReservation,
    isModalCancelBooking,
    cancelSpinner,
    cancelBooking,
    closeModal
  };
}


/* onBeforeRouteLeave Event */
export const useOnBeforeRouteLeave = (to, from, t) => {
  const scheduleStore = useScheduleStore();
  const { toastConfig } = useToast();

  const cancelBookingRoute = async () => {
    isModalCancelBooking.value = true;
    if (redirectToReservation.value) {
      try {
        cancelSpinner.value = true;
        const cancelBooking = await scheduleStore.cancelBooking({ booking_code: scheduleStore.bookingInfo.booking_code });
        if (cancelBooking?.success) {
          clearInterval(intervalCancelId);
          clearInterval(intervalCheckPaymentId);
          cancelSpinner.value = false;
          return true;
        } else {
          toastConfig(t('payment.modal.failedCancel'), cancelBooking?.message);
          cancelSpinner.value = false;
          return false
        }
      } catch (error) {
        cancelSpinner.value = false;
        toastConfig(t('payment.modal.errorOccured'));
      }
    } else {
      console.log('not routing');
      return false;
    }
  }

  const init = () => {
    if (to.name === 'reservation' || to.name === 'idle') {
      return cancelBookingRoute();
    } else if (to.name === 'completed') {
      if (isShow.value) {
        clearInterval(intervalCancelId);
        return true;
      } else {
        return false;
      }
    } else if (to.name === 'schedule') {
      return isCancel.value ? true : false;
    } else {
      console.log(`route to ${to.name}`);
      return false;
    }
  }
  return { init };
}

/* EDC */
export const useEDC = (router, t, isNewAsmat = false) => {
  const scheduleStore = useScheduleStore();
  const { toastConfig } = useToast();
  const { startIntervalCheckPayment } = useCheckPayment(router, t, isNewAsmat);
  const { startCancelCountdown } = usePaymentCancelCountDown();
  const { startInterval } = usePaymentSuccess(router);

  const isEdc = ref(false);
  const paramsSetpaid = ref(null);
  const modalHelpEdc = ref(false);
  const showSpinnerEdc = ref(false);
  const isSetPaidError  = ref(false);
  
  const closeEdcModal = async () => {
    try {
      const params = {
        booking_code: null,
        description: 'kiosk',
        payment: 'qrissp',
        admin_fee: null,
        sales_channel: 'kiosk'
      }
      showSpinnerEdc.value = true;
      const back = await scheduleStore.changePayment(params);
      showSpinnerEdc.value = false;
      if (back?.success) {
        paramsSetpaid.value = null;
        isSetPaidError.value = false;
        isEdc.value = false;
        startCancelCountdown();
        startIntervalCheckPayment();
      } else {
        toastConfig(t('payment.modal.errorOccured'));
      }
    } catch (error) {
      showSpinnerEdc.value = false;
      console.log('the error', error)
      toastConfig(t('payment.modal.errorOccured'), error?.msg);
    }
    
  };
  
  const edcTransaction = async (payload) => {

    const { toastConfig } = useToast();
    showSpinnerEdc.value = true;
    window.electronAPI.createPaymentEdc(payload).then( async (data)=>{
      console.log('data raw edc', data);
      if (data.status == 1 && data.response["Response Code"] == "00") {
        try {
          const approvalCode = data.response["Approval Code"];
          console.log('this is changePaymentInfo', scheduleStore.changePaymentInfo)
          const paymentId = scheduleStore.changePaymentInfo.results.payment_status.payment_id;
          let totalPrice;
          isNewAsmat ? totalPrice = scheduleStore.totalTicketPriceNewAsmat : totalPrice = scheduleStore.totalTicketPrice
          const today = new Date();
          const dateTime = `${today.toISOString().slice(0, 10)} ${today.toLocaleTimeString()}`;
          let signature = sha256(`${paymentId}${approvalCode}${totalPrice}6edf7633-177d-4870-8dd8-256eba2d2ab7`);

          const params = {
            payment_id: paymentId,
            approval_code: approvalCode,
            total_harga: totalPrice,
            signature,
            batch: data.response["Batch Number"],
            issuer_id: data.response["Issuer Id"],
            date_time: dateTime,
          };
          console.log('this is params setpaid', params);
          
          const setPaid = await scheduleStore.setpaid(params);
          await scheduleStore.getDetailBooking();
          console.log('this is setpaid response', setPaid);
          showSpinnerEdc.value = false;
          if (setPaid.success) {
            isShow.value = true;
            isEdc.value = !isEdc.value;
            startInterval();
            console.log('payment successful', data);
          } else {
            isSetPaidError.value = true;
            paramsSetpaid.value = params;
            toastConfig(t('payment.modal.paymentNotConfirmed'));
          }
        } catch (error) {
          showSpinnerEdc.value = false;
          console.log('on error setpaid', error)
          toastConfig(t('payment.modal.errorOccured'), error?.msg);
        }
      } else {
        showSpinnerEdc.value = false;
        toastConfig(t('payment.modal.paymentFailed'), data?.message);
        console.log('payment failed', data);
      }
      
    }).catch((error) => {
      console.log('Error Catch', error);
      showSpinnerEdc.value = false;
      toastConfig(t('payment.modal.errorOccured'), error?.message);
    })
  }

  const edcTransactionDev = async () => {
    let payload = {
      transactionType:"01",
      transactionAmount: scheduleStore.totalTicketPrice, 
      pan: "1688700627201892",
      expireDate: "2510",
    };

    console.log('edc from dev');

    await edcTransaction(payload);
  }

  const edcTransactionProd = async () => {
    let transactionAmount;
    console.log('totalTicketPrice', scheduleStore.totalTicketPrice)
    isNewAsmat ? transactionAmount = scheduleStore.totalTicketPriceNewAsmat : transactionAmount = scheduleStore.totalTicketPrice
    console.log()
    let payload = {
      transactionType:"01",
      transactionAmount,
      // transactionAmount: 1000,
      pan: '                   ',
      expireDate: '    ',
    };

    console.log('edc from prod');

    await edcTransaction(payload);
  }

  const edcModal = async () => {
    try {
      // if (!window.electronAPI) {
      //   toastConfig(t('payment.modal.edcNotSupported'))
      //   return;
      // }
      console.log('edc modal')
      showSpinner.value = true;
      const params = {
        booking_code: null,
        description: 'kiosk',
        payment: 'bcaedc',
        admin_fee: null,
        sales_channel: 'kiosk'
      }
      const edc = await scheduleStore.changePayment(params);
      showSpinner.value = false;
      if (edc?.success) {
        isEdc.value = !isEdc.value;
        clearInterval(intervalCheckPaymentId);
        clearInterval(intervalCancelId);
        const env = document.querySelector('[name=environment]').content;
        env === 'development' ? edcTransactionProd() : edcTransactionProd();
      } else {
        showSpinner.value = false;
        toastConfig(t('payment.modal.edcFail'))
      } 
    } catch (error) {
      showSpinner.value = false;
      toastConfig(t('payment.modal.errorOccured'), error?.msg);
    }
  };

  const retrySetPaid = async () => {
    showSpinnerEdc.value = true;
    const setPaid = await scheduleStore.setpaid(paramsSetpaid.value);
    showSpinnerEdc.value = false;
    if (setPaid.success) {
      isShow.value = true;
      isEdc.value = !isEdc.value;
      startInterval();
      console.log('payment successful', data);
    } else {
      toastConfig(t('payment.modal.paymentNotConfirmed'));
    }
  }

  return {
    isEdc,
    showSpinnerEdc,
    isSetPaidError,
    modalHelpEdc,
    closeEdcModal,
    edcModal,
    retrySetPaid
  };
}

/* Change Payment */
export const useChangePayment = () => {
  const scheduleStore = useScheduleStore();
  const { toastConfig } = useToast();
  const changePayment = async (payment) => {
    try {
      const params = {
        booking_code: null,
        description: 'kiosk',
        payment,
        admin_fee: null,
        sales_channel: 'kiosk'
      }
      showSpinner.value = true;
      const changePayment = await scheduleStore.changePayment(params);
      showSpinner.value = false;
      if (changePayment?.success) {
        return true;
      } else {
        toastConfig('Gagal Mengganti Payment Method', changePayment?.message);
        return false;
      }
    } catch (error) {
      showSpinner.value = false;
      toastConfig('Terjadi Kesalahan Saat Mengganti Payment Method', error?.msg);
      throw new Error();
    }
  }

  return { changePayment }
}

/* onUnmounted Hook Event */
export const useOnUnmountedHook = () => {
  const resetGlobalState = () => {
    /* Initial Data */
    intervalCheckPaymentId = null;
    showSpinner.value = false

    /* Toast */
    showToast.value = false;
    toastTitle.value = null;
    toastMessage.value = null;

    /* Payment Cancel Countdown */
    intervalCancelId = null;
    isCancel.value = false;
    countDownTime = 60 * 10;
    minutesFormat.value = null;
    secondFormat.value = null;

    /* Payment Success Countdown */
    isShow.value = false;
    intervalSuceessPayment = null;
    countDownDuration.value = 30;

    /* Cancel Booking */
    isModalCancelBooking.value = false;
    redirectToReservation.value = false; // To decide if the user want to cancel the reservation
    cancelSpinner.value = false;

    /* Clear All Interval, in case the interval not cleared correctly */
    clearInterval(intervalCancelId);
    clearInterval(intervalCheckPaymentId);
    clearInterval(intervalSuceessPayment);
  }
  
  return { resetGlobalState };
}