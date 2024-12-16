<script setup>
import { gsap } from "gsap";
import { ref, onMounted, watch, toRef } from 'vue';
import { useScheduleStore } from '../../../store/ScheduleStore';
import { formattingNumber } from '@/utils'
import { useI18n } from 'vue-i18n';
import { Vue3Lottie } from 'vue3-lottie';
import ScanBarcodeAnimation from '@/assets/lottie/scan-barcode.json';
import IcVoucher from '../../svg/IcVoucher.vue';
import IllustrationVoucher from '../../svg/IllustrationVoucher.vue';
import OverlayModal from '../../OverlayModal.vue';
import Modal from './Modal.vue';
import Spinner from '@/components/daytrans/OverlaySpinner.vue';
import LetterKeyboard from '../../../components/daytrans/completed/LetterKeyboard.vue';


import { useVoucherCheck } from '../../../composeable/reservation.js';
import ErrorState from "../schedule/ErrorState.vue";

const scheduleStore = useScheduleStore();
const { t, locale } = useI18n();

const props = defineProps({ phoneNo: String });

const phoneNo = toRef(() => props.phoneNo);



const { 
  showModal,
  isInputOption,
  isSelectOption,
  isScanModal,
  voucherCodeInput,
  voucherCodeScan,
  debounceVoucherScan,
  isErrorState,
  isSuccessState,
  voucherCodeScanElement,
  focus,
  isFetching,
  borderInputDynamic,
  countDownDuration,
  checkVoucherHandler,
  clearVoucherHandler,
  startInterval
} = useVoucherCheck();

const showInputKeyboard = ref(false);
const activeOption = ref(null);
const showCtaApply = ref(false);

const onClickInput = () => {
  isSelectOption.value = false;
  isInputOption.value = true;
};

const onClickScan = () => {
  isSelectOption.value = false;
  isScanModal.value = true;
  voucherCodeScanElement.value.focus();
};

const backToSelectOption = () => {
  isSelectOption.value = true;
  isScanModal.value = false;
  isInputOption.value = false;
  isErrorState.value = false;
  voucherCodeScanElement.value.blur();
  voucherCodeInput.value = '';
};


const updateVoucherCode = (newValue) => {
  voucherCodeInput.value = newValue;
  showInputKeyboard.value = false;
}

watch(voucherCodeInput, () => {
  if (voucherCodeInput.value && voucherCodeInput.value.length > 0) {
    showCtaApply.value = true;
  } else {
    showCtaApply.value = false;
  }
});

watch(voucherCodeScan, () => {
  debounceVoucherScan();
});


const openModalHandler = async () => {
  showModal.value = true;
  await clearVoucherHandler();
};

const closeModalHandler = () => {
  showModal.value = false;
  voucherCodeInput.value = '';
  isScanModal.value = false;
  isErrorState.value = false;
  isSuccessState.value = false;
  backToSelectOption();
}


const ctaOnClick = async () => {
  showCtaApply.value = false;
  await checkVoucherHandler();
}

const changeVoucher = async () => {
  showModal.value = true; 
  await clearVoucherHandler();
};




</script>

<template>
  <div class=" w-full bg-white p-8 flex justify-between rounded-[35px] items-center">
    <input
      class="border-[1px] border-black absolute right-0 top-0 opacity-0"
      type="text"
      ref="voucherCodeScanElement"
      v-model="voucherCodeScan"
      @blur="isScanModal ? focus() : ''"
    > 
    <div>
      <!-- Voucher Not Applied -->
      <template v-if="!scheduleStore.appliedVoucher">
        <span :class="`text-[${colors.fontPrimaryColor}]`" class=" font-semibold text-2xl">
          {{ $t('reservation.voucher.hadVoucher') }}
        </span>
        <button
          v-if="phoneNo?.length >= 9"
          @click="openModalHandler"          
          class="px-4 py-[14.5px] flex items-center text-white text-lg font-semibold rounded-[37px] overflow-hidden mt-4 relative"
          :class="`bg-[${colors.primaryColor}]`"
        >
          <IcVoucher class="mr-[5px]" />
          {{ $t('reservation.voucher.useVoucher') }}

          <img src="../../../assets/images/overlay-pattern.png" class="absolute bottom-[-10px] right-[-10px]" alt="overlay-pattern">
        </button>
        <button
          v-else
          class="px-4 py-[14.5px] flex items-center text-white text-lg font-semibold rounded-[37px] overflow-hidden mt-4 relative"
          :class="`bg-[${colors.secondaryColor200}]`"
        >
          <!-- <IcVoucher class="mr-[5px]" /> -->
          {{ $t('reservation.voucher.useVoucher') }}

          <img src="../../../assets/images/overlay-pattern.png" class="absolute bottom-[-10px] right-[-10px]" alt="overlay-pattern">
        </button>
        <div class=" text-[#71747D] text-sm mt-4">
          {{ $t('reservation.voucher.enterPhoneNo') }}
        </div>
      </template>

      <!-- Voucher Applied -->
      <template v-else>
        <div :class="`text-[${colors.fontPrimaryColor}]`" class=" font-semibold text-2xl px-3 py-[6px] rounded-2xl bg-[#1025420D]">
          {{ $t('reservation.voucher.deduction') }} Rp. {{ formattingNumber(scheduleStore.voucherData.deduction_nominal) }}
        </div>

        <button @click="changeVoucher" class=" px-4 py-[15px] text-[#EB2C27] font-semibold bg-transparent">
          {{ $t('reservation.voucher.changeVoucher') }}
        </button>
      </template>
    </div>
    <IllustrationVoucher/>

    <Teleport to=".appWrapper">
      <Transition>
        <OverlayModal v-show="showModal" class="flex items-center justify-center voucherModalOverlay">

          <Transition>
            <Modal v-show="isSelectOption" class="voucherModal w-[677px] h-[371px] absoluteCenter">
              <div
                class=" w-16 h-16 rounded-full bg-[#020617] flex justify-center items-center absolute top-[-20px] right-[-20px]"
                @click="closeModalHandler"
              >
                <img src="../../../assets/images/x.png" alt="btn-voucher-code-input">
              </div>

              <div class="text-[#1F2937] text-2xl font-semibold">Voucher</div>
              <!-- Select Options -->
              <div class="buttonOptions absolute left-[25px]">
                <div class=" mt-8 flex gap-6">
                  <img
                    v-if="locale == 'id'"
                    @click="onClickInput"
                    src="../../../assets/images/btn-voucher-code-input.png" alt="btn-voucher-code-input"
                  >
                  <img
                    v-else
                    @click="onClickInput"
                    src="../../../assets/images/btn-voucher-code-input-en.png" alt="btn-voucher-code-input"
                  >
                  <img
                    @click="onClickScan"
                    src="../../../assets/images/btn-voucher-code-scan.png" alt="btn-voucher-code-scan"
                  >
                </div>
              </div>


              
            </Modal>
          </Transition>

          <Transition>
            <Modal v-show="isInputOption" class="w-[677px] absoluteCenter">
              <div
                class=" w-16 h-16 rounded-full bg-[#020617] flex justify-center items-center absolute top-[-20px] right-[-20px]"
                @click="closeModalHandler"
              >
                <img src="../../../assets/images/x.png" alt="btn-voucher-code-input">
              </div>

              <div
                class="flex items-center text-2xl font-semibold" :class="`text-[${colors.fontPrimaryColor}]`"
              >
                <img
                  @click="backToSelectOption"
                  src="../../../assets/images/left.png" class=" w-6 mr-5" alt="left"
                >
                Voucher
              </div>

              <div class="relative mt-8 mb-4">
                  <input
                    @keydown.prevent=""
                    @click="showInputKeyboard = true"
                    v-model="voucherCodeInput"
                    type="text"
                    class="w-[597px] rounded-2xl outline-none border font-medium pl-[20px] h-20 text-2xl"
                    :class="borderInputDynamic"
                    :placeholder="$t('reservation.voucher.enterVoucherCode')"
                  />

                  <!-- Apply Voucher -->
                  <Transition>
                    <div class=" flex items-center gap-4 absolute right-5 top-3" v-show="showCtaApply">
                      <img
                        @click="voucherCodeInput = ''"
                        src="../../../assets/images/ic_trash.svg" class="w-[44px]" alt="left"
                      >
                      <button
                        @click="ctaOnClick()"
                        class="applyVoucher py-[14px] px-4 text-white text-lg font-semibold rounded-2xl "
                        :class="`bg-[${colors.primaryColor}]`"
                      >
                      {{ $t('reservation.voucher.useVoucher') }}
                      </button>
                    </div>
                  </Transition>

                  <!-- On Success -->
                  <Transition>
                    <div
                      v-show="isSuccessState"
                      class="voucherOnSuccess flex items-center absolute right-5 top-[30px]"
                    >
                    <img src="../../../assets/images/ic_checklist_green.svg" class="mr-2" alt="ic-checklist-green">
                      {{ $t('reservation.voucher.success') }}
                    </div>
                  </Transition>


                  <!-- OnProcess -->
                  <Transition>
                    <div
                      v-show="isFetching"
                      class="voucherOnProcess flex items-center absolute right-5 top-[20px]"
                    >
                    <Spinner
                      :isAbsolute="false"
                      spinnerSize="25px"
                      spinnerBorder="3px"
                      spinnerColor="#222222"
                      spinnerWrapperSize="40px"
                      customClass="mr-1"
                      bg="transparent"
                    /> {{ $t('reservation.voucher.processing') }}
                    </div>
                  </Transition>


                  <!-- Success State -->
                  <Transition>
                    <div v-show="isSuccessState" class="text-xl font-normal text-[#16A34A] absolute bottom-[-40px] left-0 w-full">
                      {{ $t('reservation.voucher.deduction') }}  Rp. {{ formattingNumber(scheduleStore?.voucherData?.deduction_nominal) }}  <span class="absolute right-0">({{ countDownDuration }})</span>
                    </div>
                  </Transition>

                  <!-- Error State -->
                  <Transition>
                    <div v-show="isErrorState" class="text-xl font-normal text-[#DC2626] absolute bottom-[-40px] left-0">
                      {{ $t('reservation.voucher.invalidVoucher') }}
                    </div>
                  </Transition>
              </div>


            </Modal>
          </Transition>


          <Transition>
            <Modal v-show="isScanModal" class="w-[677px] absoluteCenter">
              <div
                class=" w-16 h-16 rounded-full bg-[#020617] flex justify-center items-center absolute top-[-20px] right-[-20px] z-10"
                @click="closeModalHandler"
              >
                <img src="../../../assets/images/x.png" alt="btn-voucher-code-input">
              </div>

              <div
                class="flex items-center text-2xl font-semibold" :class="`text-[${colors.fontPrimaryColor}]`"
              >
                <img
                  @click="backToSelectOption"
                  src="../../../assets/images/left.png" class=" w-6 mr-5" alt="left"
                >
                Voucher
              </div>

              <Vue3Lottie
                class=" mt-20"
                :animation-data="ScanBarcodeAnimation"
                :height="336"
                :width="336"
              />

              <!-- On idle State -->
              <Transition>
                <div v-show="!isFetching" class=" text-xl absolute bottom-0 left-0 p-8">
                  {{ $t('reservation.voucher.scanVoucher') }}
                </div>
              </Transition>

              <!-- On Process State -->
              <Transition>
                <div v-show="isFetching" class=" text-xl absolute bottom-0 left-0 p-8 flex items-center justify-center w-full">
                  <Spinner
                    :isAbsolute="false"
                    spinnerSize="25px"
                    spinnerBorder="3px"
                    spinnerColor="#222222"
                    spinnerWrapperSize="40px"
                    customClass="mr-1"
                    bg="transparent"
                  />
                  Memproses
                </div>
              </Transition>

              <!-- On Error State -->
              <Transition>
                <div v-show="isErrorState" class="text-xl absolute bottom-0 left-0 p-8 w-full bg-white rounded-full text-[red]">
                  {{ $t('reservation.voucher.invalidVoucher') }}
                </div>
              </Transition>

              <!-- On Success State -->
              <Transition>
                <div v-if="isSuccessState" class=" w-full h-full absolute bg-white top-0 left-0 p-8 rounded-[35px]">
                  <div
                    class="flex items-center text-2xl font-semibold" :class="`text-[${colors.fontPrimaryColor}]`"
                  >
                    <img
                      @click="backToSelectOption"
                      src="../../../assets/images/left.png" class=" w-6 mr-5" alt="left"
                    >
                    Voucher
                  </div>
                  <div class="w-full flex flex-col gap-8 mt-6 justify-center items-center">
                    <img src="../../../assets/images/ic_checklist_xl.png" alt="ic_checklist">
                    <div class="text-xl text-[#1F2937] font-medium flex flex-col items-center gap-2">
                        <div class=" flex items-center">
                          <img src="../../../assets/images/ic_checklist_green.svg" alt="ic-checklist-green">
                          {{ $t('reservation.voucher.deduction') }}  Rp. {{ formattingNumber(scheduleStore?.voucherData?.deduction_nominal) }}
                        </div>
                        <div>({{ countDownDuration }})</div>
                    </div>
                  </div>
                </div>
              </Transition>
            </Modal>
          </Transition>
        </OverlayModal>
      </Transition>
    </Teleport>

    <LetterKeyboard
      :placeholderValue="$t('reservation.voucher.enterVoucherCode')"
      :value="voucherCodeInput"
      :isShow="showInputKeyboard"
      @updatingValue="updateVoucherCode"
      @closeKeyboard="showInputKeyboard = false"
    />
  </div>
  
</template>

<style>
  .progress {
    left: 50%;
    transform: translateX(-50%);
    height: 4px;
    border-radius: 100px;
  }


  .progress::-webkit-progress-bar {
    background-color: #EEEEEE;
    outline: 0;
  }

  .progress::-webkit-progress-bar
   {
    border-radius: 0px;
  }
  .progress::-webkit-progress-value {
    background: red;
    border-radius: 0px;
  }

  .progress::-moz-progress-bar {
    border-radius: 0px;

  }


  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }


  .absoluteCenter{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>