<template>
  <div class=" w-full flex flex-col gap-[27px] bg-white rounded-[35px] p-8">
    <div>
      <div class=" text-[32px] font-bold text-[#1F2937]">
        <slot name="header"></slot>
      </div>
      <div class=" text-xl font-medium text-[#71747D]">
        <slot name="description"></slot>
      </div>
    </div>
  
    <div class=" w-full h-fit flex flex-col gap-8">
      <slot></slot>
    </div>
  </div>
</template>