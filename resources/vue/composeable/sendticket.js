import { ref } from 'vue';
import { useScheduleStore } from '../store/ScheduleStore';

export const useSendTicket = (toast, t) => {
  const scheduleStore = useScheduleStore();
  const isShow = ref(false);
  const value = ref(t('sendEticket.inputPlaceHolder'));
  const showSpinner = ref(false);

  const keyboardModal = () => isShow.value = !isShow.value;
  const updateValue = (newValue) => {
    value.value = newValue;
    isShow.value = false;
  }
  const sendEticket = async () => {
    try {
      showSpinner.value = true;
      const result = await scheduleStore.resendEticket({ email: value.value });
      showSpinner.value = false;
      if (result.success) {
        toast.success(t('sendEticket.toast.sendSuccess'), {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
          icon: false
        });
        value.value = t('sendEticket.inputPlaceHolder');
      } else {
        toast.error(`${t('sendEticket.toast.sendFailed')}, ${result.message}`, {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
          icon: false
        });
      }
    } catch (error) {
      toast.error(`${t('sendEticket.toast.onError')}, ${error?.msg}`, {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        icon: false
      });
      showSpinner.value = false;
      console.log('error', error);
    }
  }

  return { keyboardModal, updateValue, sendEticket, isShow, value, showSpinner };
}