
<script setup>

  const props = defineProps({
    width: {
      type: String,
      default: 'w-[full]'
    },
    height: {
      type: String,
      default: 'h-[auto]'
    }
  });
</script>

<template>
    <div class="rounded-[35px] mt-[67px] relative">
        <div :class="[props.width, props.height]"  
            class="rounded-[35px] px-[35px] bg-white flex flex-col pt-[32px] pb-[35px]">
        <div class="flex">
            <div class="mt-[15px] mr-[10px]">
                <div class="h-[17px] w-[17px] rounded-full bg-[#FD0000] "></div>
                <img src="../../../assets/images/reservation/arrow.png" class="pl-[6px]">
                <div class="h-[17px] w-[17px] rounded-full bg-[#D9D9D9]"></div>
            </div>

            <!-- Route -->
            <div>
                <div class="font-bold text-[24px] text-[#0e0808]">Dipatiukur</div>
                <div class="text-[19px] text-[#6B6B6B] font-normal">Dipatiukur Pusat Bandung</div>
                <div class="flex pt-[30px] items-center">
                    <div class="text-[22px] text-[#0055BA] font-bold">14 Maret 2023</div>
                    <div class="flex items-center pl-[17px]">
                        <div class="h-[17px] w-[17px] rounded-full bg-[#CFE5FF]"></div>
                        <div class="text-[22px] text-[#0055BA] font-bold pl-[19px]">13:00</div>
                    </div>
                </div>
                <div class="font-bold pt-[25px] text-[24px]">Blora</div>
                <div class="font-normal text-[19px] text-[#6B6B6B]">Jalan Blora Jakarta</div>
            </div>
        </div>

        <div class="w-full mt-[20px]">
            <!-- Pricing -->
            <div class="flex justify-between items-center">
                <div class="font-medium text-[19px] text-[#000000]">Harga Kursi</div>
                <div class="font-medium text-[19px] text-[#000000]">Rp. 150.000 </div>
            </div>
            <div class="flex justify-between items-center  pt-[9px]">
                <div class="font-medium text-[19px] text-[#000000]">Jumlah Kursi</div>
                <div class="font-medium text-[19px] text-[#000000]">1 Kursi</div>
            </div>
            <div class="flex justify-between items-center  pt-[5px]">
                <div class="font-bold text-[29px] text-[#000000]">Total</div>
                <div class="font-bold text-[29px] text-[#000000]">Rp. 150.000 </div>
            </div>

            <!-- Customer Detail -->
            <div class="font-medium text-xl pt-[20px] text-[#717171]">Detail Pemesanan</div>
            <div class="flex justify-between items-center mb-[10px] mt-[14px]">
                <div class="font-medium text-[19px] text-[#000000]">Nomor Telepon</div>
                <div class="font-medium text-[19px] text-[#000000]"> 086456456465 </div>
            </div>
            <slot name="detail"></slot>
        </div>
        </div>
    </div>
</template>