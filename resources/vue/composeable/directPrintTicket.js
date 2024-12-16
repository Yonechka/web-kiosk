import { ref } from 'vue';
import { useScheduleStore } from '@/store/ScheduleStore';
import { useStore } from '@/store/Store';

import debounce from 'lodash.debounce';

/* Initial Data */
const input = ref(null); // QR Text Input
const bookingCode = ref(null); 
const isFetching = ref(false);
const isModal = ref(false);
const isPrintCompleted = ref(false);
const isSpinner = ref(false);
const printTicketData = ref(null);

export const usePrintInitialData = () => {
  return { input, bookingCode, isFetching, isModal, isPrintCompleted, isSpinner, printTicketData };
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
export const useEventInput = (t) => {
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
    if (bookingCode.value === null) return;
    try {
      isSpinner.value = true;
      isFetching.value = true;
      let result;
      
      blurInput();
      result = await scheduleStore.detailBooking(bookingCode.value);
      isSpinner.value = false;
      if (result?.tiketux?.status != 'ERROR') {
        isModal.value = true;
        printTicketData.value = result;
        console.log(printTicketData.value)
      } else {
        isFetching.value = false;
        focus();
        bookingCode.value = null;
        toastConfig(t('directPrintTicket.toast.printFail'), result?.tiketux?.pesan);
      }
    } catch (error) {
      console.log(error);
      isFetching.value = false;
      isSpinner.value = false;
      bookingCode.value = null;
      focus();
      toastConfig(t('directPrintTicket.toast.onError'), error?.msg);
    }
  };

  let debouncePrint = debounce(() => { 
    changeEvent();
    console.log('debounce active')
  }, 30);



  return { blurInput, focus, changeEvent, debouncePrint };
}