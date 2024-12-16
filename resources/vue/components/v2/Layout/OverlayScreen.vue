<template>
  <div class="absolute w-full h-[100%] mx-auto flex" :class="`bg-[${colors.primaryColor}]`">
    <!-- Left Section -->
    <div class="w-[320px] flex flex-col justify-between h-full px-[45px]">
      <slot name="leftSection"></slot>
    </div>

    <!-- Right Section -->
    <div class=" w-[760px] h-full p-8">
      <slot name="rightSection"></slot>
    </div>
  </div>
</template>