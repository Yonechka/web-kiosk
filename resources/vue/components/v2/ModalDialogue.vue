<script setup>
const emits = defineEmits(['onClickConfirm', 'onClickCancel']);
</script>

<template>
  <div class=" w-full h-full bg-[#000000b7] absolute top-0 left-0 flex items-center justify-center">
    <div class=" bg-white rounded-3xl p-10 w-[677px] flex flex-col gap-8">
        <!-- Header -->
        <div class=" font-semibold text-[#1F2937] text-2xl">
          <slot name="header">
            Konfirmasi Pilihan Anda
          </slot>
        </div> 

        <!-- Content -->
        <div class=" w-full text-[#71747D]">
          <slot name="content">
            This is Content
          </slot>
        </div>

        <!-- CTA -->
        <div class=" w-full flex gap-4 text-xl font-semibold">
          <button
            @click="emits('onClickCancel')"
            class=" w-full py-[17px] border rounded-2xl"
            :class="[`border-[${colors.primaryColor}] text-[${colors.primaryColor}]`]"
          >
            <slot name="cancelCta">
              Batal
            </slot>
          </button>
          <button
            @click="emits('onClickConfirm')"
            class=" w-full py-[17px] border rounded-2xl text-white"
            :class="[`bg-[${colors.primaryColor}]`]"
          >
            <slot name="confirmCta">
              Konfirmasi
            </slot>
          </button>
        </div>

        <slot name="bottomSection">

        </slot>
    </div>
  </div>
</template>