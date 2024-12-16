<template>
  <div class=" w-full flex justify-between font-medium">
    <span class="text-[#71747D] flex items-center">
      <slot name="label"></slot>
    </span>
    <span class=" text-[#1F2937]">
      <slot name="content"></slot>
    </span>
  </div>
</template>