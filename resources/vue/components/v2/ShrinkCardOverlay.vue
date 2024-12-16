<template>
  <div class="w-full h-full z-10 cursor-pointer absolute top-0 letf-0 bg-[#000000A6] flex items-center justify-center text-lg text-white">
      <div class=" flex items-center text-[#1F2937] font-medium gap-1 bg-white rounded-full px-3 py-[6px]">
          <slot>
            <img src="@/assets/images/ic-touch.svg" alt="ic-touch">
            <span>
              Sentuh untuk memperbesar
            </span>
          </slot>
      </div>
  </div>
</template>