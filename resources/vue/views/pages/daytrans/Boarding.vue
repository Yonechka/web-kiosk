<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { useStore } from '../../../store/Store';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import usePingStatus from '@/composeable/usePingStatus.js';
  import useRedirectToIdle from '@/composeable/useRedirectToIdle';
  import {
    useBoardingInitialData,
    useToast,
    useEventInput,
    useHandleButton,
    useUnMountedHook,
    useBoardingSuccess
  } from '../../../composeable/boarding';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  
  import debounce from 'lodash.debounce';
  import OverlaySpinner from '../../../components/daytrans/OverlaySpinner.vue';
  import LanguageSelector from '@/components/LanguageSelector.vue';
  import BoardingInfo from '../../../components/daytrans/BoardingInfo.vue';
  import ToastCustom from '../../../components/daytrans/ToastCustom.vue';
  import ErrorState from '../../../components/daytrans/schedule/ErrorState.vue';
  import departureCodes from '../../../config/departureCodes';

  const scheduleStore = useScheduleStore();
  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  const isError = ref(false);
  const { t } = useI18n();

  const {
    input, noTicket, isFetching, isModal,
    isBoardingCompleted, isSpinner
  } = useBoardingInitialData({ _isNewAsmat: true });

  /* Redirect to idle handler */
  const { remainingDurationSec, resetRemainingTimeout } = useRedirectToIdle({ router });

  /* Toast Custom */
  const {
    showToast, toastTitle, toastMessage, toastConfig
  } = useToast();

  /* Event Boarding */
  const { focus, debounceBoarding } = useEventInput(t, true);
  watch(noTicket, (newValue, oldValue) => {
    resetRemainingTimeout();
    debounceBoarding();
  });

  /* Button Handle */
  const { boarding, cancelBoarding, backToBoarding } = useHandleButton(toast, t, true);

  /* Fetch Initial */
  const fetchInitialData = async () => {
    try {
      isSpinner.value = true;
      await scheduleStore.getDeparture();
      isSpinner.value = false;
      isError.value = false;
    } catch (error) {
      isSpinner.value = false;
      isError.value = true
      console.log('onError FetchInitial', error)
    }
  }

  const departureCodeLS = localStorage.getItem('departureCode');
  const clientId = document.querySelector('[name=clientId]').content;
  const departureCode = departureCodes[clientId][departureCodeLS];
  store.departureCode = departureCode;

  /* Countdown success */
  const { countDownDuration } = useBoardingSuccess();


  onUnmounted(() => {
    const { resetGlobalState } = useUnMountedHook();
    resetGlobalState();
  });
  
  onMounted(async () => {
    usePingStatus({ clientId, outlet: departureCodeLS });
    await fetchInitialData();
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
    <div class="w-full h-full absolute" @click="resetRemainingTimeout">
      <div class=" text-white absolute text-2xl top-1 left-1 z-10">
        {{ remainingDurationSec }}
      </div>
      <LanguageSelector dynamicClass="rounded-[30px] z-10 py-6 px-8 text-[32px] absolute top-[80px] right-[80px]" />
      <ErrorState @retryOnClick="fetchInitialData" v-show="isError"></ErrorState>
      <OverlaySpinner v-show="isSpinner" @click="resetRemainingTimeout()" zIndex="z-[56]" bg="bg-[#00000093]"/>
      <!-- Initial Screen -->
      <div class="w-full h-full absolute pt-[250px]" :class="`bg-[${colors.primaryColor}]`">
          <input style="opacity: 0;" ref="input" v-model="noTicket" @blur="focus" type="text">
          <!-- <button @click="blurInput" class="bg-[blue]">Blur</button> -->
          <img :src="images.logoSecondary" class="mx-auto w-[239px]"> <br>
          <div
            class="text-[96px] font-bold text-center"
            :class="`text-[${colors.secondaryColor}]`"
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
          <div class="mx-auto flex flex-col items-center justify-center">
              <div
                class="text-[48px] pt-[87px] flex text-center mb-[100px] font-medium"
                :class="`text-[${colors.secondaryColor}]`"
                v-html="$t('boarding.scanBarcode')"
              >
              </div>

              <div class="flex justify-center items-center text-3xl text-white capitalize">
                <img src="../../../assets/images/ic_location_boarding.png" class="mr-2">
                {{ scheduleStore?.departurePools?.find(pool => pool.pool_code == departureCode)?.pool_name }}
              </div> 
          </div>
          <div class="flex justify-between items-center absolute bottom-0 pr-[56px]">
              <div class="pr-[413px] flex  items-center text-center">
                  <div @click="$router.back()" class="flex justify-center pr-[71px] py-[30px] w-full rounded-r-[100px] bg-[#F18C33]">
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
      
      <!-- Detail Boarding -->
      <div
        v-if="isModal"
        class="w-full h-full absolute top-0 flex flex-col items-center justify-center"
        :class="`bg-[${colors.primaryColor}]`"
      >
        <img :src="images.logoSecondary" class="absolute w-[250px] top-[215px]">
        <div
          class="text-[48px] font-semibold"
          :class="`text-[${colors.secondaryColor}]`"
        >
          {{ $t('boarding.confirmAsk') }}
        </div>
        <BoardingInfo/>

        <div
          class="w-[534px] font-bold flex justify-between mb-[50px]"
          :class="`text-[${colors.secondaryColor}]`"
        >
          <div
            @click="cancelBoarding"
            class="w-[252px] cursor-pointer rounded-[25px] text-center py-[20px]"
            :class="`bg-[${colors.secondaryColor400}]`"
          >
            {{ $t('boarding.ctaNo') }}
          </div>
          <div
            @click="boarding"
            class="w-[252px] cursor-pointer rounded-[25px] text-center  py-[20px]"
            :class="`bg-[${colors.accentSecondaryColor}]`"
          >
            {{ $t('boarding.ctaYes') }}
          </div>
        </div>

        <div class="flex justify-center items-center text-3xl text-white capitalize">
          <img src="../../../assets/images/ic_location_boarding.png" class="mr-2">
          {{ scheduleStore?.departurePools.find(pool => pool.pool_code == departureCode).pool_name }}
        </div> 
      </div>

      <!-- Success Boarding -->
      <div
        v-if="isBoardingCompleted"
        class="w-full h-full absolute top-0 flex flex-col items-center justify-start"
        :class="`bg-[${colors.primaryColor}]`"
      >
        <img :src="images.logoSecondary" class="mt-[250px] w-[239px] mb-[59px]">
        <div
          class="text-[96px] font-bold mb-[20px]"
          :class="`text-[${colors.secondaryColor}]`"
        >
          {{ $t('boarding.enjoyYourTrip') }}
        </div>
        <div class="text-[96px] text-center w-[50px] rounded-[10px] py-[8px] bg-[#F9DB6D] font-bold mb-[144px]">
          <div class="text-[#1F2937] text-[25px]">{{ countDownDuration }}</div>
        </div>
        <img src="../../../assets/images/boarding-completed-dt.png" class="mb-[57px]">
        <div
          v-html="$t('boarding.thanks')"
          class="text-[48px] text-center"
          :class="`text-[${colors.secondaryColor}]`"
        >
        </div>
        <div
          class="mt-[55px] px-[20px] mb-[50px] py-[10px] rounded-[50px] flex items-center text-[24px] font-semibold"
          :class="`bg-[${colors.secondaryColor}] text-[${colors.fontPrimaryColor}]`"
        >
          <img src="../../../assets/images/boarding_ic_independent_red.png" class="mr-[10px]">
          {{ $t('boarding.selfBoarding') }}
        </div>
        <div class="flex justify-center items-center text-3xl text-white capitalize">
          <img src="../../../assets/images/ic_location_boarding.png" class="mr-2">
          {{ scheduleStore?.departurePools.find(pool => pool.pool_code == departureCode).pool_name }}
        </div> 

        <div class="flex justify-between items-center absolute bottom-[99px] left-0">
            <div class="flex items-center text-center">
                <div @click="backToBoarding" class="flex justify-center pr-[71px] py-[30px] w-full rounded-r-[100px] bg-[#F18C33]">
                    <img src="../../../assets/images/leftArrowWhite.png" class="w-full pl-[30px]">
                    <div
                      class="font-semibold ml-[20px] text-[48px]"
                      :class="`text-[${colors.secondaryColor}]`"
                    >
                      {{ $t('boarding.back') }}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>