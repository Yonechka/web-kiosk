<script setup>

const sizes = {
  sm: 'py-[10px] text-lg',
  md: 'py-[14px] text-2xl',
  lg: 'py-[27px] text-4xl'
};

const types = {
  primary: 'bg-[#00990F] text-white',
  secondary: 'bg-[#0055BA] text-white',
  disabled: 'bg-[#71747D] text-white',
  light: 'bg-white'
};

const props = defineProps({
  size: {
    type: String,
    default: 'md'
  },
  type: {
    type: String,
    default: 'primary'
  }
});


</script>

<template>
  <button
    class="w-full rounded-2xl text-center flex justify-center items-center gap-3"
    :class="[ sizes[props.size], types[props.type] ]"
  >
    <slot></slot>
  </button>
</template>