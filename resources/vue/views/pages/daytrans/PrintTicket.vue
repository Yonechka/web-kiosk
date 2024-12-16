<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'; 
import { usePrintTicket } from '../../../composeable/thanks.js';
import { useScheduleStore } from '../../../store/ScheduleStore.js';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import {
  usePrintInitialData,
  useToast,
  useEventInput,
} from '@/composeable/directPrintTicket';

import OutletLocation from '@/components/daytrans/OutletLocation.vue';
import LanguageSelector from '@/components/LanguageSelector.vue';
import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';
import ToastCustom from '../../../components/daytrans/ToastCustom.vue';
import PrintTicketInfo from '@/components/daytrans/PrintTicketInfo.vue';

const scheduleStore = useScheduleStore();
const router = useRouter();

const { t, d, locale } = useI18n({ useScope: 'global' });
const { printTicket: printTicketCompose } = usePrintTicket(toast, t, d, true);

/* Initial Data */
const {
  input: inputElement, bookingCode, isFetching, isModal,
  isPrintCompleted, isSpinner, printTicketData
} = usePrintInitialData();

/* Toast Custom */
const {
  showToast, toastTitle, toastMessage, toastConfig
} = useToast();

/* Event Boarding */
const { focus, debouncePrint } = useEventInput(t);
watch(bookingCode, (newValue, oldValue) => {
  debouncePrint();
});

/* Print Ticket Handler */
const printTicket = async () => {
  scheduleStore.otpNewAsmat = printTicketData.value.otp;
  scheduleStore.bookingInfo.booking_code = printTicketData.value.booking_code;
  isSpinner.value = true;
  try {
    const success = await printTicketCompose();  
    if (success) {
      await scheduleStore.getDetailBooking();
      router.push({ name: 'thanks', query: { isDirectPrint: true } });
    } else {
      console.log('print fail')
    }
  } catch (error) {
    console.log(error);
  }
  isFetching.value = false;
  bookingCode.value = null;
  isModal.value = false;
  isSpinner.value = false;
  printTicketData.value = null;
};

const cancelPrintTicket = async () => {
  bookingCode.value = null;
  isModal.value = false;
  isFetching.value = false;
  focus();
};

/* Back CTA button */
const backCTA = () => {
  scheduleStore.otpNewAsmat = '';
  scheduleStore.bookingInfo.booking_code = '';
  router.back();
};

onMounted(() => {
  inputElement.value.focus();
});
</script>

<template>
  <Teleport to=".appWrapper">
    <transition>
      <ToastCustom
        type="failed"
        :title="toastTitle"
        :message="toastMessage"
        @closeToast="showToast = false"
        v-if="showToast"
      />
    </transition>
  </Teleport>
  <Teleport to=".appWrapper">
    <input type="text" ref="inputElement" @blur="focus" v-model="bookingCode" class=" absolute top-0 right-0 z-[99] opacity-0">
    <LanguageSelector dynamicClass="rounded-[30px] z-10 py-6 px-8 text-[32px] absolute top-[80px] right-[80px]" />

    <!-- Initial Screen -->
    <div class="w-full h-full absolute pt-[240px]" :class="`bg-[${colors.primaryColor}]`">
    <OverlaySpinner v-if="isSpinner" :spinnerColor="colors.primaryColor" bg="bg-[#00000065]" />
      <div class=" flex justify-center items-center flex-col">
        <img :src="images.logoSecondary" class="mx-auto w-[377px] mb-6">
        

        <h1 class=" text-[64px] font-bold mx-auto text-white mt-16">{{ $t('directPrintTicket.printTicket') }}</h1>

        <img src="../../../assets//images/print_ticket_illustration.png" class=" mt-[170px] w-[500px]" alt="print_ticket_illustration">

        <p class=" text-white text-3xl font-semibold text-center w-[600px] mt-16 mb-16 leading-[45px]">
          {{ $t('directPrintTicket.findTicket') }}
        </p>

        <!-- <OutletLocation/> -->
      </div>
      <div class="flex justify-between items-center absolute bottom-0 pr-[56px]">
          <div class="pr-[413px] flex  items-center text-center">
              <div @click="backCTA" class="flex justify-center pr-[71px] py-[30px] w-full rounded-r-[100px] bg-[#F18C33]">
                  <img src="../../../assets/images/leftArrowWhite.png" class="pl-[30px]">
                  <div
                    class="font-semibold ml-[20px] text-[48px]"
                    :class="`text-[${colors.secondaryColor}]`"
                  >
                    {{ $t('boarding.back') }}
                  </div>
              </div>
          </div>
          <div class=" justify-center rounded-t-[100px]" :class="`bg-[${colors.secondaryColor}]`">
              <img src="../../../assets/images/arrow-bottom-orange.png" class="px-[46px] py-[57px]">
          </div>
      </div>
    </div>

    <!-- Detail Booking -->
    <div
      v-if="isModal"
      class="w-full h-full absolute top-0 flex flex-col items-center justify-center gap-7"
      :class="`bg-[${colors.primaryColor}]`"
    >
      <img :src="images.logoSecondary" class="w-[250px]">

      <div class="flex flex-col items-center">
        <div
          class="text-[48px] font-semibold"
          :class="`text-[${colors.secondaryColor}]`"
        >
          {{ $t('directPrintTicket.confirmAsk') }}
        </div>
        <PrintTicketInfo :data="printTicketData" />

        <div
          class="w-[534px] font-bold flex justify-between mb-[50px]"
          :class="`text-[${colors.secondaryColor}]`"
        >
          <div
            @click="cancelPrintTicket"
            class="w-[252px] cursor-pointer rounded-[25px] text-center py-[20px]"
            :class="`bg-[${colors.secondaryColor400}]`"
          >
            {{ $t('directPrintTicket.ctaNo') }}
          </div>

          <div
            @click="printTicket"
            class="w-[252px] cursor-pointer rounded-[25px] text-center  py-[20px]"
            :class="`bg-[${colors.accentSecondaryColor}]`"
          >
            {{ $t('directPrintTicket.ctaYes') }}
          </div>
        </div>

        <OutletLocation/>
      </div>
    </div>
  </Teleport>
</template>