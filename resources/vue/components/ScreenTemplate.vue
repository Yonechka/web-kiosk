<script setup>
import OutletLocation from '@/components/daytrans/OutletLocation.vue';
import LanguageSelector from '@/components/LanguageSelector.vue';

const props = defineProps({
  title: String,
  showOutlet: {
    type: Boolean,
    default: true
  }
});


</script>

<template>
    
    <div class="w-full h-full absolute pt-[240px] z-[99]" :class="`bg-[${colors.primaryColor}]`">
      <LanguageSelector dynamicClass="rounded-[30px] z-10 py-6 px-8 text-[32px] absolute top-[80px] right-[80px] z-[100]" />
      <div class=" flex justify-center items-center flex-col">
        <img :src="images.logoSecondary" class="mx-auto w-[377px] mb-6">
        <OutletLocation v-if="props.showOutlet" />
        <h1 class=" text-[64px] font-bold mx-auto text-white mt-16">
          {{ props.title }}
        </h1>
      </div>

      <slot></slot>
    </div>
</template>