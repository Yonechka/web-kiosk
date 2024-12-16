
<script setup>
import { storeToRefs } from 'pinia';
import { useScheduleStore } from '@/store/ScheduleStore';
import { useRouter } from 'vue-router';
import { usePaymentSuccess } from '@/composeable/payment';
import useScrollIndicator from '@/composeable/useScrollIndicator.js';

import Button from '@/components/v2/Common/Button.vue';
import ShrinkCardOverlay from '@/components/v2/ShrinkCardOverlay.vue';


const router = useRouter();
const scheduleStore = useScheduleStore();
const props = defineProps({ tripDetail: Object });
const emits = defineEmits(['onClickFormCardShrink']);

const {
  bookingInfo,
} = storeToRefs(scheduleStore);

const { el, isScrollable } = useScrollIndicator();
const onClickFormCardShrink = () => {
  emits('onClickFormCardShrink');
}

/* Payment Sucess Countdown */
const { countDownDuration, toCompleted } = usePaymentSuccess(router);
</script>
<template>
  <div ref="el" class="max-h-[922px] overflow-y-hidden rounded-[35px] w-full bg-white relative" :class="`bg-[${colors.secondaryColor}]`">
    <!-- <Transition>
      <ShrinkCardOverlay @click="onClickFormCardShrink" v-show="isScrollable" />
    </Transition> -->
    <div class=" rounded-[35px]  p-8 flex flex-col gap-8 overflow-y-auto w-full h-full">
      <div
        class="border-1"
        :class="`border-[${colors.secondaryColor200}]`"
      >
          <div
            class="font-semibold text-2xl"
            :class="`text-[${colors.fontPrimaryColor}]`"
          >
            {{ $t('payment.paymentSuccessful') }}
          </div>
      </div>
      <div class="flex justify-between items-center">
          <div class="font-medium text-xl" :class="`text-[${colors.fontSecondaryColor300}]`">
            {{ $t('payment.bookingCode') }}
          </div>
          <div
            class="font-semibold text-xl"
            :class="`text-[${colors.fontPrimaryColor}]`"
          >
            {{ bookingInfo.booking_code }}
          </div>
      </div>

      <div class=" py-[106px] flex flex-col gap-8 items-center">
        <div class="flex justify-center">
              <img src="@/assets/images/payment/succeed.png" class=" w-[304px]">
        </div>
        <div
          class="flex justify-center text-base font-medium"
          :class="`text-[${colors.fontPrimaryColor}]`"
        >
          {{ $t('payment.countDownInfo') }}
        </div>
        <div class="flex justify-between items-center mx-auto p-[15px] w-32 gap-[11px] text-white rounded-full" :class="`bg-[${colors.primaryColor}]`">
            <img src="@/assets/images/payment/ic-clock.svg" class=" w-[37px]">
            <div
              class="text-4xl font-bold"
            >{{ countDownDuration }}</div>
        </div>
      </div>

      
      <Button
        @click="toCompleted"
      >
          {{ $t('payment.buttonComplete') }}
          <img src="@/assets/images/next.png" class=" w-6">
      </Button>
    </div>
  </div>
</template>