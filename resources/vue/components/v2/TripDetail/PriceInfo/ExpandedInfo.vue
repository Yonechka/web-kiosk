<script setup>
import { computed } from 'vue';

const props = defineProps({
  isContentMax: {
    type: Boolean,
    default: false,
  }
});

const dynamicClass = computed(() => {
  return {
    content: props.isContentMax ? 'h-[276px] overflow-y-auto' : 'h-fit'
  }
});

</script>

<template>
  <div>
    <!-- Tag -->
    <div class=" flex items-center justify-between">
      <div class=" px-3 py-2 bg-[#FFE500] flex items-center gap-1 text-sm font-semibold w-fit rounded-xl justify-between">
        <slot name="tag"></slot>
      </div>

      <slot name="tagRightSide"></slot>
    </div>
    
    
    <!-- Content -->
    <div class=" mt-3" :class="[ dynamicClass.content ]">
      <slot></slot>
    </div>
  </div>
</template>