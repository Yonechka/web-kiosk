<script setup>
const emits = defineEmits(['onClickModal'])
const modalClickHandler = () => {
  emits('onClickModal')
}
</script>

<template>
  <div class="w-full absolute h-full  flex justify-end items-center z-[100]">
    <div @click="modalClickHandler" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
    <div class="inner flex z-[99]">
      <div @click="modalClickHandler" class="bg-[#C66C6C] flex justify-center items-center z-[100] cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
        <img src="@/assets/images/x.png" class="">
      </div>
      <div
        class="w-[755px] py-[49px] rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[1400px] pl-[38px] relative"
        :class="`bg-[${colors.secondaryColor}]`"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>