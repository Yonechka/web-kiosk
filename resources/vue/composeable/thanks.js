import { ref } from 'vue';
import { useScheduleStore } from '../store/ScheduleStore';
import { useStore } from '../store/Store';
import { printFormat } from '../utils';


//const scheduleStore = useScheduleStore();
// const store = useStore();
const isPrinting = ref(true);
export const useCompleted = (router) => {
  const store = useStore();
  const complete = () => {
    store.isReset = true;

    /* Reseting is Printing Variable */
    isPrinting.value = true;
    router.push({ name: 'idle', params: { departureCode: localStorage.getItem('departureCode') } });
  };
  return { complete };
}


export const usePrintTicket = (toast, t, d, isNewAsmat = false) => {
  const scheduleStore = useScheduleStore();

  const printTicket = async () => {
    try {
      let otp;
      isNewAsmat ? otp = scheduleStore.otpNewAsmat : otp = scheduleStore.updateBookingInfo.otp;
      const params = {
        booking_code: scheduleStore.bookingInfo.booking_code,
        otp,
        print_all_ticket: 1
      }
      const isPrintInfo = await scheduleStore.printInfoAction(params);
      let roundedTrip = null;

      if (scheduleStore.isRoundedTrip) {
        roundedTrip = {
          departureOutlet: scheduleStore.selectedDeparturePool.pool_name,
          destinationOutlet: scheduleStore.selectedDestinationPool.destination_pool
        }
      }
      if (isPrintInfo.success) {
        const data = printFormat(scheduleStore.printInfo, t, d, roundedTrip);
        data.forEach(item => {
          item.style.marginLeft = '-7px';
        });

        const payload = {
          preview: false,
          data
        };
        console.log('this is payload print', payload);
        if (window.FlutterChannel) {
          const rawData = scheduleStore.printInfo;
          window.FlutterChannel.postMessage(JSON.stringify(rawData));
          console.log("Sending data to Flutter...");
        } else {
          console.log("Failed Sending data");
          toast.warning(`Platform Tidak Mendukung Aksi Printing!`, {
            position: toast.POSITION.TOP_CENTER
          });
        }
        return true;
      } else {
        isPrinting.value = false;
        toast.warning(`Terjadi Kesalahan Saat Proses Printing, ${isPrintInfo?.message}`, {
          position: toast.POSITION.TOP_CENTER
        });
        return false;
      }
    } catch (error) {
      isPrinting.value = false;
      toast.warning(`Terjadi kesalahan, ${error?.msg}`, {
        position: toast.POSITION.TOP_CENTER
      });
      return false;
    }
  }
  const rePrintTicket = () => {
    isPrinting.value = true;
    let roundedTrip = null;
    if (scheduleStore.isRoundedTrip) {
      roundedTrip = {
        departureOutlet: scheduleStore.selectedDeparturePool.pool_name,
        destinationOutlet: scheduleStore.selectedDestinationPool.destination_pool
      }
    }
    const data = printFormat(scheduleStore.printInfo, t, d, roundedTrip);
    data.forEach(item => {
      item.style.marginLeft = '-7px';
    });

    const payload = {
      preview: false,
      data
    };

    if (window.FlutterChannel) {
      const rawData = scheduleStore.updateBookingInfo;
      window.FlutterChannel.postMessage(JSON.stringify(rawData));
      console.log("Sending data to Flutter...");
    } else {
      console.log("Failed Sending data");
      toast.warning(`Platform Tidak Mendukung Aksi Printing!`, {
        position: toast.POSITION.TOP_CENTER
      });
    }

    console.log('this is payload print', rawData);
  }

  return { isPrinting, printTicket, rePrintTicket };
}

export const useCalculateAge = () => {
  const calculateAge = (birthTimestamp) => {
    const birthDate = new Date(birthTimestamp);
    const currentDate = new Date();

    const yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();

    // Check if the birthday hasn't occurred yet in the current year
    const hasNotHadBirthday = (
        currentDate.getMonth() < birthDate.getMonth() ||
        (
            currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate()
        )
    );

    return hasNotHadBirthday ? yearsDiff - 1 : yearsDiff;
  }
  return { calculateAge };
}

export const useTNC = () => {
  const scheduleStore = useScheduleStore();
  const isTnC = ref(false);
  let tnc = ref(null);

  const TnCModal = () => {
    isTnC.value = !isTnC.value;
  }
  const tncInit = async () => {
    tnc.value = await scheduleStore.tnc();
  }

  return { isTnC, tnc, TnCModal, tncInit };
}

export const useScrollIndicator = () => {
  const passengersWrapper = ref(null);
  const isScrollMax = ref(false);
  const scrollPassengersWrapper = () => {
    isScrollMax.value = passengersWrapper.value.scrollTop + passengersWrapper.value.clientHeight >= passengersWrapper.value.scrollHeight - 5;
  }
  const scrollBottom = () => {
    passengersWrapper.value.scrollTop += 25;
  }

  return { passengersWrapper, isScrollMax, scrollPassengersWrapper, scrollBottom };
}
