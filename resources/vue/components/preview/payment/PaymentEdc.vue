<script setup>
  import TripInformation from '../TripInformation.vue';
</script>

<template>
    <div class="absolute w-full pl-[45px] pr-[56px] h-[100%] mx-auto  bg-[#0055BA]">
        <div class="flex  mb-[25px] justify-between">
            <!-- navbar menu -->
            <div class="pt-[126px] ">
                <img src="../../../assets/images/logo-white-text.png" alt="" class="">
            </div>
            <TripInformation width="w-[525px]" />
        </div>
        <div class="w-full flex justify-end">
            <img src="../../../assets/images/payment/edc.png">
        </div>
        <div class="pb-[99px] pt-[35px] absolute bottom-0 left-0">
            <div class="flex items-center pr-[132px] py-[30px] w-[400px] rounded-r-[100px] bg-[#F18C33] ">
                <img src="../../../assets/images/left.png " class="pl-[30px]">
                <a href="#" class="font-semibold pl-[20px] text-[48px] text-[#FFFFFF]">Kembali</a>
            </div>
        </div>
    </div>
</template>