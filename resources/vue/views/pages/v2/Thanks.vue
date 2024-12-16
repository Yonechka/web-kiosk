<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  useCompleted,
  usePrintTicket,
  useCalculateAge,
  useTNC,
  useScrollIndicator
} from '@/composeable/thanks';
import { useScheduleStore } from '@/store/ScheduleStore';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'; 
import OverlayScreen from '@/components/v2/Layout/OverlayScreen.vue';
import RightSection from '@/components/v2/Thank/RightSection/RightSection.vue';
import LeftSection from '@/components/v2/Thank/LeftSection.vue';

const scheduleStore = useScheduleStore();
const { t, d } = useI18n({ useScope: 'global' });
const { isPrinting, printTicket, rePrintTicket } = usePrintTicket(toast, t, d, true);

/* onMounted Hooks */
onMounted( async () => {
  if (!scheduleStore.printInfo) {
    printTicket();
  } else {
    setTimeout(() => {
      isPrinting.value = false;
    }, 1000 * 60);
  }
});
</script>

<template>
  <Teleport to='.appWrapper'>
    <OverlayScreen>
      <template #leftSection>
        <LeftSection/>
      </template>
      <template #rightSection>
        <RightSection/>
      </template>
    </OverlayScreen>
  </Teleport>
</template>