<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  usePrintTicket,
} from '@/composeable/thanks';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'; 

import LanguageSelector from '@/components/LanguageSelector.vue';
import Spinner from '@/components/v2/common/Spinner.vue'

/* i18N */
const { t, d } = useI18n({ useScope: 'global' });

/* Print Ticket */
const { isPrinting, rePrintTicket } = usePrintTicket(toast, t, d, true);

/* CTA Props */
const reprintTicketProps = computed(() => {
  return {
    class: isPrinting.value ? 'bg-[#606060]' : 'bg-[#00990F]',
    function: () => isPrinting.value ? () => {} : rePrintTicket()
  }
});
</script>

<template>
  <div class=" w-full h-full flex flex-col justify-between pt-[100px]">
    <!-- Logo -->
    <img :src="images.logoSecondary" class="w-[160px] mx-auto" alt="Logo">

    <!-- Botton Section -->
    <div class=" flex flex-col gap-8">
      
      <!-- Language Selector -->
      <LanguageSelector dynamicClass="mb-6 py-[14.5px] rounded-[16px] px-3 text-base" />
      <!-- <div class=" w-fit mx-auto rounded-2xl text-[#1F2937] font-semibold text-base py-[14.5px] flex items-center px-3 gap-3 bg-white">
        <img src="@/assets/images/ic_indonesia_flag.svg" class=" rounded-full" alt="ic-indo">
        Bahasa Indonesia
      </div> -->

      <!-- Text Take Ticket -->
      <div class="text-center text-2xl font-semibold text-white px-10">
        {{ $t('thanks.takeTicket') }}
      </div>

      <!-- Reprint CTA -->
      <div
        id="btnReprintTicket"
        @click="reprintTicketProps.function"
        class=" w-fit mx-auto px-4 py-[10px] flex items-center gap-[4.81px] rounded-full text-white font-semibold"
        :class="[ reprintTicketProps.class ]"
      >
        <img src="@/assets/images/print.png" alt="ic-print">
        {{ $t('thanks.reprintTicket') }}
      </div>


      <div class=" w-full h-fit rounded-t-full bg-white pt-12">
        <!-- Arrow Bottom -->
        <div class=" w-[200px] h-[200px] p-[50px] mx-auto">
          <img src="@/assets/images/arrow-bottom.svg" alt="arrow-bottom.svg" class=" w-[100px] h-[100px]">
        </div>

        <!-- Spinner -->
        <div
          id="spinnerPrinting"
          class=" mt-[10px] mb-6 w-full flex items-center justify-center py-3 gap-3 text-[#1F2937] text-xl"
          :class="[ isPrinting ? 'opacity-1' : 'opacity-0' ]"
        >
          <Spinner/>
          {{ $t('thanks.processing')  }}
        </div>
      </div>
    </div>
  </div>
</template>