<script setup>
import IcDeparturePrice from '@/components/v2/ic/IcDeparturePrice.vue';
import IcDestinationPrice from '@/components/v2/ic/IcDestinationPrice.vue';

const props = defineProps({
  isReturn: {
    type: Boolean,
    default: false
  }
});

const logoLabel = props.isReturn ? IcDestinationPrice : IcDeparturePrice;
</script>

<template>
  <div
    class=" bg-[#FFE500] text-[#1F2937] leading-none rounded-lg px-2 py-[6px] flex items-center font-semibold text-base gap-3"
  >
    <component :is="logoLabel" class=" w-5 h-5" />
    {{ props.isReturn ? $t('schedule.times.departureReturn') : $t('schedule.times.departure') }}
  </div>
</template>