<script setup>
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { storeToRefs } from 'pinia';
  import { useStore } from '../../../store/Store';
  import { reactive, ref, onMounted, onUnmounted } from 'vue';
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
  import { toast } from 'vue3-toastify';
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
  } from '../../../composeable/payment';

  import TripInformation from '../../../components/jackal/TripInformation.vue';
  import OverlaySpinner from '../../../components/jackal/OverlaySpinner.vue';
  import ToastCustom from '../../../components/jackal/ToastCustom.vue';

  const router = useRouter();
  const route = useRoute();

  const store = useStore();
  const scheduleStore = useScheduleStore();
  const {
    selectedDeparturePool,
    selectedDestinationPool,
    selectedDepartureTime,
    departureDate,
    departureTime,
    totalTicketPrice,
    selectedSeats,
    bookingInfo
  } = storeToRefs(scheduleStore);

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
  } = usePaymentCancelCountDown(router);
  startCancelCountdown();
  
  /* Payment Sucess Countdown */
  const { countDownDuration, isShow, countDown, startInterval, toCompleted } = usePaymentSuccess(router);

  /* Check Payment Interval */
  const { checkPaymentStatus, startIntervalCheckPayment } = useCheckPayment(router);

  /* Cancel Booking */
  const { redirectToReservation, isModalCancelBooking, cancelSpinner, cancelBooking, closeModal } = useCancelBooking(router);
 
  /* Before Leave Route validation */
  onBeforeRouteLeave( async (to, from) => {
    const { init } = useOnBeforeRouteLeave(to, from);
    return init();
  });

  /* EDC */
  const { isEdc, showSpinnerEdc, closeEdcModal, edcModal } = useEDC()

  /* onMounted Hook */
  onMounted( async () => {
    startIntervalCheckPayment();
  });

  /* onUnmounted Hook */
  onUnmounted(() => {
    console.log('onUnmounted hook called');
    const { resetGlobalState } = useOnUnmountedHook();
    resetGlobalState();
  })

</script>

<template>
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
    <TripInformation/>
    <div v-if="!isShow" class="mt-[40px] rounded-[35px] w-full mb-[224.71px]" :class="`bg-[${colors.secondaryColor}]`">
        <div class="pl-[34px] pt-[33px]  border-1" :class="`border-[${colors.secondaryColor200}]`">
            <div class="font-medium text-[36px]" :class="`text-[${colors.fontPrimaryColor}]`">
              Menunggu Pembayaran
            </div>
        </div>
        <div class="flex justify-between items-center pl-[34.5px] pb-[0px] pt-[32px]">
            <div class="font-medium text-2xl" :class="`text-[${colors.fontSecondaryColor300}]`">Kode Booking</div>
            <div
              class="pl-[184px] pr-[34.5px] font-bold text-2xl"
              :class="`text-[${colors.fontPrimaryColor}]`"
            >
                {{ bookingInfo.booking_code }}
            </div>
            <!-- <div class=" pl-[184px] pr-[34.5px] font-bold text-2xl text-[#000000]">BJH873873</div> -->
        </div>

        <div class="mx-auto flex justify-center">
            <div
              class="pt-9 pb-[26px] flex text-center font-medium text-2xl"
              :class="`text-[${colors.fontPrimaryColor}]`"
            >
                Scan QRIS dibawah <br> untuk melakukan pembayaran
            </div>
        </div>
        <div class="flex justify-between px-[35px] mb-[27px]">
          <div class="font-medium text-[26px]" :class="`text-[${colors.fontSecondaryColor300}]`">NMID :<span class="pl-[20px]">
            {{ bookingInfo?.payment_status?.client_data?.qr_nmid }}
            </span></div>
            <img src="../../../assets/images/payment/qris.png">
            <!-- <img :src="bookingInfo.payment_status.client_data.qr_url" class="w-[237px] h-[237px]"> -->
        </div>
        <img :src="bookingInfo.payment_status.client_data.qr_url" class="w-[237px] h-[237px] mx-auto">
        <div class="w-[544px] mx-auto rounded-[11px] text-[24px] text-[#672B2B] py-[15px] flex justify-center items-center bg-[#FFEAEA]">
          <img src="../../../assets/images/clock-ic.png" class="mr-[6px]">
          <span class="font-bold text-[#ED1B24] mr-[6px]"> {{ minutesFormat }}:{{ secondFormat }} </span> Sisa Waktu Pembayaran
        </div>
        <div class="text-center pt-[25px] border-1 border-[#858585]">
            <!-- <div class="font-medium text-[#6A6A6A] text-[26px]">NMID :<span class="pl-[20px]">
                {{ bookingInfo.payment_status.client_data.qr_nmid }}
            </span></div> -->
        </div>

        <div class="flex pl-[51px] pr-[51px] pt-[30px] pb-[25px] items-center justify-center">
            <div
              @click="howToPayModal"
              class="py-[20px] px-[27px] rounded-[26px] flex items-center justify-center"
              :class="`bg-[${colors.accentColor}]`"
            >
                <a href="#" class="font-bold text-[#FFFFFF] text-xl">Cara Pembayaran</a>
            </div>
            <div
              @click="checkPaymentStatus"
              class="py-[20px] px-[40px] rounded-[26px] flex items-center justify-center ml-[30px]"
              :class="`bg-[${colors.accentColor}]`"
            >
                <div class="font-bold text-xl" :class="`text-[${colors.secondaryColor}]`">Cek Status Bayar</div>
            </div>
        </div>

        <div class="flex pb-[25px] mx-auto ">
            <img src="../../../assets/images/payment/bank.png" class="h-[69.52px] w-[597px] mx-auto">
        </div>
        <div
          class="text-[39.96px] text-center pb-[25px]"
          :class="`text-[${colors.fontPrimaryColor}]`"
        >Atau Gunakan</div>

        <div class="flex justify-center px-[23px] pb-[33px]">
            <div
              @click="edcModal"
              class="flex items-center justify-center py-[37px] h-[124px] w-full rounded-[26px]"
              :class="`bg-[${colors.primaryColor}]`"
            >
                <div
                  class="rounded-full w-[80.6px] h-[80.6px] flex justify-center items-center"
                  :class="`bg-[${colors.secondaryColor}]`"
                >
                    <img src="../../../assets/images/payment/atm.png" class="w-[47.83px] h-[54.16px]">
                </div>
                <div class="font-bold text-4xl pl-[30px]" :class="`text-[${colors.fontSecondaryColor}]`">EDC BCA</div>
                <img src="../../../assets/images/payment/next.png" class="pl-[16.25px]">
            </div>
        </div>
    </div>

    <div v-if="isShow" class="mt-[40px] rounded-[35px] w-full mb-[436px]" :class="`bg-[${colors.secondaryColor}]`">
      <div
        class="pl-[34px] pt-[33px]  border-1"
        :class="`border-[${colors.secondaryColor200}]`"
      >
          <div
            class="font-medium text-[36px]"
            :class="`text-[${colors.fontPrimaryColor}]`"
          >
            Pembayaran Berhasil
          </div>
      </div>
      <div class="flex justify-between items-center pl-[34.5px] pb-[45px]  pt-[32px]">
          <div class="font-medium text-2xl" :class="`text-[${colors.fontSecondaryColor300}]`">Kode Booking</div>
          <div
            class="pl-[184px] pr-[34.5px] font-bold text-2xl"
            :class="`text-[${colors.fontPrimaryColor}]`"
          >
            {{bookingInfo.booking_code}}
          </div>
      </div>
      <div class="flex justify-center pt-[50px] pb-9">
          <img src="../../../assets/images/payment/succeed.png" class="">
      </div>
      <div
        class="flex justify-center text-2xl font-medium"
        :class="`text-[${colors.fontPrimaryColor}]`"
      >
        Screen akan lanjut otomatis dalam waktu
      </div>
      <div class="flex justify-center items-center mx-auto pr-[273px] pt-[32.9px] pb-[82.9px]">
          <img src="../../../assets/images/payment/timer.png" class="pl-[276px]">
          <div
            class="text-4xl font-bold ml-[14.7px]"
            :class="`text-[${colors.fontPrimaryColor}]`"
          >{{ countDownDuration }}</div>
      </div>
      <div class="flex justify-center px-[23px] pb-[33px] ">
          <div
            @click="toCompleted"
            class="flex items-center justify-center py-[41px] w-full rounded-[26px]"
            :class="`bg-[${colors.accentColor}]`"
          >
            <div
              href="#"
              class="font-bold text-4xl"
              :class="`text-[${colors.secondaryColor}]`"
            >
              Lengkapi Identitas
            </div>
              <img src="../../../assets/images/payment/next.png " class="pl-[16.25px] ">
          </div>
      </div>
    </div>

    <!-- Cancel Booking Modal -->
    <Teleport to='.appWrapper'>
        <OverlaySpinner bg="bg-[#00000060]" v-if="cancelSpinner"/>
        <div v-if="isModalCancelBooking" class="w-full h-full absolute top-0 bg-[#00000093] flex items-center justify-center">
            <div class="w-[1000px] auto py-[90px] rounded-[35px] flex flex-col" :class="`bg-[${colors.secondaryColor}]`">
                <h2 class="text-[40px] text-center font-bold mb-[60px]">
                    Apakah anda ingin membatalkan booking?
                </h2>
                <div class="flex justify-center">
                  <button
                    @click="cancelBooking"
                    class="mr-[40px] text-[40px]  rounded-[30px] font-semibold w-[300px] py-[30px]"
                    :class="`text-[${colors.secondaryColor}] bg-[${colors.primaryColor}]`"
                  >
                    Ya
                  </button>
                  <button
                    @click="closeModal"
                    class="text-[40px]  rounded-[30px] font-semibold w-[300px] py-[30px] border-2"
                    :class="`text-[${colors.primaryColor}] border-[${colors.primaryColor}] bg-[${colors.secondaryColor}]`"
                  >
                    Tidak
                  </button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- EDC Modal -->
    <Teleport to=".appWrapper">
      <div
        v-show="isEdc"
        class="absolute w-full pl-[45px] pr-[56px] h-[100%] mx-auto"
        :class="`bg-[${colors.primaryColor}]`"
      >
        <OverlaySpinner bg="bg-[#00000060]" v-if="showSpinnerEdc"/>
        <div class="flex  mb-[25px] justify-between">
            <!-- navbar menu -->
            <div class="pt-[126px] ">
                <img src="../../../assets/images/logo-white-text.png" alt="" class="w-[239px]">
            </div>
            <TripInformation width="w-[525px]" />
        </div>
        <div class="w-full flex justify-end">
            <img src="../../../assets/images/payment/edc.png">
        </div>
        <!-- <button @click="edcDev" class="text-white"> *USER INSERT CARD* </button> -->
        <div class="pb-[99px] pt-[35px] absolute bottom-0 left-0">
            <div @click="closeEdcModal" class="flex items-center pr-[132px] py-[30px] w-[400px] rounded-r-[100px] bg-[#F18C33] ">
                <img src="../../../assets/images/leftArrowWhite.png " class="pl-[30px]">
                <div
                  class="font-semibold pl-[20px] text-[48px]"
                  :class="`text-[${colors.fontSecondaryColor}]`"
                >Kembali</div>
            </div>
        </div>
      </div>
    </Teleport>

    <!-- How To Pay Modal -->
    <Teleport to='.appWrapper'>
      <Transition :duration="350" name="nested">
        <div v-show="isHowToPay" class="w-full h-full absolute top-0 flex justify-end items-center z-[100]">

          <div @click="howToPayModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
          <div class="flex inner z-[99]">
              <div @click="howToPayModal" class="bg-[#C66C6C] cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
                  <img src="./../../../assets/images/x.png">
              </div>
                
              <div class="w-[755px] rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[auto]  relative">
                <img src="./../../../assets/images/hot-to-pay.png">
              </div>
          </div>
        </div>
      </Transition>
    </Teleport>
</template>