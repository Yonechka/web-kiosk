<script setup>
const props = defineProps({
  imageSrc: String,
  code: String
});

const emits = defineEmits(['onClickVaHandler']);
const onClickVaHandler = (code) => {
  emits('onClickVaHandler', code);
}
</script>
<template>
  <div @click="onClickVaHandler(props.code)" class=" cursor-pointer rounded-xl w-full h-[115px] bg-white border border-[#E5E7EB] shadow flex justify-center items-center py-5 px-[17px]">
    <img
      :src="props.imageSrc"
      :alt="props.code"
      class=" w-full"
    >
  </div>
</template>