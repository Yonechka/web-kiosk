import { ref, reactive, computed, watch } from 'vue';
import { useScheduleStore } from '../store/ScheduleStore';
import { formattingDateYMD, formattingDateHuman } from '../utils';
//const scheduleStore = useScheduleStore();

/* Initial Data */
const showSpinner = ref(false);
export const useCompletedInitialData = () => {
  return { showSpinner };
}

/* Toast */
const showToast = ref(false);
const showToastEmptyForm = ref(false);
export const useToast = () => {
  return { showToast, showToastEmptyForm };
}

/* Keyboard Type */
const name = ref('Masukkan Nama');
export const useNameKeyboardType = () => { /* Name Field */
  let isNameField = ref(false);
  
  const showNameField = () => isNameField.value = true;
  const updateNameValue = (newValue) => {
    name.value = newValue;
    isNameField.value = false;
  };
  const closeNameKeyboard = () => isNameField.value = false;

  

  return {
    isNameField,
    name,
    showNameField,
    updateNameValue,
    closeNameKeyboard,
  };
}

const email = ref('Masukkan Email');
export const useEmailKeyboardType = () => { /* Email Field */
  let isEmailField = ref(false);

  const showEmailField = () => isEmailField.value = true;
  const updateEmailValue = (newValue) => {
    email.value = newValue;
    isEmailField.value = false;
  };
  const closeEmailKeyboard = () => isEmailField.value = false;

  return {
    isEmailField,
    email,
    showEmailField,
    updateEmailValue,
    closeEmailKeyboard
  };
}

let passengers;
let passengersReturn;
export const usePassengersKeyboardType = (d) => {  /* Passengers Field */
  const scheduleStore = useScheduleStore();

  /* Passenger Name */ 
  passengers = reactive(scheduleStore.updateBookingSeats);
  const showPassangerField = (index) => passengers[index].isShow = true;
  const updatePassengerValue = (index, $event) => {
    passengers[index].name = $event;
    passengers[index].isShow = false;
  };
  const closePassangerKeyboard = (index) => passengers[index].isShow = false;

  /* Passenger Name Return */
  passengersReturn = reactive(scheduleStore.updateBookingSeatsReturn);
  const showPassangerFieldReturn = (index) => passengersReturn[index].isShow = true;
  const updatePassengerValueReturn = (index, $event) => {
    passengersReturn[index].name = $event;
    passengersReturn[index].isShow = false;
  };
  const closePassangerKeyboardReturn = (index) => passengersReturn[index].isShow = false;

  /* Passenger Infant */
    //Min Date Birth Date Infant
  const reducedYears = ref(new Date());
  reducedYears.value.setFullYear(new Date().getFullYear() - 2);

    // Name
  const showPassengerInfantNameField = (index) => passengers[index].infant.isShowName = true;
  const updatePassengerInfantNameValue = (index, $event) => {
    passengers[index].infant.name = $event;
    passengers[index].infant.isShowName = false;
  };
  const closePassengerInfantNameKeyboard = (index) => passengers[index].infant.isShowName = false;

    // Birth Date
  const showPassengerInfantBirthDateField = (index) => passengers[index].infant.isShowBirthDate = true;
  const updatePassengerInfantBirthDateValue = (index, $event) => {
    passengers[index].infant.birthDate = formattingDateYMD($event);
    passengers[index].infant.birthDateFormatted = d($event, 'short');
    passengers[index].infant.isShowBirthDate = false;
  } 

  return {
    /* Passenger Name */
    passengers, showPassangerField, updatePassengerValue, closePassangerKeyboard,

    /* Passenger Name Return */
    passengersReturn, showPassangerFieldReturn, updatePassengerValueReturn, closePassangerKeyboardReturn,

    /* Passenger Infant */
    reducedYears, showPassengerInfantNameField, updatePassengerInfantNameValue, closePassengerInfantNameKeyboard,
    showPassengerInfantBirthDateField, updatePassengerInfantBirthDateValue
  }
}

/* Check Registered User */
export const useCheckRegisteredUser = () => {
  const scheduleStore = useScheduleStore();

  /* Check Registered User */
  const checkRegisteredUser = () => {
    if (scheduleStore.registeredCustomer !== null) {
      console.log('this is registered customer', scheduleStore.registeredCustomer);
      name.value = scheduleStore.registeredCustomer.name;
      if (scheduleStore.registeredCustomer.email) {
        email.value = scheduleStore.registeredCustomer.email;
      }
    }
  }

  return { checkRegisteredUser };
}

/* Form Validation */
let invalidSubmit = ref(false); // When user trying to click Print Ticket with invalid form
let invalidForm = reactive({
  customerName: {
    isInvalid: true,
    message: 'Form Nama Tidak Boleh Kosong!'
  },
  passengersName: [],
  infantsName: [],
  infantsBirthDate: [],

  /* Return Passengers */
  passengersNameReturn: [],
  infantsNameReturn: [],
  infantsBirthDateReturn: [],
});
export const useFormValidate = (t) => {
  const scheduleStore = useScheduleStore()
  invalidForm.customerName.message = t('completed.invalidForm.customerName');
  watch([name], () => {
    invalidForm.customerName.isInvalid = name.value == 'Masukkan Nama' || name.value == 'Enter Your Name';
  }, { immediate: true });
  
  passengers.forEach((item, index) => {
    invalidForm.passengersName.push({
      isInvalid: true,
      message: t('completed.invalidForm.passengerName')
    });

    invalidForm.infantsName.push({
      isInvalid: true,
      message: t('completed.invalidForm.infantName')
    });

    invalidForm.infantsBirthDate.push({
      isInvalid: true,
      message: t('completed.invalidForm.infantBirthDate')
    });

    watch([() => item.name, () => item.infant.name, () => item.infant.birthDateFormatted ], () => {
      invalidForm.passengersName[index].isInvalid = item.name == t('completed.passengerNamePlaceHolder');
      invalidForm.infantsName[index].isInvalid = item.infant.name == t('completed.infantNamePlaceHolder');
      invalidForm.infantsBirthDate[index].isInvalid = item.infant.birthDateFormatted == t('completed.infantBirthDatePlaceHolder');
    }, { immediate: true });
  });

  if (scheduleStore.isRoundedTrip) {
    passengersReturn.forEach((item, index) => {
      invalidForm.passengersNameReturn.push({
        isInvalid: true,
        message: t('completed.invalidForm.passengerName')
      });

      invalidForm.infantsNameReturn.push({
        isInvalid: true,
        message: t('completed.invalidForm.infantName')
      });

      invalidForm.infantsBirthDateReturn.push({
        isInvalid: true,
        message: t('completed.invalidForm.infantBirthDate')
      });

      watch([() => item.name, () => item.infant.name, () => item.infant.birthDateFormatted ], () => {
        invalidForm.passengersNameReturn[index].isInvalid = item.name == t('completed.passengerNamePlaceHolder');
        invalidForm.infantsNameReturn[index].isInvalid = item.infant.name == t('completed.infantNamePlaceHolder');
        invalidForm.infantsBirthDateReturn[index].isInvalid = item.infant.birthDateFormatted == t('completed.infantBirthDatePlaceHolder');
      }, { immediate: true });
    });
  }


  
  const isFieldEmpty = computed(() => {
    if (name.value == t('completed.customerNamePlaceHolder')) return true

    let passengerName = passengers.some(item => item.name == t('completed.passengerNamePlaceHolder'));
    if (passengerName) {
      return true;
    }

    if (scheduleStore.isRoundedTrip) {
      let passengerNameReturn = passengersReturn.some(item => item.name == t('completed.passengerNamePlaceHolder'));
      if (passengerNameReturn) {
        return true;
      }
    }

    const isInfant = passengers.some(item => item.isInfant === true);
    if (!isInfant) {
      return false;
    } else {
      const name = passengers.some(item => {
        if (item.isInfant) {
          return item.infant.name == t('completed.infantNamePlaceHolder');
        }
        return false;
      });
      
      const birth = passengers.some(item => {
        if (item.isInfant) {
          return item.infant.birthDateFormatted == t('completed.infantBirthDatePlaceHolder')
        }
        return false;
      });

      return name || birth;
    }
  });

  return  {
    invalidSubmit,
    invalidForm,
    isFieldEmpty
  };
}

/* Print Ticket */
export const usePrintTicket = (router, t) => {
  const scheduleStore = useScheduleStore();
  const printTicket = async () => {
    try {
      let passengersName = {
        list_infant: ''
      };
      passengers.forEach(item => {
        const noTicket = item.ticket;
        const name = item.name;
        passengersName[noTicket] = name;

        if (item.isInfant) {
          passengersName.list_infant += `${item.ticket}|${item.infant.name}@${item.infant.birthDate};`
        }
      });
      const data = {
        booking_code: scheduleStore.bookingInfo.booking_code,
        customer_name: name.value,
        customer_email: email.value == t('completed.customerEmailPlaceHolder') ? 'info@tiketux.com' : email.value,
        passengers_name: passengersName
      }

      if (scheduleStore.isRoundedTrip) {
        let passengersNameReturn = {
          list_infant: ''
        };
        passengersReturn.forEach(item => {
          const noTicket = item.ticket;
          const name = item.name;
          passengersNameReturn[noTicket] = name;
  
          if (item.isInfant) {
            passengersNameReturn.list_infant += `${item.ticket}|${item.infant.name}@${item.infant.birthDate};`
          }
        });

        data.passengers_name = {  ...data.passengers_name, ...passengersNameReturn }
      }
      
      scheduleStore.customerInfo.name = name.value;
      scheduleStore.customerInfo.email = email.value;
      showSpinner.value = true;
      const update = await scheduleStore.updateBooking(data);
      showSpinner.value = false;
      if (update.success) {
        router.push({ name: 'thanks' });
      } else {
        showToast.value = true;
      }
    } catch (error) {
      showSpinner.value = false;
      showToast.value = true;
    }
  }

  const showToastEmpty = () => {
    invalidSubmit.value = true;
    showToastEmptyForm.value = true;
  }

  return { printTicket, showToastEmpty };
}

/* Customer Name As Passenger */
export const useCustomerNameAsPassenger = (t) => {
  const customerNameAsPassenger = ref(false);
  watch([customerNameAsPassenger], () => {
    if (customerNameAsPassenger.value) {
      passengers[0].name = name.value;
      passengers[0].isShow = true;
      passengers[0].isShow = false;
    } else {
      passengers[0].name = t('completed.passengerNamePlaceHolder');
    }
  }, { immediate: true });

  return { customerNameAsPassenger };
}

/* unMounted Hook */
export const useOnUnmountedHook = () => {
  const resetGlobalState = () => {
    /* Toast */
    showToast.value = false;
    showToastEmptyForm.value = false;

    /* Keyboard Type */
    name.value = 'Masukkan Nama';
    email.value = 'Masukkan Email';

    /* Form Validation */
    invalidSubmit.value = false; // When user trying to click Print Ticket with invalid form
    invalidForm = reactive({
      customerName: {
        isInvalid: true,
        message: 'Form Nama Tidak Boleh Kosong!'
      },
      passengersName: [],
      infantsName: [],
      infantsBirthDate: [],

      /* Return Passengers */
      passengersNameReturn: [],
      infantsNameReturn: [],
      infantsBirthDateReturn: [],
    });
  }

  return { resetGlobalState };
}