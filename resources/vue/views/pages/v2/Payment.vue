<script setup>
import { useScheduleStore } from '../../../store/ScheduleStore';
import { storeToRefs } from 'pinia';
import { useStore } from '../../../store/Store';
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import 'vue3-toastify/dist/index.css';
import { sha256 } from 'js-sha256';
import {
  usePaymentInitialData,
  useToast,
  usePaymentCancelCountDown,
  useCheckPayment,
  useCancelBooking,
  useOnBeforeRouteLeave,
  useEDC,
  usePaymentSuccess,
  useOnUnmountedHook
} from '@/composeable/payment';

import TripDetail from '@/components/v2/TripDetail/TripDetail.vue';
import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';
import ToastCustom from '@/components/daytrans/ToastCustom.vue';
import NetworkIndicator from '@/components/NetworkIndicator.vue';
import WaitingForPayment from '@/components/v2/Payment/WaitingForPayment.vue';
import SuccessPayment from '@/components/v2/Payment/SuccessPayment.vue';
import EdcScreen from '@/components/v2/Payment/EdcScreen.vue';
import ModalOverlay from '@/components/v2/ModalOverlay.vue';

const router = useRouter();
const route = useRoute();

const store = useStore();
const scheduleStore = useScheduleStore();
/* i18N */
const { t } = useI18n({ useScope: 'global' });

/* Initital Data */  
const { showSpinner } = usePaymentInitialData();

/* Toast */
const {
  showToast,
  toastTitle,
  toastMessage,
  toastConfig
} = useToast();

/* How To Pay Modal */
const isHowToPay = ref(false);
const howToPayModal = () => isHowToPay.value = !isHowToPay.value;

/* Payment Cancel Countdown */
const {
  countDownTime,
  minutesFormat,
  secondFormat,
  intervalCancelId,
  cancelCountDown,
  startCancelCountdown
} = usePaymentCancelCountDown(router, t);

/* Payment Sucess Countdown */
const { countDownDuration, isShow, countDown, startInterval, toCompleted } = usePaymentSuccess(router);

/* Check Payment Interval */
const { checkPaymentStatus, startIntervalCheckPayment } = useCheckPayment(router, t);

/* Cancel Booking */
const { redirectToReservation, isModalCancelBooking, cancelSpinner, cancelBooking, closeModal } = useCancelBooking(router);

/* Before Leave Route validation */
onBeforeRouteLeave( async (to, from) => {
  const { init } = useOnBeforeRouteLeave(to, from, t);
  return init();
});

/* EDC */
const { isEdc, showSpinnerEdc, closeEdcModal, edcModal, isSetPaidError, retrySetPaid, modalHelpEdc } = useEDC(router, t, true) //isNewAsmat

/* Departure Code Local Storage */
const departureCodeLS = localStorage.getItem('departureCode');

/* Shrink Card Handler */
const tripDetail = ref(null);
const onClickFormCardShrinkHandler = () => {
  tripDetail.value.priceInfo.isPriceInfoExpanded = false;
  tripDetail.value.tripInfo.isTripInfoExpanded = false;
  tripDetail.value.tripInfo.isTripInfoExpandedReturn = false;
}

/* onMounted Hook */
onMounted( async () => {
  isShow.value = false;
  startIntervalCheckPayment();
});

/* onUnmounted Hook */
onUnmounted(() => {
  console.log('onUnmounted hook called');
  const { resetGlobalState } = useOnUnmountedHook();
  resetGlobalState();
});

</script>

<template>
    <div class=" w-full h-full flex flex-col gap-8">

    
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

      <TripDetail ref="tripDetail" key="1" />
      
      <WaitingForPayment
        v-show="!isShow"
        @onClickFormCardShrink="onClickFormCardShrinkHandler"
        @onClickHowToPay="howToPayModal"
        @onClickEDC="edcModal"
        
      />
      <SuccessPayment
        v-show="isShow"
        @onClickFormCardShrink="onClickFormCardShrinkHandler"
      />

      <!-- EDC Help Modal -->
      <Teleport to=".appWrapper">
        <Transition>
          <ModalOverlay
            v-show="modalHelpEdc"
            @on-click-close-modal-handler="modalHelpEdc = false"
          >
            <div class="w-[755px] h-fit text-[20px] bg-white rounded-l-[30px] pt-[60px] px-8 overflow-hidden pb-[56px] relative" >
              <!-- Content -->
              <div class=" text-[#1976D3] text-[32px] font-bold mb-10 text-center">
                Bantuan EDC
              </div>

              <div v-show="isSetPaidError" class=" w-full flex gap-3 items-center mb-10">
                <div class=" flex gap-3 items-center">
                  <img src="@/assets/images/payment/ic-bullet.svg" alt="ic-bullet">

                  <div class=" flex flex-col gap-2">
                    <div class=" font-bold text-[#1B73D2] text-2xl">
                      Pembayaran di EDC Berhasil, tapi sistem gagal?
                    </div>

                    <div class=" text-[#1B73D2] text-xl font-medium">
                      Tekan tombol di bawah ini untuk melakukan refresh pembayaran.
                    </div>

                    <button @click="retrySetPaid" class=" px-4 py-2 w-fit rounded-2xl text-white bg-[#2A3C7C]">
                      Coba Lagi
                    </button>
                  </div>
                  
                </div>
                <img src="@/assets/images/ic_failed_xl.png" class=" w-40" alt="ic_failed_xl">
              </div>

              <div class=" w-full flex gap-3 items-center mb-10">
                <img src="@/assets/images/payment/edc-problem-illustration.png" class=" w-40" alt="ic_failed_xl">

                <div class=" flex gap-3 items-center">
                  <img src="@/assets/images/payment/ic-bullet.svg" alt="ic-bullet">

                  <div class=" flex flex-col gap-1">
                    <div class=" font-bold text-[#1B73D2] text-2xl">
                      Beritahu Staff Kami
                    </div>

                    <div class=" text-[#1B73D2] text-xl font-medium">
                      Jika masalah berlanjut, segera hubungi staff atau CSO terdekat untuk bantuan lebih lanjut.
                    </div>
                  </div>
                  
                </div>
              </div>




              <!-- Footer -->
              <div class=" w-full h-[56px] bg-[#1976D3] absolute bottom-0 left-0 text-white text-sm font-medium flex items-center justify-center gap-1.5">
                <span>Powered By</span>
                <img src="@/assets/images/tiketux-logo.png" alt="tiketux-logo">
              </div>
            </div>  
          </ModalOverlay>
        </Transition>
      </Teleport>

      <!-- Cancel Booking Modal -->
      <Teleport to='.appWrapper'>
          <OverlaySpinner bg="bg-[#00000060]" v-if="cancelSpinner"/>
          <div v-if="isModalCancelBooking" class="w-full h-full absolute top-0 bg-[#00000093] flex items-center justify-center">
              <div class="w-[1000px] auto py-[90px] rounded-[35px] flex flex-col" :class="`bg-[${colors.secondaryColor}]`">
                  <h2 class="text-[40px] text-center font-bold mb-[60px]">
                    {{ $t('payment.cancel.message') }}
                  </h2>
                  <div class="flex justify-center">
                    <button
                      @click="cancelBooking"
                      class="mr-[40px] text-[40px]  rounded-[30px] font-semibold w-[300px] py-[30px]"
                      :class="`text-[${colors.secondaryColor}] bg-[${colors.primaryColor}]`"
                    >
                      {{ $t('payment.cancel.yes') }}
                    </button>
                    <button
                      @click="closeModal"
                      class="text-[40px]  rounded-[30px] font-semibold w-[300px] py-[30px] border-2"
                      :class="`text-[${colors.primaryColor}] border-[${colors.primaryColor}] bg-[${colors.secondaryColor}]`"
                    >
                      {{ $t('payment.cancel.no') }}
                    </button>
                  </div>
              </div>
          </div>
      </Teleport>

      <!-- EDC Modal -->
      <Teleport to=".appWrapper">
        <OverlaySpinner
          :spinnerColor="colors.primaryColor"
          bg="bg-[#0000003f]"
          v-show="showSpinnerEdc"
        />
        <EdcScreen
          v-if="isEdc"
          :isSetPaidError="isSetPaidError"
          @onClickBack="closeEdcModal"
          @onClickEdcHelpModal="modalHelpEdc = true"
        />
      </Teleport>

      <!-- How To Pay Modal -->
      <Teleport to='.appWrapper'>
        <Transition :duration="350" name="nested">
          <div v-show="isHowToPay" class="w-full h-full absolute top-0 flex justify-end items-center z-[100]">

            <div @click="howToPayModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
            <div class="flex inner z-[99]">
                <div @click="howToPayModal" class="bg-[#C66C6C] flex justify-center items-center cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
                    <img src="./../../../assets/images/x.png">
                </div>
                  
                <div class="w-[755px] rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[auto]  relative">
                  <img src="./../../../assets/images/hot-to-pay.png">
                </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
</template>