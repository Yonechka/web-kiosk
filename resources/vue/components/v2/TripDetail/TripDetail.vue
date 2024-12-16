<script setup>
import { ref, onMounted, watch } from 'vue';
import { useScheduleStore } from '@/store/ScheduleStore';
import TripInfo from '@/components/v2/TripDetail/TripInfo.vue';
import PriceInfo from '@/components/v2/TripDetail/PriceInfo/index.vue';

const scheduleStore = useScheduleStore();
const tripInfo = ref(null);
const priceInfo = ref(null);

defineExpose({ tripInfo, priceInfo });

watch(() => tripInfo.value?.isTripInfoExpanded, () => {
  tripInfo.value?.isTripInfoExpanded ? priceInfo.value.isPriceInfoExpanded = false : ''
});

watch(() => priceInfo.value?.isPriceInfoExpanded, () => {
  priceInfo.value?.isPriceInfoExpanded ? tripInfo.value.isTripInfoExpanded = false : '';

  if (scheduleStore.isRoundedTrip) {
    priceInfo.value?.isPriceInfoExpanded ? tripInfo.value.isTripInfoExpandedReturn = false : '';
  }
});

onMounted(() => {
  console.log('tripInfo', tripInfo.value.isTripInfoExpanded);
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <TripInfo ref="tripInfo" />
    <slot />
    <PriceInfo ref="priceInfo"/>
    <slot name="bottom" />
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
