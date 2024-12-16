<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import Colors from '../../config/colors';
  
</script>
<template>
    <div class="w-[323px]" :class="`bg-[${colors?.secondaryColor}]`">
            <div class="flex flex-col">
                <div class="w-[294px] self-end">
                    <img src="../../assets/images/logo-blue-text.png" alt="" class="h-[130px] w-[123.36] mt-[67px] mx-auto">
                </div>
                
                <router-link :to="{ name: 'schedule' }" class="self-end cursor-default rounded-l-[26px] w-[294px] h-[150px] mt-[81.4px] flex items-center justify-center"
                :class="[ $route.name === 'schedule' ? 'active' : '', `text-[${colors.fontSecondaryColor200}]` ]">
                    <span class="font-bold text-[30px] ">Jadwal</span>
                </router-link>

                <router-link :to="{ name: 'reservation' }" class="self-end cursor-default rounded-l-[26px] w-[294px] h-[150px] flex items-center justify-center"
                :class="[ $route.name === 'reservation' ? 'active' : '', `text-[${colors.fontSecondaryColor200}]` ]">
                    <span class="font-bold text-[30px]">Pemesanan</span>
                </router-link>

                <div :class="[ $route.name === 'payment' ? 'active' : '', `text-[${colors.fontSecondaryColor200}]` ]" class="self-end cursor-default rounded-l-[26px] w-[294px] h-[150px] flex items-center justify-center">
                    <span class="py-[57px] font-bold text-[30px]">Pembayaran</span>
                </div>

                <router-link :to="{ name: 'completed' }" class="self-end cursor-default rounded-l-[26px] w-[294px] h-[150px] flex items-center justify-center"
                :class="[ $route.name === 'completed' ? 'active' : '', `text-[${colors.fontSecondaryColor200}]` ]">
                    <span class="py-[57px] font-bold text-[30px]">Selesai</span>
                </router-link>
            </div>
    </div>
</template>

<style scoped>
  .active {
    background: v-bind('colors.primaryColor');
    color:v-bind('colors.fontSecondaryColor');
  }
</style>

