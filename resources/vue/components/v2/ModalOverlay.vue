<script setup>
const emits = defineEmits(['onClickCloseModalHandler']);

const onClickCloseModalHandler = () => {
  emits('onClickCloseModalHandler');
}
</script>

<template>
  <div class=" w-full h-full absolute top-0 left-0 flex justify-end items-center gap-[121px] z-[21]">
    <div @click="onClickCloseModalHandler" class="  bg-[#000000be] w-full h-full absolute top-0 left-0">
    </div>
    
    <img @click="onClickCloseModalHandler" src="@/assets/images/ic-close-modal.png" alt="ic-close-modal" class=" z-10 cursor-pointer">

    <div class=" w-fit h-fit z-10 relative">
      <slot></slot>
    </div>
    
  </div>
</template>