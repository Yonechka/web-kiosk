<script setup>
import { useScheduleStore } from '@/store/ScheduleStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCheckPayment, usePaymentInitialData, useToast } from '@/composeable/payment';
import ToastCustom from '@/components/daytrans/ToastCustom.vue';
import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';
import ModalOverlay from '@/components/v2/ModalOverlay.vue';

const scheduleStore = useScheduleStore();
const router = useRouter();
const { t } = useI18n({ useScope: 'global' });

/* Toast */
const {
  showToast,
  toastTitle,
  toastMessage,
  toastConfig
} = useToast();

/* Initital Data */  
const { showSpinner } = usePaymentInitialData();

/* Check Payment Statys */
const { checkPaymentStatus } = useCheckPayment(router, t);

/* Hot to pay modal */
const showModalHowToPay = ref(false);
</script>

<template>
  
  <div class=" py-6 flex flex-col gap-8 items-center">
    <teleport to='.appWrapper'>
      <transition>
        <ToastCustom
          type="failed"
          :title="toastTitle"
          :message="toastMessage"
          @closeToast="showToast = false"
          v-if="showToast"
        />
      </transition>
    </teleport>
    <OverlaySpinner bg="bg-[#00000060]" v-if="showSpinner"/>
    <div>
      <div class=" font-medium text-base text-[#1F2937] leading-6 mb-3 text-center">
        Scan <b>QRIS</b>  di bawah <br> 
        untuk melakukan pembayaran
      </div>
      <!-- CTA how to pay -->
      <div
        @click="showModalHowToPay = true"
        class=" py-3 px-4 bg rounded-2xl font-medium text-base text-center"
        :class="[`bg-[${colors.primaryColor20}]`, `text-[${colors.primaryColor200}]`]"
      >
        Cara Pembayaran
      </div>
    </div>

    <img class=" w-28" :src="scheduleStore.bookingInfo?.payment_status?.client_data?.qr_url" alt="qr">
    <img src="@/assets/images/payment-list-new.png" alt="payment-list">
    <div
      @click="checkPaymentStatus"
      class=" py-3 px-4 rounded-2xl font-medium text-base text-center"
      :class="[`bg-[${colors.primaryColor20}]`, `text-[${colors.primaryColor200}]`]"
    >
      Cek Status Bayar
    </div>

    <!-- Modal How To Pay -->
    <teleport to='.appWrapper'>
      <Transition>
        <ModalOverlay
          v-show="showModalHowToPay"
          @on-click-close-modal-handler="showModalHowToPay = false"
        >
          <img src="@/assets/images/hot-to-pay.png" alt="how-to-pay">
          
        </ModalOverlay>
      </Transition>
    </teleport>
  </div>
</template>