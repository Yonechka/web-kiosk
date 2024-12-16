<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  
  const route = useRoute()
  onMounted(() => {
    const departureCode = route.params.departureCode;
    localStorage.setItem('departureCode', departureCode);
  });
</script>

<template>
  <Teleport to='.appWrapper'>
    <div class="w-full h-full absolute flex flex-col items-center">
        <img src="./../../../assets/images/logo-blue-text.png" class="mt-[137px] z-[20] relative w-[427px]">
        <router-link :to="{ name: 'schedule' }" class="w-[427px] h-[126px] font-bold mt-[128px] flex justify-center items-center z-[20] rounded-[30px] text-[50px]" :class="`text-[${colors.fontSecondaryColor}]`"
            style="background: linear-gradient(90deg, #00A4BA 0%, #006CBA 68.02%, #0061BA 97.19%);"
        >
            Pesan Tiket
        </router-link>
        <div class="orangeButtonWrapper mt-[68px] z-[20] flex ">
            <router-link :to="{ name: 'sendEticket' }" class="w-[427px] h-[126px] mr-[66px] font-bold flex justify-center items-center z-[20] rounded-[30px] text-[50px]" :class="`text-[${colors.fontSecondaryColor}]`"
              style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);"
            >
              Kirim E-tiket
            </router-link>
            <router-link :to="{ name: 'boarding' }" class="w-[427px] h-[126px] font-bold flex justify-center items-center z-[20] rounded-[30px] text-[50px]" :class="`text-[${colors.fontSecondaryColor}]`"
              style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);"
            >
              Boarding
            </router-link>
        </div>
        <img src="./../../../assets/images/idle.png" class="absolute top-0 left-0 z-[10]">
    </div>
    
  </Teleport>
</template>