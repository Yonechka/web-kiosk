<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useScheduleStore } from '@/store/ScheduleStore';
import {
  usePaymentCancelCountDown,
  useCheckPayment,
  useChangePayment
} from '@/composeable/payment';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useScrollIndicator from '@/composeable/useScrollIndicator.js';

import Button from '@/components/v2/Common/Button.vue';
import Qris from '@/components/v2/Payment/Qris.vue';
import VirtualAccount from '@/components/v2/Payment/VirtualAccount/VirtualAccount.vue';
import ShrinkCardOverlay from '@/components/v2/ShrinkCardOverlay.vue';
import ModalDialogue from '@/components/v2/ModalDialogue.vue';


const scheduleStore = useScheduleStore();
const {
  bookingInfo,
} = storeToRefs(scheduleStore);

const router = useRouter();
const props = defineProps({ tripDetail: Object });
const emits = defineEmits(['onClickFormCardShrink', 'onClickHowToPay', 'onClickEDC']);

/* i18N */
const { t } = useI18n({ useScope: 'global' });


/* Check Payment */
const { checkPaymentStatus } = useCheckPayment(router, t);

/* Payment Cancel Countdown */
const {
  minutesFormat,
  secondFormat,
  startCancelCountdown
} = usePaymentCancelCountDown(router, t);
startCancelCountdown();



/* Check Payment Status */
const howToPay = () => emits('onClickHowToPay');

/* Select Payment Method Handler */
const EDC = 'edc';
const VIRTUAL_ACCOUNT = 'va';
const QRIS = 'qris';

const showBtnChangePayment = ref(true);
const activePaymentMethod = ref(QRIS);
const showPaymentMethod = (payment) =>  payment === activePaymentMethod.value;


/* Departure Code Local Storage */
const departureCodeLS = localStorage.getItem('departureCode');

/* Shrinkcard Handler */
const { el, isScrollable } = useScrollIndicator();
const onClickFormCardShrink = () => {
  emits('onClickFormCardShrink');
}

/* EDC handler */
const onClickEDC = () => {
  attemptedPaymentMethod.value = EDC;
  isModalDialogueShow.value = true;
}

const onClickConfirmEDC = () => {
  emits('onClickEDC');
}


/* Modal Dialogue */
const isModalDialogueShow = ref(false);
const attemptedPaymentMethod = ref(null);
const modalDialogueProps = computed(() => {
  return {
    paymentMethodLabel: attemptedPaymentMethod.value == QRIS ? 'QRIS' : 'EDC',
    function: () => attemptedPaymentMethod.value == QRIS ? onClickConfirmQris() : onClickConfirmEDC()
  }
});

/* To Qris Handler */
const { changePayment } = useChangePayment();
const onClickQris = () => {
  attemptedPaymentMethod.value = QRIS;
  isModalDialogueShow.value  = true;
}
async function onClickConfirmQris() {
  const result = await changePayment('qrissp');
  if (!result) return;
  scheduleStore.selectedVirtualAccount = null;
  activePaymentMethod.value = QRIS;
}

</script>

<template>
  <div ref="el" class=" w-full overflow-hidden rounded-[35px] relative">
    <!-- <Transition>
      <ShrinkCardOverlay @click="onClickFormCardShrink" v-show="isScrollable" />
    </Transition> -->
    <div class="p-8 overflow-y-auto h-full rounded-[35px] flex flex-col gap-8 items-center border-2 bg-white">
      <!-- Countdown -->
      <div class=" flex justify-between items-center w-full">
        <span class="text-[#1F2937] font-semibold text-2xl">{{ $t('payment.waitingPayment') }}</span>
        <div class=" text-sm text-[#71747D]  flex items-center gap-2">
          {{ $t('payment.remainingTime') }}
          <div class=" px-3 py-1 flex items-center gap-2 bg-[#EB2C27] rounded-full font-semibold text-white text-lg w-[100px]">
            <img src="@/assets/images/payment/ic-clock.svg" alt="ic-clock">
            {{ minutesFormat }}:{{ secondFormat }}
          </div>
        </div>
      </div>

      <!-- Booking Code -->
      <div class=" flex justify-between w-full">
        <span class=" text-[#71747D] font-medium text-xl">
          {{ $t('payment.bookingCode') }} :
        </span>

        <span
          id="bookingCode"
          :data-booking-code="bookingInfo.booking_code"
          class=" font-semibold text-[#1F2937] text-xl"
        >
          {{ bookingInfo.booking_code }}
        </span>
      </div>

      <!-- Guide -->
      <Qris v-show="showPaymentMethod(QRIS)" />
      <VirtualAccount
        v-show="showPaymentMethod(VIRTUAL_ACCOUNT)"
        @onClickVaHandler="showBtnChangePayment = false"
        @onClickChangeVaHandler="showBtnChangePayment = true"
      />

      
      <div class=" w-full flex flex-col gap-8 items-center" v-show="showBtnChangePayment" >
        <!-- Label Select Other Payment -->
        <div class=" text-[#71747D]">
          Pilih Metode Pembayaran Lainnya
        </div>

        <!-- Button Change Payment -->
        <div class=" flex gap-6 justify-center">
          <img v-show="features.isVirtualAccount && activePaymentMethod !== VIRTUAL_ACCOUNT" @click="activePaymentMethod = VIRTUAL_ACCOUNT" src="@/assets/images/button-va.png" class=" cursor-pointer" alt="button-va">
          <img
            v-show="activePaymentMethod !== QRIS"
            @click="onClickQris"
            src="@/assets/images/button-qris.png"
            class=" cursor-pointer" alt="button-va"
          >
          <img
            v-show="features.edc.includes(departureCodeLS)"
            @click="onClickEDC"
            src="@/assets/images/button-edc.png"
            class=" cursor-pointer" alt="button-edc"
          >
        </div>
      </div>


    </div>

    <Teleport to=".appWrapper">
      <Transition>
        <ModalDialogue
          v-if="isModalDialogueShow"
          @onClickCancel="isModalDialogueShow = false"
          @onClickConfirm="() => {
            isModalDialogueShow = false;
            modalDialogueProps.function()
          }"
        >
          <template #content>
            Ubah metode pembayaran ke <span class=" font-bold text-[#1F2937] text-lg">{{ modalDialogueProps.paymentMethodLabel }}</span>?
          </template>
        </ModalDialogue>
      </Transition>
    </Teleport>
  </div>
</template>