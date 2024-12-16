<script setup>
</script>

<template>
    <div class="rounded-[35px] px-[35px] w-[534px] h-[auto] bg-white flex flex-wrap pt-[32px] pb-[35px] mb-[60px] mt-[67px]">
            <div class="mt-[15px] mr-[10px]">
                <div class="h-[17px] w-[17px] rounded-full bg-[#FD0000] "></div>
                <img src="../../../assets/images/reservation/arrow.png" class="pl-[6px]">
                <div class="h-[17px] w-[17px] rounded-full bg-[#D9D9D9]"></div>
            </div>

            <!-- Route -->
            <div>
                <div class="font-bold text-[24px] text-[#0e0808] pt-[7px]">{{ scheduleStore.detailBoarding.asal }}</div>
                <!-- <div class="text-[19px] text-[#6B6B6B] font-normal">Dipatiukur Pusat Bandung</div> -->
                <div class="font-bold pt-[120px] text-[24px]">{{ scheduleStore.detailBoarding.tujuan }}</div>
                <!-- <div class="font-normal text-[19px] text-[#6B6B6B]">Jl Blora</div> -->
            </div>

            <div class="flex pt-[30px] items-center">
                <div class="text-[22px] text-[#0055BA] font-bold">{{ scheduleStore.detailBoarding.jam_berangkat }}</div>
                <div class="flex items-center pl-[17px]">
                    <div class="h-[17px] w-[17px] rounded-full bg-[#CFE5FF]"></div>
                    <div class="text-[22px] text-[#0055BA] font-bold pl-[19px]">{{ scheduleStore.detailBoarding.tgl_berangkat }}</div>
                </div>
            </div>

            <div class="w-full mt-[20px]">
                <!-- Customer Detail -->
                <div class="font-medium text-xl pt-[20px] text-[#717171]">Detail Pemesanan</div>
                <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px] text-[#000000]">Nama</div>
                    <div class="font-medium text-[19px] text-[#000000]"> {{ scheduleStore.detailBoarding.penumpang.nama }} </div>
                </div>
                <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px] text-[#000000]">Nomor Telepon</div>
                    <div class="font-medium text-[19px] text-[#000000]">{{ scheduleStore.detailBoarding.penumpang.no_telepon }}</div>
                </div>
                <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px] text-[#000000]">Kode Booking</div>
                    <div class="font-medium text-[19px] text-[#000000]">{{ scheduleStore.detailBoarding.kode_booking }}</div>
                </div>
                <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px] text-[#000000]">Nomer Tiket</div>
                    <div class="font-bold text-[19px] text-[#000000]">{{ scheduleStore.detailBoarding.no_tiket }}</div>
                </div>
                <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px] text-[#000000]">Posisi Duduk</div>
                    <div class="font-bold text-[19px] text-[#000000]">Kursi {{ scheduleStore.detailBoarding.no_kursi }}</div>
                </div>
            </div>
    </div>
</template>