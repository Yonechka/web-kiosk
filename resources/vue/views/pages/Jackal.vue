<template>
    <div class="container mx-auto">
        <div class="mx-auto w-full lg:w-[1080px] flex">
            <!-- navbar menu -->
            <div class="flex w-[323px]">
                <div class="items-center">
                    <div class="flex flex-col items-center">
                        <img src="assets/img/gambar.png" alt="" class="h-[130px] w-[123.36] mt-[67px]">
                        <a href="#jadwal" class="rounded-l-[26px] bg-[#0055BA] px-[80px] py-[57px] mt-[81.4px] flex items-center justify-center">
                            <span class="font-bold text-[30px] text-white">Jadwal</span>
                        </a>
                        <a href="#pemesanan" class="pt-[57px]">
                            <span class="py-[57px] font-bold text-[30px] text-[#CCCCCC]">Pemesanan</span>
                        </a>
                        <a href="#pembayaran" class="pt-[114px]">
                            <span class="py-[57px] font-bold text-[30px] text-[#CCCCCC]">Pembayaran</span>
                        </a>
                        <a href="#selesai" class="pt-[114px]">
                            <span class="py-[57px] font-bold text-[30px] text-[#CCCCCC]">Selesai</span>
                        </a>
                    </div>
                </div>
            </div>

            <div class="w-full bg-[#0055BA]  pr-[56px]">
                <!-- Departure Component -->
                <div class="mt-[67px] rounded-[35px] w-full ml-8 bg-white h-[159px] md:grid-cols-6">
                    <div class="ml-[34px] pt-6 leading-[41.58px]  pr-[41.25px]">
                        <a class=" font-medium text-[36px]  text-[#000000]">Asal</a>
                        <div class="flex justify-between pt-[31px] -mt-[25px]">
                            <a href="#" class="text-[50px] font-bold text-[#000000]">
                                  Dipatiukur
                                </a>
                            <a href="#" class="font-bold text-[#0056A5] text-[30px]">
                                    UBAH
                                </a>
                        </div>
                    </div>
                </div>
                <!-- Destination Component -->
                <div class="mt-[24px] rounded-[35px]  w-full ml-8 bg-white h-[168px]">
                    <div class="ml-[34px] pt-6 leading-[41.58px] pr-[41.25px]">
                        <a class=" font-medium text-[36px]  text-[#000000]">Tujuan Kemana ?</a>
                        <div class="flex justify-between pt-[31px] -mt-[25px]">
                            <a href="#" class="text-[50px] font-bold text-[#000000]">
                              Blora
                            </a>
                            <a href="#" class="font-bold text-[#0056A5] text-[30px]">
                                UBAH
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Departure Date -->
                <div class="mt-[24px] rounded-[35px]  w-full ml-8 bg-white h-[165px]">
                    <div class="ml-[34px] pt-6 leading-[41.58px] pr-[41.25px]">
                        <a class=" font-medium text-[36px]  text-[#000000]">Kapan Berangkat ?</a>
                        <div class="flex justify-between pt-[31px] -mt-[25px]">
                            <a href="#" class="text-[50px] font-bold text-[#000000]">
                              Hari Ini
                            </a>
                            <a href="#" class="font-bold text-[#0056A5] text-[30px]">
                                UBAH
                            </a>
                        </div>
                    </div>
                </div>



                <div class="mt-[24px] rounded-[35px] w-full ml-8 bg-white h-[759px] mb-[530px] pr-[32px]">
                    <div class="flex justify-between pt-[31px]">
                        <p class="text-[#000000] text-[36px] pl-[38px]">Pilih Jam Pergi</p>
                        <img src="assets/img/vector.png" class="h-[36.66px] w-[36.66px]">
                    </div>
                    <div class="row mt-[29px] ">
                        <div class="grid xl:grid-cols-3 grid-cols-1 gap-20 px-[32px] ml-[38px]">
                            <div class="bg-[#F4F9FF] xl:w-[181px] pb-[22px] mr-[20px] rounded-[12px]">
                                <div class="h-[35px] w-[149px] bg-[#17706F] pb-[22px] mt-[10px] ml-[17px] leading-[23px] rounded-[8px]">
                                    <p class=" text-[#FFFFFF] text-[20px]  py-[6px] text-center">Segera Pergi</p>
                                </div>
                                <div class="text-center ">
                                    <span class="text-[46px] font-bold text-[#163F70] ">07:00</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">4</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] font-bold text-[#0056A5] ">Rp 100rb</span>
                                </div>
                            </div>

                            <!-- Grid 2 -->
                            <div class="bg-[#F4F9FF] pt-[29px] xl:w-[181px] pb-[22px] -ml-[20px] rounded-[12px]">
                                <div class="text-center">
                                    <span class="text-[46px] font-bold text-[#163F70] ">07:30</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">2</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] font-bold text-[#0056A5] price">Rp 150rb</span>
                                </div>
                            </div>

                            <!-- Grid 3 -->
                            <div class="bg-[#F4F9FF] pt-[29px] xl:w-[181px] pb-[22px] -ml-[40px] rounded-[12px]">
                                <div class="text-center ">
                                    <span class="text-[46px] text-[#163F70] font-bold">12:30</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">4</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] text-[#0056A5] font-bold">Rp 150rb</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Ke dua -->
                    <div class="row mt-[16px]">
                        <div class="grid xl:grid-cols-3 grid-cols-1 gap-20 px-[32px] ml-[38px]">
                            <!-- Grid 1 -->
                            <div class="bg-[#F4F9FF] pt-[29px] xl:w-[181px] pb-[22px] mr-[20px] rounded-[12px]">
                                <div class="text-center">
                                    <span class="text-[46px] font-bold text-[#163F70] ">10:00</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">8</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] font-bold text-[#0056A5] ">Rp 150rb</span>
                                </div>
                            </div>

                            <!-- Grid 2 -->
                            <div class="bg-[#F4F9FF] pt-[29px] xl:w-[181px] pb-[22px] -ml-[20px] rounded-[12px]">
                                <div class="text-center">
                                    <span class="text-[46px] text-[#163F70] font-bold">11:00</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">6</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] text-[#0056A5] font-bold">Rp 150rb</span>
                                </div>
                            </div>

                            <!-- Grid 3 -->
                            <div class="bg-[#F4F9FF] pt-[29px] xl:w-[181px] pb-[22px] -ml-[40px] rounded-[12px]">
                                <div class="text-center">
                                    <span class="text-[46px] text-[#163F70] font-bold">12:30</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">4</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] text-[#0056A5] font-bold">Rp 150rb</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Ke Tiga -->
                    <div class="row mt-[16px]">
                        <div class="grid xl:grid-cols-3 grid-cols-1 gap-20 px-[32px] ml-[38px] mb-[25px]">
                            <!-- Grid 1 -->
                            <div class="bg-[#F4F9FF] pt-[29px] xl:w-[181px] pb-[22px] mr-[20px] rounded-[12px]">
                                <div class="text-center">
                                    <span class="text-[46px] text-[#163F70] font-bold">13:00</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">8</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] text-[#0056A5] font-bold">Rp 150rb</span>
                                </div>
                            </div>

                            <!-- Grid 2 -->
                            <div class="bg-[#F4F9FF] pt-[29px] xl:w-[181px] pb-[22px] -ml-[20px] rounded-[12px]">
                                <div class="text-center">
                                    <span class="text-[46px] text-[#163F70] font-bold">14:00</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">8</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] text-[#0056A5] font-bold">Rp 150rb</span>
                                </div>
                            </div>

                            <!-- Grid 3 -->
                            <div class="bg-[#F4F9FF] pt-[29px] xl:w-[181px] pb-[22px] -ml-[40px] rounded-[12px]">
                                <div class="text-center">
                                    <span class="text-[46px] text-[#163F70] font-bold">16:00</span><br>
                                    <span class="mt-[11px] text-[24px] stok text-[#6C6C6C]">Sisa<strong class="mx-1 text-[#010101]">8</strong>Kursi</span><br>
                                    <span class="mt-[14px] text-[20px] text-[#0056A5] font-bold">Rp 100rb</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex  mb-[48px] items-center justify-center">
                    <div style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);
                    box-shadow: -5px 4px 9px 0px rgba(0, 0, 0, 0.20);" class=" send w-[303px] h-20 rounded-[30px] flex items-center justify-center ml-[54px]">
                        <a href="#" class="font-bold text-[#FFFFFF] text-[36px]">Kirim E-tiket</a>
                    </div>

                    <div style="background: linear-gradient(90deg, #FEA800 0%, #FE8900 68.02%, #FE6B00 97.19%);
                    box-shadow: -5px 4px 9px 0px rgba(0, 0, 0, 0.20);" class=" send w-[303px] h-20 rounded-[30px] flex items-center justify-center ml-[52px]">
                        <a href="#" class="font-bold text-[#FFFFFF] text-[36px]">Boarding</a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>