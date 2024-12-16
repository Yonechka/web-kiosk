<script setup>
import { onMounted, ref } from 'vue';
import { useScheduleStore } from '../../store/ScheduleStore';
import { useStore } from '../../store/Store';

import departureCodes from '../../config/departureCodes';
import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';

const scheduleStore = useScheduleStore();
const store = useStore();
const isError = ref(false);
const isSpinner = ref(false);

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

onMounted(async () => {
  await fetchInitialData();
});

</script>

<template>
  <OverlaySpinner v-if="isSpinner" bg="bg-[#00000065]" :spinnerColor="colors.primaryColor" />
  <template v-if="scheduleStore.departurePools && scheduleStore.departurePools.length > 0">
    <div class="flex justify-center items-center text-3xl text-white capitalize ">
      <img src="../../assets/images/ic_location_boarding.png" class="mr-2">
      {{ scheduleStore?.departurePools.find(pool => pool.pool_code == departureCode).pool_name }}
    </div>
  </template>
</template>