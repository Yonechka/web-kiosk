<script setup>
  import { ref, onMounted, watch, onUnmounted } from 'vue';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
  import {
    useBoardingInitialData,
    useToast,
    useEventInput,
    useHandleButton,
    useUnMountedHook
  } from '../../../composeable/boarding';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  
  import debounce from 'lodash.debounce';
  import OverlaySpinner from '../../../components/jackal/OverlaySpinner.vue';
  import BoardingInfo from '../../../components/jackal/BoardingInfo.vue';
  import ToastCustom from '../../../components/jackal/ToastCustom.vue';

  const scheduleStore = useScheduleStore();
  const router = useRouter();
  const route = useRoute();

  const {
    input, noTicket, isFetching, isModal,
    isBoardingCompleted, isSpinner, departureCode
  } = useBoardingInitialData();

  /* Toast Custom */
  const {
    showToast, toastTitle, toastMessage, toastConfig
  } = useToast();

  /* Event Boarding */
  const { focus } = useEventInput();

  /* Button Handle */
  const { boarding, cancelBoarding, backToBoarding } = useHandleButton(toast);
  
  onUnmounted(() => {
    const { resetGlobalState } = useUnMountedHook();
    resetGlobalState();
  });
  onMounted(() => {
    input.value.focus();
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
    <OverlaySpinner v-show="isSpinner" bg="bg-[#00000093]"/>
      <div class="w-full h-full absolute pt-[73px]" :class="`bg-[${colors.primaryColor}]`">
          <input style="opacity: 1;" ref="input" v-model="noTicket" @blur="focus" type="text">
          <!-- <button @click="blurInput" class="bg-[blue]">Blur</button> -->
          <img src="../../../assets/images/logo-white-text.png" class="mx-auto w-[239px]"> <br>
          <div
            class="text-[96px] font-bold text-center"
            :class="`text-[${colors.fontSecondaryColor}]`"
          >
            Boarding
          </div>
          <div class="flex justify-center items-center mt-[144px]">
              <div
                class="justify-center h-[408px] w-[408px] flex rounded-full items-center"
                :class="`bg-[${colors.primaryColor80}]`"
              >
                  <img src="../../../assets/images/boarding.png">
              </div>
          </div>
          <div class="mx-auto flex justify-center">
              <div
                class="text-[48px] pt-[87px] flex text-center font-medium text-2xl"
                :class="`text-[${colors.fontSecondaryColor}]`"
              >
                Silahkan scan barcode<br><br>anda di bawah ini
              </div>
          </div>


          <div class="flex justify-between items-center absolute bottom-0 pr-[56px]">
              <div class="pr-[413px] flex  items-center text-center">
                  <div @click="$router.back()" class="flex justify-center pr-[71px] py-[30px] w-full rounded-r-[100px] bg-[#F18C33]">
                      <img src="../../../assets/images/leftArrowWhite.png" class="pl-[30px]">
                      <div
                        class="font-semibold ml-[20px] text-[48px]"
                        :class="`text-[${colors.fontSecondaryColor}]`"
                      >
                        Kembali
                      </div>
                  </div>
              </div>
              <div class=" justify-center rounded-t-[100px]" :class="`bg-[${colors.secondaryColor}]`">
                  <img src="../../../assets/images/arrow-bottom-orange.png" class="px-[46px] py-[57px]">
              </div>
          </div>
      </div>
      
      <div
        v-if="isModal"
        class="w-full h-full absolute top-0 flex flex-col items-center justify-center"
        :class="`bg-[${colors.primaryColor}]`"
      >
        <img src="../../../assets/images/logo-white-text.png" class="absolute w-[239px] top-[73px]">
        <div
          class="text-[48px] font-semibold"
          :class="`text-[${colors.fontSecondaryColor}]`"
        >
          Konfirmasi Boarding?
        </div>
        <BoardingInfo/>
        <div
          class="w-[534px] font-bold flex justify-between"
          :class="`text-[${colors.fontSecondaryColor}]`"
        >
          <div
            @click="cancelBoarding"
            class="w-[252px] cursor-pointer rounded-[25px] text-center py-[20px]"
            :class="`bg-[${colors.secondaryColor400}]`"
          >
            Tidak
          </div>
          <div
            @click="boarding"
            class="w-[252px] cursor-pointer rounded-[25px] text-center  py-[20px]"
            :class="`bg-[${colors.accentColor}]`"
          >
            Konfirmasi
          </div>
        </div>
      </div>

      <div
        v-if="isBoardingCompleted"
        class="w-full h-full absolute top-0 flex flex-col items-center justify-start"
        :class="`bg-[${colors.primaryColor}]`"
      >
        <img src="../../../assets/images/logo-white-text.png" class="mt-[73px] w-[239px] mb-[59px]">
        <div
          class="text-[96px] font-bold mb-[144px]"
          :class="`text-[${colors.fontSecondaryColor}]`"
        >
          Hati-hati Di Jalan
        </div>  
        <img src="../../../assets/images/boarding-completed.png" class="mb-[57px]">
        <div
          class="text-[48px] text-center"
          :class="`text-[${colors.fontSecondaryColor}]`"
        >
          Terimakasih telah <br> mempercayai kami
        </div>
        <div
          class="mt-[55px] px-[20px] py-[10px] rounded-[50px] flex items-center text-[24px] font-semibold"
          :class="`bg-[${colors.secondaryColor}] text-[${colors.primaryColor}]`"
        >
          <img src="../../../assets/images/boarding_ic_independent.png" class="mr-[10px]">
          Boarding mandiri tidak perlu mencetak struk
        </div>

        <div class="flex justify-between items-center absolute bottom-[99px] left-0">
            <div class="flex items-center text-center">
                <div @click="backToBoarding" class="flex justify-center pr-[71px] py-[30px] w-full rounded-r-[100px] bg-[#F18C33]">
                    <img src="../../../assets/images/leftArrowWhite.png" class="w-full pl-[30px]">
                    <div
                      class="font-semibold ml-[20px] text-[48px]"
                      :class="`text-[${colors.fontSecondaryColor}]`"
                    >
                      Kembali
                    </div>
                </div>
            </div>
        </div>
      </div>
  </Teleport>
</template>