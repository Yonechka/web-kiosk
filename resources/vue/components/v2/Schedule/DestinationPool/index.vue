<script setup>
  import { watch, ref, reactive, onMounted, computed, toRefs, toRef, onActivated, nextTick } from 'vue';
  import { storeToRefs } from 'pinia';
  import { cutString } from '@/utils'
  import { useStore } from '@/store/Store';
  import { useScheduleStore } from '@/store/ScheduleStore';
  import {
    useMapModal,
    useSelectPool,
    useDestinationInitialData,
    useExpandPoolWrapper,
    useDestinationOnMountedEvent,
    useDestinationOnActivatedEvent
  } from '@/composeable/schedule.js';

  import SelectOutlet from '@/components/v2/Schedule/SelectOutlet.vue';
  import ListOutlet from '@/components/v2/Schedule/DestinationPool/ListOutlet.vue';


  const scheduleStore = useScheduleStore();
  const { selectedDestinationPool } = storeToRefs(scheduleStore);

  /* Initial Data */
  const {
    showSelectDestinationModal,
  } = useDestinationInitialData();

  /* Emits */
  const emits = defineEmits(['backToSelectTime']);

  

</script>

<template>
  <SelectOutlet
    class=" mt-8"
    id="destinationOutletName"
    v-show="!showSelectDestinationModal"
    @onClickChangeBtn="showSelectDestinationModal = true"
    :outletName="selectedDestinationPool?.destination_pool"
    label="schedule.destinationPool.whereToGo"
  />
  <ListOutlet
    @backToSelectTime="emits('backToSelectTime')"
    v-show="showSelectDestinationModal"
  />
</template>