<script setup>
import { useNetwork } from '@vueuse/core'
import { computed } from 'vue'; 

const props = defineProps({
  size: {
    type: String,
    default: 'lg'
  }
});

const { isOnline, rtt } = useNetwork();

const indicatorColor = computed(() => {
  if (!isOnline.value) return 'bg-[#71747D]';

  if (rtt.value <= 100) return 'bg-[#22C55E]';

  if (rtt.value <= 300) return 'bg-[#3B82F6]';

  if (rtt.value <= 600) return 'bg-[#FACC15]';

  return 'bg-[#EF4444]';
});

const size = () => props.size == 'lg' ? 'w-5 h-5' : 'w-3 h-3';

</script>

<template>
  <div
    class="rounded-full border-[1px] border-[white]"
    :class="[indicatorColor, size()]"
  ></div>
</template>