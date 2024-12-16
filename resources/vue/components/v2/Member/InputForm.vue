<script setup>
const props = defineProps({
  value: {
    type: String,
    default: null
  },
  placeHolder: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: null
  }
});


</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <!-- Label & Form -->
    <div>
      <div class=" text-xl text-[#1F2937] font-medium mb-3 leading-none">
        <slot name="label"></slot>
      </div>

      <div
        class=" w-full p-5 border border-[#71747D] rounded-2xl flex justify-between"
        :class="[props.value ? '' : 'text-[#555555]']"
      >
        <div class=" w-[90%] line-clamp-1 break-words">
          {{ props.value ?? props.placeHolder }}
        </div>
        
        <div class=" w-[10%] h-full flex justify-end items-center">
          <slot name="icon"></slot>
        </div>
      </div>
    </div>

    <span v-if="props.description" class=" italic text-[#71747D] leading-none">
      {{ props.description }}
    </span>

  </div>
</template>