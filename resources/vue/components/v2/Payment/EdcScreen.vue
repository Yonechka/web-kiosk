<script setup>
import TripDetail  from '@/components/v2/TripDetail/TripDetail.vue';
import ModalOverlay from '@/components/v2/ModalOverlay.vue';

const props = defineProps({
  isSetPaidError: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['onClickBack', 'onClickEdcHelpModal']);
const closeEdcModal = () => emits('onClickBack');
const onClickEdcHelpModal = () => emits('onClickEdcHelpModal');
</script>

<template>
  <div
    class=" w-full h-full flex absolute z-10"
    :class="`bg-[${colors.primaryColor}]`"
  > 
    <div class=" w-[320px] py-[100px] flex flex-col justify-between h-full">
      <img
        :src="images.logoSecondary"
        class=" mx-auto w-[160px]"
        alt="logo-secondary"
      >
      <div>
        <div class=" relative w-fit h-fit">
          <div v-show="props.isSetPaidError" class=" absolute top-6 right-7 rounded-full w-4 h-4 z-10">
            <div class=" absolute w-full h-full bg-red-600 left-0 rounded-full"></div>
            <div class=" absolute w-full h-full bg-red-600 animate-ping left-0 rounded-full"></div>
          </div>
          <img
            @click="onClickEdcHelpModal"
            src="@/assets/images/payment/help-edc-btn.png"
            alt="edc"
            class=" w-[272px] ml-2"
          >
        </div>
        <div @click="closeEdcModal" class=" px-[23.5px] py-[26px] bg-[#102542] rounded-r-full flex items-center justify-start flex-auto w-fit gap-[7.5px] text-2xl text-white font-medium">
          <img src="@/assets/images/leftArrowWhite.png" alt="arrow-left">
          {{ $t('payment.back') }}
        </div>
      </div>
    </div>

    <div class=" w-[760px] h-full p-8">
      <TripDetail class=" h-full">
        <template #bottom>
          <img
            src="@/assets/images/payment/edc.png"
            alt="edc-guide"
            class="ml-auto flex-grow"
          >
        </template>
      </TripDetail>
    </div>


    
  </div>
</template>