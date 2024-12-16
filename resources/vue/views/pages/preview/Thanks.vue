<script setup>
  import { storeToRefs } from 'pinia';
  import { ref, onMounted } from 'vue';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useStore } from '../../../store/Store';
  import { useRouter } from 'vue-router';
  import { printFormat } from '../../../utils';
  import { 
    useCompleted,
    usePrintTicket,
    useCalculateAge,
    useTNC,
    useScrollIndicator
  } from '../../../composeable/thanks';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css'; 

  import TripInformation from '../../../components/jackal/TripInformation.vue';
  import QrcodeVue from 'qrcode.vue';

  const scheduleStore = useScheduleStore();
  const store = useStore();
  const router = useRouter();

  /* Complete Button Handler */
  const { complete } = useCompleted(router);

  /* Print Ticket */
  const { isPrinting, printTicket, rePrintTicket } = usePrintTicket(toast);

  /* Calculating Infant Age */
  const { calculateAge } = useCalculateAge();

  /* TnC */
  const { isTnC, tnc, TnCModal, tncInit } = useTNC();
  await tncInit();

  /* Scroll Indicator */
  const { passengersWrapper, isScrollMax, scrollPassengersWrapper, scrollBottom } = useScrollIndicator();

  /* onMounted Hooks */
  onMounted( async () => {
    printTicket();
  });
</script>

<template>
    <Teleport to='.appWrapper'>
        <div class="absolute w-full h-[100%] mx-auto" :class="`bg-[${colors.primaryColor}]`">
            <div class="flex pl-[45px] pr-[56px] justify-between mb-[120px]">
                <!-- navbar menu -->
                <div class="pt-[73px]  ">
                    <img class="w-[239px]" src="../../../assets/images/logo-white-text.png">
                </div>

                <!-- Trip Info -->
                <TripInformation width="w-[600px]" height="h-[auto]">
                    <template #detail>
                        <div class="flex justify-between items-center mb-[10px]">
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">Nama Pemesan</div>
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                              <span v-if="scheduleStore.customerInfo.name.length > 12">
                                {{ scheduleStore.customerInfo.name.slice(0, 12) + "..." }}
                              </span>
                              <span v-else>
                                {{ scheduleStore.customerInfo.name }}
                              </span>
                            </div>
                        </div>
                        <div v-if="scheduleStore.customerInfo.email != 'Masukkan Email' || scheduleStore.customerInfo.email === null" class="flex justify-between items-center mb-[10px]">
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">Email Pemesan</div>
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                              <span v-if="scheduleStore.customerInfo.email.length > 12">
                                {{ scheduleStore.customerInfo.email.slice(0, 12) + "..." }}
                              </span>
                              <span v-else>
                                {{ scheduleStore.customerInfo.email }}
                              </span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mb-[10px]">
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">Kode Booking</div>
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ scheduleStore.bookingInfo.booking_code }}</div>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">Kode OTP</div>
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ scheduleStore.updateBookingInfo.otp }}</div>
                        </div>

                        <!-- Passengers Detail -->
                        <div
                          class="font-medium text-xl mt-[20px] mb-[14px]"
                          :class="`text-[${colors.fontSecondaryColor300}]`"
                        >Detail Penumpang</div>
                        <div @scroll="scrollPassengersWrapper" ref="passengersWrapper" class="max-h-[242px] overflow-auto w-full relative">
                            <div
                              v-for="passenger in scheduleStore.updateBookingSeats"
                              class="mb-[14px] border-[1px] w-full h-[114px] p-[10px] rounded-[12px] relative"
                              :class="`border-[${colors.secondaryColor200}]`"
                            >
                                <div class="flex">
                                    <div
                                      class="font-medium w-[111px] text-[19.46px] mb-[3px]"
                                      :class="`text-[${colors.fontSecondaryColor300}]`"
                                    >
                                      Nama
                                    </div>
                                    <div class="font-semibold text-[19.46px]">
                                      : <span v-if="passenger.name.length > 6">
                                          {{ passenger.name.slice(0, 6) + "..." }}
                                        </span>
                                        <span v-else>
                                          {{ passenger.name }}
                                        </span>(Kursi {{ passenger.seat_no }})
                                    </div>
                                </div>
                                <div v-if="passenger.isInfant" class="flex">
                                    <div
                                      class="font-medium w-[111px] text-[19.46px] mb-[3px]"
                                      :class="`text-[${colors.fontSecondaryColor300}]`"
                                    >
                                      Bayi
                                    </div>
                                    <div class="font-semibold text-[19.46px]">
                                      : <span v-if="passenger.infant.name.length > 6">
                                          {{ passenger.infant.name.slice(0, 6) + "..." }}
                                        </span>
                                        <span v-else>
                                          {{ passenger.infant.name }}
                                        </span>({{ calculateAge(passenger.infant.birthDate) }} Tahun)
                                    </div>
                                </div>
                                <div class="flex">
                                    <div
                                      class="font-medium w-[111px] text-[19.46px] mb-[3px]"
                                      :class="`text-[${colors.fontSecondaryColor300}]`"
                                    >
                                      Kode Tiket
                                    </div>
                                    <div class="font-semibold text-[19.46px]">: {{ passenger.ticket }}</div>
                                </div>
                                <QrcodeVue :value="passenger.hashed_qrcode" :size="94" class="absolute right-[10px] top-[10px]"  />
                            </div>
                            <div v-show="!isScrollMax && scheduleStore.updateBookingSeats.length >= 3" class="absolute bottom-0 w-full h-[43px]">
                                <div
                                  class="fixed w-[442px] h-[43px] flex justify-center items-end"
                                  :class="`bg-[${colors.secondaryColor}]`"
                                  style="
                                    background: rgb(221,221,221);
                                    background: linear-gradient(0deg, rgba(221,221,221,1) 0%, rgba(245,255,255,1) 0%, rgba(0,207,215,0) 100%);
                                  "
                                >
                                    <div
                                      @click="scrollBottom"
                                      class="w-[35px] h-[35px] rounded-[50%] flex justify-center items-center"
                                      :class="`bg-[${colors.primaryColor}]`"
                                    >
                                        <img src="../../../assets/images/arrow-bottom-white.png" alt="" srcset="">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TNC -->
                        <div
                          class="w-full h-[auto] p-[10px] rounded-[12px] mt-[20px]"
                          :class="`bg-[${colors.primaryColor20}]`"
                        >
                            <div
                              class="font-medium text-[18px] flex items-center mb-[14px]"
                              :class="`text-[${colors.fontSecondaryColor300}]`"
                            >
                                <img src="../../../assets/images/information_ic.png" class="mr-[10px]"> Detail Penumpang
                            </div>
                            <div class="font-medium text-[16px] text-[#F18C33] leading-[18.48px]">
                                Pastikan penumpang sudah melakukan boarding di point keberangakatan paling lambat 20 menit sebelum keberangkatan ...
                            </div>
                            <button
                              @click="TnCModal"
                              class="w-full py-[10px] rounded-[12px] mt-[14px] text-[16px] font-medium text-center border-[1px]"
                              :class="`text-[${colors.primaryColor}] border-[${colors.primaryColor}]`">
                                Baca lebih detail
                            </button>
                        </div>
                    </template>
                </TripInformation>
            </div>
            

            <div class="mt-[47px] absolute bottom-0 w-full">
                <div class="justify-between flex items-center">
                    <div class="flex items-center">
                        <div
                          class="mr-[24px] flex flex-wrap justify-center items-start pt-[57px] w-[231px] h-[396px] rounded-t-[116px] ml-[45px]"
                          :class="`bg-[${colors.secondaryColor}]`"
                        >
                            <img src="../../../assets/images/arrow-bottom-orange.png">
                            <div v-show="isPrinting" class="font-semibold text-[24px] text-center text-[#F18C33] mt-[36px]">
                                Sedang Memproses
                            </div>
                            <div v-show="!isPrinting" class="font-semibold text-[24px] text-center text-[#F18C33] mt-[36px]">
                                Selesai
                            </div>
                            
                        </div>
                        <div
                          @click="rePrintTicket"
                          v-show="!isPrinting"
                          class="py-[10px] px-[16px] rounded-[25px] h-[47.63px] flex items-center text-[16px]"
                          :class="`bg-[${colors.accentColor}] text-[${colors.fontSecondaryColor}]`"
                        >
                            <img class="mr-[10px]" src="../../../assets/images/print.png">
                            Cetak Ulang Tiket
                        </div>
                        <div
                          v-show="isPrinting"
                          class="py-[10px] px-[16px] rounded-[25px] h-[47.63px] flex items-center text-[16px]"
                          :class="`bg-[${colors.secondaryColor400}] text-[${colors.fontSecondaryColor}]`"
                        >
                            <img class="mr-[10px]" src="../../../assets/images/print.png">
                            Cetak Ulang Tiket
                        </div>
                    </div>

                    

                    <div class="items-center justify-center  w-[337px] pb-[30px]">
                        <div @click="complete" class="flex items-center justify-center py-[30px] rounded-l-full bg-[#F18C33]">
                            <div
                              class="font-semibold text-[48px] flex justify-center w-full relative"
                              :class="`text-[${colors.fontSecondaryColor}]`"
                            >
                                <span class="ml-[20px]">Selesai</span>
                            </div>
                            <img src="../../../assets/images/next2.png" class="mr-[20px]">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- TNC MODAL -->
    <Teleport to='.appWrapper'>
      <Transition :duration="350" name="nested">
        <div v-show="isTnC" class="w-full h-full absolute top-0 flex justify-end items-center z-[100]">

          <div @click="TnCModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
          <div class="inner flex z-[99]">
              <div @click="TnCModal" class="bg-[#C66C6C] cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
                  <img src="../../../assets/images/x.png" class="">
              </div>
                
              <div
                v-html="tnc.data"
                class="w-[755px] pt-[49px] pl-[64px] pr-[32px] rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[1509px]  relative"
                :class="`bg-[${colors.secondaryColor}]`"
              >
              </div>
          </div>
        </div>
      </Transition>
    </Teleport>
</template>