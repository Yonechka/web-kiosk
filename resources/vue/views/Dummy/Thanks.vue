<script setup>
  import QrcodeVue from 'qrcode.vue'
  import TripInformation from '../../components/jackal/dummy/TripInformation.vue';
  import { ref, onMounted, watch } from 'vue';
  import { useScheduleStore } from '../../store/ScheduleStore';
  
  const scheduleStore = useScheduleStore();

  const isTnC = ref(false);
  const TnCModal = () => {
    isTnC.value = !isTnC.value;
  }

  const tnc = await scheduleStore.tnc();

  const today = ref(new Date());
  const reducedYears = ref(new Date());
  reducedYears.value.setFullYear(new Date().getFullYear() - 2);
  const longName = ref('HMHMHMHMHMHMHMHMHMHMHMHMHMHM');

  const passengersWrapper = ref(null);
  const isScrollMax = ref(false);
  const scrollPassengersWrapper = () => {
    isScrollMax.value = passengersWrapper.value.scrollTop + passengersWrapper.value.clientHeight >= passengersWrapper.value.scrollHeight - 25;
    // console.log(isScrollMax.value);
  }
  const scrollBottom = () => {
    passengersWrapper.value.scrollTop += 25;
  }
  onMounted(() => {
    console.log(passengersWrapper.value.scrollHeight);
  })
</script>

<template>
  <Teleport to='.appWrapper'>
        <div class="absolute w-full h-[100%] mx-auto  bg-[#0055BA]">
            <div class="flex pl-[45px] pr-[56px] justify-between mb-[120px]">
                <!-- navbar menu -->
                <div class="pt-[73px] ">
                    <img src="../../assets/images/logo-white-text.png">
                </div>

                <!-- Trip Info -->
                <TripInformation width="w-[525px]" height="h-[auto]">
                    <template #detail>
                        <div class="flex justify-between items-center mb-[10px]">
                            <div class="font-medium text-[19px] text-[#000000]">Nama Pemesan</div>
                            <div class="font-medium text-[19px] text-[#000000]"> Friendly Sitepu </div>
                        </div>
                        <div class="flex justify-between items-center mb-[10px]">
                            <div class="font-medium text-[19px] text-[#000000]">Email Pemesan</div>
                            <div class="font-medium text-[19px] text-[#000000]">Friendly@gmail.com</div>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="font-medium text-[19px] text-[#000000]">Kode Booking</div>
                            <div class="font-medium text-[19px] text-[#000000]">JHG3U39439JF</div>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="font-medium text-[19px] text-[#000000]">Kode OTP</div>
                            <div class="font-medium text-[19px] text-[#000000]">5577374</div>
                        </div>
                        <div class="font-medium text-xl mt-[20px] mb-[14px] text-[#717171]">Detail Penumpang</div>
                        <div @scroll="scrollPassengersWrapper" class="max-h-[242px] overflow-auto w-full relative" ref="passengersWrapper">
                            <div class="mb-[14px] border-[1px] border-[#C6C6C6] w-full h-[114px] p-[10px] rounded-[12px] relative">
                                <div class="flex">
                                    <div class="font-medium w-[111px] text-[19.46px] text-[#717171] mb-[3px]">Nama</div>
                                    <div class="font-semibold text-[19.46px]">: Friendly (Kursi 2)</div>
                                </div>
                                <div class="flex">
                                    <div class="font-medium w-[111px] text-[19.46px] text-[#717171] mb-[3px]">Bayi</div>
                                    <div class="font-semibold text-[19.46px]">: Kelvin (1 Tahun)</div>
                                </div>
                                <div class="flex">
                                    <div class="font-medium w-[111px] text-[19.46px] text-[#717171] mb-[3px]">Kode Tiket</div>
                                    <div class="font-semibold text-[19.46px]">: FDJ437FDE</div>
                                </div>

                                <img src="../../assets/images/qrcode-dummy.png" class="w-[94px] absolute right-[10px] top-[10px]">
                            </div>
                            <div class="mb-[14px] border-[1px] border-[#C6C6C6] w-full h-[114px] p-[10px] rounded-[12px] relative">
                                <div class="flex">
                                    <div class="font-medium w-[111px] text-[19.46px] text-[#717171] mb-[3px]">Nama</div>
                                    <div class="font-semibold text-[19.46px]">
                                        : <span v-if="longName.length > 6">
                                            {{ longName.slice(0, 6) + "..." }}
                                          </span>
                                          <span v-else>
                                            {{ longName }}
                                          </span>(Kursi 2)
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="font-medium w-[111px] text-[19.46px] text-[#717171] mb-[3px]">Bayi</div>
                                    <div class="font-semibold text-[19.46px]">: Kelvin (1 Tahun)</div>
                                </div>

                                <QrcodeVue value="test" size="94" class="absolute right-[10px] top-[10px]"  />
                            </div>
                            <div class="mb-[14px] border-[1px] border-[#C6C6C6] w-full h-[114px] p-[10px] rounded-[12px] relative">
                                <div class="flex">
                                    <div class="font-medium w-[111px] text-[19.46px] text-[#717171] mb-[3px]">Nama</div>
                                    <div class="font-semibold text-[19.46px]">: Friendly (Kursi 2)</div>
                                </div>
                                <div class="flex">
                                    <div class="font-medium w-[111px] text-[19.46px] text-[#717171] mb-[3px]">Bayi</div>
                                    <div class="font-semibold text-[19.46px]">
                                        : <span v-if="longName.length > 6">
                                            {{ longName.slice(0, 6) + "..." }}
                                          </span>
                                          <span v-else>
                                            {{ longName }}
                                          </span>(1 Tahun)
                                    </div>
                                </div>

                                <img src="../../assets/images/qrcode-dummy.png" class="w-[94px] absolute right-[10px] top-[10px]">
                            </div>
                            <div v-show="!isScrollMax" class="absolute bottom-0 w-full h-[43px]">
                                <div
                                  class="fixed bg-[white] w-[442px] h-[43px] flex justify-center items-end"
                                  style="
                                    background: rgb(221,221,221);
                                    background: linear-gradient(0deg, rgba(221,221,221,1) 0%, rgba(245,255,255,1) 0%, rgba(0,207,215,0) 100%);
                                  ">
                                    <div @click="scrollBottom" class="w-[35px] h-[35px] rounded-[50%] bg-[#0055BA] flex justify-center items-center">
                                        <img src="../../assets/images/arrow-bottom-white.png" alt="" srcset="">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-full h-[auto] bg-[#F4F9FF] p-[10px] rounded-[12px] mt-[20px]">
                            <div class="font-medium text-[18px] text-[#717171] flex items-center mb-[14px]">
                                <img src="../../assets/images/information_ic.png" class="mr-[10px]"> Detail Penumpang
                            </div>
                            <div class="font-medium text-[16px] text-[#F18C33] leading-[18.48px]">
                                Pastikan penumpang sudah melakukan boarding di point keberangakatan paling lambat 20 menit sebelum keberangkatan ...
                            </div>
                            <button @click="TnCModal"
                              class="w-full py-[10px] text-[#0055BA] rounded-[12px] mt-[14px]
                                text-[16px] font-medium text-center border-[1px] border-[#0055BA]">
                                Baca lebih detail
                            </button>
                        </div>
                    </template>
                </TripInformation>
            </div>


            <div class="mt-[47px] absolute bottom-0 w-full">
                <div class="container justify-between flex items-center">
                    <div class="flex items-center">
                        <div class="mr-[24px] flex flex-wrap justify-center items-start pt-[57px] w-[231px] h-[396px] rounded-t-[116px] bg-[#fff] ml-[45px]">
                            <img src="../../assets/images/arrow-bottom-orange.png">
                            <div class="font-semibold text-[24px] text-center text-[#F18C33] mt-[36px]">
                                Sedang Memproses
                            </div>
                        </div>
                        <div
                          class="py-[10px] px-[16px]
                            rounded-[25px]
                            h-[47.63px]
                            flex items-center bg-[#606060]
                            text-[16px] text-white">
                        <img class="mr-[10px]" src="../../assets/images/print.png">
                        Cetak Ulang Tiket
                        </div>
                    </div>
                    <div class="items-center justify-center  w-[337px] pb-[30px]">
                        <div @click="complete" class="flex items-center justify-center py-[30px] rounded-l-full bg-[#F18C33]">
                            <div class="font-semibold text-[48px] text-[#FFFFFF] flex justify-center w-full relative">
                                <span class="ml-[20px]">Selesai</span>
                            </div>
                            <img src="../../assets/images/next2.png" class="mr-[20px]">
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </Teleport>

  <!-- TNC -->
  <Teleport to='.appWrapper'>
      <Transition :duration="350" name="nested">
        <div v-show="isTnC" class="w-full h-full absolute top-0 flex justify-end items-center z-[100]">

          <div @click="TnCModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
          <div class="inner flex z-[99]">
              <div @click="TnCModal" class="bg-[#C66C6C] cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
                  <img src="./../../assets/images/x.png" class="">
              </div>
                
              <div v-html="tnc.data" class="w-[755px] pt-[49px] pl-[64px] pr-[32px]  bg-white rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[1509px]  relative">
              </div>
          </div>
        </div>
      </Transition>
  </Teleport>

  <!-- Reprint Ticket -->

</template>

<style>
   .inner p {
    font-size: 36px !important;
    font-weight: 400 !important;
    text-align: left !important;
    line-height: 41px !important;
    margin-bottom: 30px !important;
  }

  .inner li {
    list-style-type: decimal !important;
    font-size: 19.46px !important;
    margin-bottom: 15px !important;
  }
   .inner p strong {
    font-weight: 400 !important;
   }
</style>