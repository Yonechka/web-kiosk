<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBookingTicket } from '@/composeable/reservation.js';
import useScrollIndicator from '@/composeable/useScrollIndicator.js';
import { useRouter } from 'vue-router';

import NumPad from '@/components/v2/Reservation/FormCard/NumPad.vue';
import Button from '@/components/v2/Common/Button.vue';
import ShrinkCardOverlay from '@/components/v2/ShrinkCardOverlay.vue';

const router = useRouter();
const props = defineProps({ tripDetail: Object });
const emits = defineEmits(['onClickFormCardShrink']);

const numpad = ref(null);

const { bookingTicket } = useBookingTicket(router);
const btnProps = computed(() => {
  return {
    action: numpad?.value?.phoneNo?.length >= 9 ? () => bookingTicket() : () => console.log('lower than nine'),
    type: numpad?.value?.phoneNo?.length >= 9 ? 'primary' : 'disabled'
  }
});

const { el, isScrollable } = useScrollIndicator();
const onClickFormCardShrink = () => {
  emits('onClickFormCardShrink');
}



</script>

<template>
  <div ref="el" class=" w-full bg-white rounded-[35px] overflow-hidden relative">
    <!-- <Transition>
      <ShrinkCardOverlay @click="onClickFormCardShrink" v-show="isScrollable" />
    </Transition> -->
    <div class=" w-full h-full rounded-[35px] overflow-y-auto p-8 flex flex-col gap-6">
      <span class=" font-medium text-2xl text-[#1F2937]">
        {{ $t('reservation.form.reservationInformation') }}
      </span>
      <NumPad ref="numpad" />
      <Button
        id="btnToPayment"
        @click="btnProps.action"
        :type="btnProps.type"
      >
        {{ $t('reservation.form.continue') }}
        <img src="@/assets/images/next.png" alt="next" class=" w-6">
      </Button>
    </div>
  </div>
</template>

<style scoped>
.horizontal-center-absolute {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>