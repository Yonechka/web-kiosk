<script setup>
import { useTimestamp } from '@vueuse/core';
import { computed } from 'vue';
import NetworkIndicator from '../NetworkIndicator.vue';

const timestamp = useTimestamp({ interval: 10000 });

const timestampToTime = (timestamp) => {
  // Create a new Date object with the timestamp
  const date = new Date(timestamp);

  // Get hours, minutes, and seconds from the Date object
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Ensure two digits for hours, minutes, and seconds
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  // Return the time in "HH:MM" format
  return hours + ":" + minutes + ' WIB';
}

const timestampFormatted = computed(() => timestampToTime(timestamp.value))


</script>

<template>
  <div class=" p-5 w-full flex gap-[7.5px] items-center">
   <NetworkIndicator size="sm" />
   <div class=" font-semibold text-[#1F2937] text-xl leading-[0px]">
    {{ timestampFormatted }}
   </div>
  </div>
</template>