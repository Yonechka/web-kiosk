<script setup>
import { ref } from 'vue';
import {
  useCompletedInitialData,
  useToast,
} from '@/composeable/completed';

import TripDetail from '@/components/v2/TripDetail/TripDetail.vue';
import FormCard from '@/components/v2/Completed/FormCard.vue';
import ToastCustom from '@/components/daytrans/ToastCustom.vue';
import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';

/* Initial Data */
const { showSpinner } = useCompletedInitialData();

/* Toast */
const { showToast, showToastEmptyForm } = useToast();

/* Shrink Card Handler */
const tripDetail = ref(null);
const onClickFormCardShrinkHandler = () => {
  tripDetail.value.priceInfo.isPriceInfoExpanded = false;
  tripDetail.value.tripInfo.isTripInfoExpanded = false;
  tripDetail.value.tripInfo.isTripInfoExpandedReturn = false;
}
</script>

<template>
    <teleport to='.appWrapper'>
      <transition>
        <ToastCustom
          type="failed"
          title="Gagal Update Booking, Silahkan Coba Lagi!"
          @closeToast="showToast = false"
          v-if="showToast"
        />
      </transition>
    </teleport>

    <teleport to='.appWrapper'>
      <transition>
        <ToastCustom
          type="failed"
          :title="$t('completed.toastInvalidForm')"
          @closeToast="showToastEmptyForm = false"
          v-if="showToastEmptyForm"
        />
      </transition>
    </teleport>
    <OverlaySpinner bg="bg-[#00000060]" v-show="showSpinner"/>

    <div class=" w-full h-full flex flex-col gap-8">
      <TripDetail ref="tripDetail" />
      <FormCard
        :tripDetail="tripDetail"
        @onClickFormCardShrink="onClickFormCardShrinkHandler"
      />
    </div>
    

</template>

<style scoped>
  :root {
    /* --dp-menu-min-width: 692px; */
    --dp-cell-size: 70px;
  }

  .dp__menu {
    border: 0;
    min-width: 100% !important;
  }

  .dp__month_year_row {
    justify-content: center;
    margin-bottom: 15px;
  }

  .dp__month_year_wrap {
    width: 230px;
  }

  .dp__calendar_header {
    justify-content: space-around;
  }

  .dp__calendar_header_separator {
    height: 0;
  }

  .dp__calendar_header_item {
    font-size: 30px;
    flex-grow: 0;
    width: 80px;
    height: auto;
    padding: 10px 0px 10px 0px;
  }

  .dp__calendar_item {
    flex-grow: 0;
  }

  .dp__calendar_row {
    justify-content: space-around;
  }

  .dp__cell_inner {
    padding: 0;
    border: 2px solid v-bind('colors.secondaryColor200');
    border-radius: 12px;
    margin: 0px 0px 20px 0px;
    font-size: 28px;
    font-weight: bold;
    width: 70px !important;
    height: 70px !important;
  }

  .dp__month_year_select {
    font-size: 32px;
    font-weight: bold;
  }
</style>