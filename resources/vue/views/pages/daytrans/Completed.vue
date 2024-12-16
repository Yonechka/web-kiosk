<script setup>
  import { ref, reactive, computed, watch, onUnmounted, onMounted } from 'vue';
  import { formattingDateYMD, formattingDateHuman } from '../../../utils';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { storeToRefs } from 'pinia';
  import { useRouter, onBeforeRouteLeave } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import {
    useCompletedInitialData,
    useToast,
    useNameKeyboardType,
    useEmailKeyboardType,
    usePassengersKeyboardType,
    useCheckRegisteredUser,
    useFormValidate,
    usePrintTicket,
    useCustomerNameAsPassenger,
    useOnUnmountedHook
  } from '../../../composeable/completed';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  
  import TripInformation from '../../../components/daytrans/TripInformation.vue';
  import OverlaySpinner from '../../../components/daytrans/OverlaySpinner.vue';
  import ToastCustom from '../../../components/daytrans/ToastCustom.vue';
  import LetterKeyboard from '../../../components/daytrans/completed/LetterKeyboard.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';


  const scheduleStore = useScheduleStore();
  const {
    selectedDeparturePool,
    selectedDestinationPool,
    selectedDepartureTime,
    departureDate,
    departureTime,
    totalTicketPrice,
    selectedSeats,
    bookingInfo,
    customerInfo,
    updateBookingSeats,
    registeredCustomer,
  } = storeToRefs(scheduleStore);

  const router = useRouter();
  const { t, locale } = useI18n();

  /* Initial Data */
  const { showSpinner } = useCompletedInitialData();
  // const showSpinner = ref(false);

  /* Toast */
  const { showToast, showToastEmptyForm } = useToast();

  /* Customer Field  */
  const {
    isNameField,
    name,
    showNameField,
    updateNameValue,
    closeNameKeyboard,
  } = useNameKeyboardType();

  /* Email Field */
  const {
    isEmailField,
    email,
    showEmailField,
    updateEmailValue,
    closeEmailKeyboard
  } = useEmailKeyboardType();

  /* Passenger Field */
  const { 
    /* Passenger Name */
    passengers, showPassangerField, updatePassengerValue, closePassangerKeyboard,
   } = usePassengersKeyboardType();

  
  /* Check Registered User */
  const { checkRegisteredUser } = useCheckRegisteredUser();
  checkRegisteredUser();
  
  /* Form Validating */
  const { invalidSubmit, invalidForm, isFieldEmpty } = useFormValidate(t);

  /* Print Ticket */
  const { printTicket, showToastEmpty } = usePrintTicket(router, t);

  /* Customer Name As Passenger */
  const { customerNameAsPassenger } = useCustomerNameAsPassenger(t);

  watch(locale, () => {
    if (
      name.value == 'Masukkan Nama' ||
      name.value == 'Enter Your Name'
    ) {
      name.value = t('completed.customerNamePlaceHolder');
    }

    if (
      email.value == 'Masukkan Email' ||
      email.value == 'Enter Your Email'
    ) {
      email.value = t('completed.customerEmailPlaceHolder');
    }

    passengers.forEach(passenger => {
      if (
        passenger.name == 'Nama Penumpang' ||
        passenger.name == 'Enter Passenger Name'
      ) {
        passenger.name = t('completed.passengerNamePlaceHolder')
      }
    });

    invalidForm.customerName.message = t('completed.invalidForm.customerName');
    invalidForm.passengersName.forEach(item => item.message = t('completed.invalidForm.passengerName'));
    invalidForm.infantsName.forEach(item => item.message = t('completed.invalidForm.infantName'));
    invalidForm.infantsBirthDate.forEach(item => item.message = t('completed.invalidForm.infantBirthDate'));
  });

  onMounted(() => {
    name.value = scheduleStore?.registeredCustomer?.name ?? t('completed.customerNamePlaceHolder');
    email.value = scheduleStore?.registeredCustomer?.email ?? t('completed.customerEmailPlaceHolder');
    passengers.forEach((passenger, index) => {
      passenger.name = scheduleStore?.registeredCustomer?.name ?? t('completed.passengerNamePlaceHolder');
    });
  });

  onUnmounted(() => {
    const { resetGlobalState } = useOnUnmountedHook();
    resetGlobalState();
  });
</script>

<template>
    <teleport to='.appWrapper'>
      <transition>
        <ToastCustom
          type="failed"
          title="Gagal Update Booking, Silahkan Coba Lagi!"
          @closeToast="showToast = false"
          v-if="showToast"
        />
      </transition>
    </teleport>

    <teleport to='.appWrapper'>
      <transition>
        <ToastCustom
          type="failed"
          :title="$t('completed.toastInvalidForm')"
          @closeToast="showToastEmptyForm = false"
          v-if="showToastEmptyForm"
        />
      </transition>
    </teleport>
    <OverlaySpinner bg="bg-[#00000060]" v-show="showSpinner"/>
    <TripInformation />
    <div class="overflow-y-hidden rounded-[35px] mt-[24px]">
      <div class="rounded-[35px] w-full h-[1017px] overflow-y-auto pb-[40px]" :class="`bg-[${colors.secondaryColor}]`">
        <div class="pl-[34px] border-1" :class="`border-[${colors.secondaryColor200}]`">
            <div class="pt-[33px] font-medium text-[36px]" :class="`text-[${colors.fontPrimaryColor}]`">
              {{ $t('completed.fillForm') }}
            </div>
        </div>

        <!-- Input No Telephone -->
        <div class="pl-[40px] pt-[50px] pr-8">
            <label class="font-medium text-2xl" :class="`text-[${colors.fontPrimaryColor}]`">
              {{ $t('completed.phoneNo') }}
            </label>
            <input
              readonly
              type="text"
              v-model="customerInfo.PhoneNo"
              id="name"
              class="w-full outline-0 border mt-[10px] font-medium rounded-[11px] pl-[32px] pr-[55.06px] py-[20px] text-[30px]"
              :class="`border-[${colors.secondaryColor200}] placeholder-[${colors.secondaryColor200}] text-[${colors.secondaryColor200}]`"
              placeholder="0851315564"
            >
        </div>

        <!-- Input Name -->
        <div class="pl-[40px] pt-[40px] pr-8">
            <label class="font-medium text-2xl text[#000000]">
              {{ $t('completed.customerName') }}
            </label>
            <div class="flex justify-between flex-col pt-[10px] relative">
                <div class="relative w-full" @click="showNameField">
                    <div
                      type="email"
                      id="name"
                      class="w-full border overflow-hidden font-medium  rounded-[11px] px-[32px] py-[20px] text-[30px]"
                      :class="`border-[${colors.secondaryColor200}] placeholder-[${colors.fontSecondaryColor}]`"
                    >
                      <div :class="[name == $t('completed.customerNamePlaceHolder') ? `text-[${colors.fontSecondaryColor300}]` : `text-[${colors.fontPrimaryColor}]`]" class="overflow-hidden w-[95%]">
                        {{ name }}
                      </div>
                    </div>
                    <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                        <img src="../../../assets/images/completed/right.png">
                    </span>
                </div>
                <div class="flex items-center mt-[10px]">
                  <input
                    @keydown.prevent=""
                    :disabled="name == t('completed.customerNamePlaceHolder')"
                    type="checkbox"
                    id="customerNameAsPassenger"
                    class="mr-[10px] h-[28px] w-[28px]" 
                    v-model="customerNameAsPassenger"
                  >
                  <label class="text-[24px] font-medium mt-[3px]" for="customerNameAsPassenger">
                    {{ $t('completed.customerIsPassenger') }}
                  </label>
                </div>
                <span class="text-[red] text-[21px] font-semibold absolute bottom-[-30px]" v-if="invalidSubmit && invalidForm.customerName.isInvalid">
                  {{ invalidForm.customerName.message }}
                </span>
            </div>
        </div>

        <!-- Input Email Pemesanan -->
        <div class="pl-[40px] pt-[40px] pr-8">
            <label class="font-medium text-2xl text[#000000]">{{ $t('completed.customerEmail') }}</label>
            <div class="flex justify-between items-center pt-[10px] relative">
                <div class="relative w-full" @click="showEmailField">
                    <div
                      type="email"
                      id="name"
                      class="w-full border overflow-hidden font-medium rounded-[11px] px-[32px] py-[20px] text-[30px]"
                      :class="`border-[${colors.secondaryColor200}]`"
                    >
                      <div
                        :class="[email ==  t('completed.customerEmailPlaceHolder') ? `text-[${colors.fontSecondaryColor300}]` : `text-[${colors.fontPrimaryColor}]`]"
                        class="w-[95%] overflow-hidden"
                      >
                        {{ email }}
                      </div>
                    </div>
                    <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                        <img src="../../../assets/images/completed/right.png" alt="" class="">
                    </span>
                </div>
                <!-- <span class="text-[red] text-[21px] font-semibold absolute bottom-[-30px]" v-if="invalidSubmit && invalidForm.customerEmail.isInvalid">
                  {{ invalidForm.customerEmail.message }}
                </span> -->
            </div>
        </div>

        <div class="pl-[40px] pt-[70px] pr-8">
            <div class="font-semibold text-[40px] pb-[30px]">
              {{ $t('completed.passengers') }}
            </div>
            <div v-for="(passenger, index) in passengers" :key="passenger.ticket" class="mb-[30px]">
              <label class="font-medium text-2xl pb-[10px]" :class="`text-[${colors.fontPrimaryColor}]`">
                {{ $t('completed.seat') }} {{ passenger.seat_no }}
              </label>
              <div class="relative" @click="showPassangerField(index)">
                <div
                  type="email"
                  id="name"
                  class="w-full overflow-hidden border font-medium rounded-[11px] px-[32px] py-[20px] text-[30px]"
                  :class="`border-[${colors.secondaryColor200}]  placeholder-[${colors.fontPrimaryColor}]`"
                >
                  <div
                    :class="[passenger.name ==  t('completed.passengerNamePlaceHolder') ? `text-[${colors.fontSecondaryColor300}]` : `text-[${colors.fontPrimaryColor}]`]"
                    class="w-[95%] overflow-hidden"
                  >
                    {{ passenger.name }}
                  </div>
                </div>
                <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                    <img src="../../../assets/images/completed/right.png" alt="" class="">
                </span>
                <span class="text-[red] text-[21px] font-semibold" v-if="invalidSubmit && invalidForm.passengersName[index].isInvalid">
                  {{ invalidForm.passengersName[index].message }}
                </span>
              </div>


            </div>
        </div>

        <!-- Next -->
        
      </div>
    </div>
    <div v-if="!isFieldEmpty" class="flex w-full justify-center px-[23px] pb-[30px] mt-[65px] ">
        <div
          @click="printTicket"
          class="flex items-center justify-center py-[41px] w-full rounded-[26px]"
          :class="`bg-[${colors.accentSecondaryColor}]`"
        >
            <div class="font-bold text-4xl" :class="`text-[${colors.secondaryColor}]`">
              {{ $t('completed.printTicket') }}
            </div>
            <img src="../../../assets/images/completed/next.png " class="pl-[16.25px]">
        </div>
    </div>
    <div v-else class="flex w-full justify-center px-[23px] pb-[30px] mt-[65px]">
        <div
          @click="showToastEmpty"
          class="flex items-center justify-center py-[41px] w-full rounded-[26px]"
          :class="`bg-[${colors.secondaryColor200}]`"
        >
            <div class="font-bold text-4xl" :class="`text-[${colors.secondaryColor}]`">
              {{ $t('completed.printTicket') }}
            </div>
            <img src="../../../assets/images/completed/next.png " class="pl-[16.25px]">
        </div>
    </div>
    <LetterKeyboard
      :placeholderValue="$t('completed.customerNamePlaceHolder')"
      :value="name == $t('completed.customerNamePlaceHolder') ? null : name"
      :validation="{ type: 'name', validate: true }"
      :isShow="isNameField"
      :disable-special-char="true"
      @updatingValue="updateNameValue"
      @closeKeyboard="closeNameKeyboard"
    />
    <LetterKeyboard
      :value="email == $t('completed.customerEmailPlaceHolder') ? null : email"
      :placeholderValue="$t('completed.customerEmailPlaceHolder')"
      :validation="{ type: 'email', validate: true }"
      :isShow="isEmailField"
      @updatingValue="updateEmailValue"
      @closeKeyboard="closeEmailKeyboard"
    />
    <LetterKeyboard
      v-for="(passenger, index) in passengers" :key="passenger.seat_no"
      :validation="{ type: 'name', validate: true }"
      :value="passenger.name == $t('completed.passengerNamePlaceHolder') ? null : passenger.name"
      :isShow="passenger.isShow"
      :placeholderValue="$t('completed.passengerNamePlaceHolder')"
      :disable-special-char="true"
      @updatingValue="updatePassengerValue(index, $event)"
      @closeKeyboard="closePassangerKeyboard(index)"
    />
</template>

<style scoped>
  :root {
    /* --dp-menu-min-width: 692px; */
    --dp-cell-size: 70px;
  }

  .dp__menu {
    border: 0;
    min-width: 100% !important;
  }

  .dp__month_year_row {
    justify-content: center;
    margin-bottom: 15px;
  }

  .dp__month_year_wrap {
    width: 230px;
  }

  .dp__calendar_header {
    justify-content: space-around;
  }

  .dp__calendar_header_separator {
    height: 0;
  }

  .dp__calendar_header_item {
    font-size: 30px;
    flex-grow: 0;
    width: 80px;
    height: auto;
    padding: 10px 0px 10px 0px;
  }

  .dp__calendar_item {
    flex-grow: 0;
  }

  .dp__calendar_row {
    justify-content: space-around;
  }

  .dp__cell_inner {
    padding: 0;
    border: 2px solid v-bind('colors.secondaryColor200');
    border-radius: 12px;
    margin: 0px 0px 20px 0px;
    font-size: 28px;
    font-weight: bold;
    width: 70px !important;
    height: 70px !important;
  }

  .dp__month_year_select {
    font-size: 32px;
    font-weight: bold;
  }
</style>