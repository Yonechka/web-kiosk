<script setup>
import { onActivated, onMounted, ref } from 'vue';
import { useReservationInitialData, useOnActivatedEvent, useVoucherCheck } from '@/composeable/reservation.js';
import { useScheduleStore } from '@/store/ScheduleStore';

import TripDetail from '@/components/v2/TripDetail/TripDetail.vue';
import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';
import VoucherCard from '@/components/daytrans/reservation/VoucherCard.vue';
import FormCard from '@/components/v2/Reservation/FormCard/FormCard.vue';
import ToastCustom from '@/components/daytrans/ToastCustom.vue';


const scheduleStore = useScheduleStore();
const { phoneNo, showToast, toastMessage, showSpinner } = useReservationInitialData();
const { clearVoucherHandler } = useVoucherCheck();
const tripDetail = ref(null);
const onClickFormCardShrinkHandler = () => {
  tripDetail.value.priceInfo.isPriceInfoExpanded = false;
  tripDetail.value.tripInfo.isTripInfoExpanded = false;
  tripDetail.value.tripInfo.isTripInfoExpandedReturn = false;
}

const { init } = useOnActivatedEvent();
onMounted(async () => {
  if (scheduleStore.appliedVoucher) {
    showSpinner.value = true;
    await clearVoucherHandler();
    showSpinner.value = false;
  }
  console.log('onMounted Reservation')
  init();
});

onActivated(async () => {
  console.log('onActivated Triggered')
  if (scheduleStore.appliedVoucher) {
    console.log('should reset voucher')
    showSpinner.value = true;
    await clearVoucherHandler();
    showSpinner.value = false;
  }
});

</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <Teleport to=".appWrapper">
      <transition>
        <ToastCustom
          type="failed"
          :title="$t('reservation.toast.bookingFailed')"
          :message="toastMessage"
          @closeToast="showToast = false"
          v-if="showToast"
        />
      </transition>
    </Teleport>

    <Teleport to='.appWrapper'>
      <OverlaySpinner bg="bg-[#00000060]" v-show="showSpinner"/>
    </Teleport>


    <TripDetail ref="tripDetail">
      <VoucherCard :phoneNo="phoneNo" />
    </TripDetail>
    <FormCard
      :tripDetail="tripDetail"
      @onClickFormCardShrink="onClickFormCardShrinkHandler"
      class=" flex-grow max-h-[662px]"
    />
  </div>
</template>

<style>
.expandAnimation {
  transition: height 0.3s ease-in-out;
}

.animateFade {
  transition: opacity 0.3s ease-in-out, height 0.3s ease-in-out, padding 0.3s ease-in-out;
}

.animateRotate {
  transition: transform 0.3s ease-in-out, padding 0.3s ease-in-out;
}
</style>
