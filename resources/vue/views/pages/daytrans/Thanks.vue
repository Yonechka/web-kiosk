<script setup>
  import { storeToRefs } from 'pinia';
  import { ref, onMounted } from 'vue';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useStore } from '../../../store/Store';
  import { useRouter, useRoute } from 'vue-router';
  import { printFormat } from '../../../utils';
  import { useI18n } from 'vue-i18n';
  import { 
    useCompleted,
    usePrintTicket,
    useCalculateAge,
    useTNC,
    useScrollIndicator
  } from '../../../composeable/thanks';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css'; 

  import TripInformation from '../../../components/daytrans/TripInformation.vue';
  import TripInformationDirectPrint from '../../../components/daytrans/TripInformationDirectPrint.vue';
  import LanguageSelector from '@/components/LanguageSelector.vue';
  import CircularProgress from '@/components/CircularProgress.vue';
  import QrcodeVue from 'qrcode.vue';

  const scheduleStore = useScheduleStore();
  const store = useStore();
  const router = useRouter();
  const route = useRoute();

  const { query } = route;
  const isDirectPrint = query?.isDirectPrint == 'true';

  const { t, d } = useI18n({ useScope: 'global' });

  /* Complete Button Handler */
  const { complete } = useCompleted(router);

  /* Print Ticket */
  const { isPrinting, printTicket, rePrintTicket } = usePrintTicket(toast, t, d, true);

  /* Calculating Infant Age */
  const { calculateAge } = useCalculateAge();

  /* TnC */
  const { isTnC, tnc, TnCModal, tncInit } = useTNC();
  await tncInit();

  /* Scroll Indicator */
  const { passengersWrapper, isScrollMax, scrollPassengersWrapper, scrollBottom } = useScrollIndicator();

  /* onMounted Hooks */
  onMounted( async () => {
    if (!scheduleStore.printInfo) {
      printTicket();
    } else {
      setTimeout(() => {
        isPrinting.value = false;
      }, 1000 * 60);
    }
  });
</script>

<template>
    <Teleport to='.appWrapper'>
        <div class="absolute w-full h-[100%] mx-auto" :class="`bg-[${colors.primaryColor}]`">
            <div class="flex pl-[45px] pr-[56px] justify-between mb-[120px]">
                <!-- navbar menu -->
                <div class="pt-[73px]  ">
                    <img class="w-[239px]" :src="images.logoSecondary">
                </div>

                <!-- Trip Info -->
                <TripInformation v-if="!query?.isDirectPrint" width="w-[600px]" height="h-[auto]">
                    <template #detail>
                        <div class="flex justify-between items-center mb-[10px]">
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                              {{ $t('thanks.customerName') }}
                            </div>
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                              <span v-if="scheduleStore.customerInfo.name.length > 12">
                                {{ scheduleStore.customerInfo.name.slice(0, 12) + "..." }}
                              </span>
                              <span v-else>
                                {{ scheduleStore.customerInfo.name }}
                              </span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mb-[10px]">
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                              {{ $t('thanks.bookingCode') }}
                            </div>
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ scheduleStore.bookingInfo.booking_code }}</div>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                              {{ $t('thanks.otp') }}
                            </div>
                            <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ scheduleStore.otpNewAsmat }}</div>
                        </div>

                        <!-- Passengers Detail -->
                        <div
                          class="font-medium text-xl mt-[20px] mb-[14px]"
                          :class="`text-[${colors.fontSecondaryColor300}]`"
                        >
                          {{ $t('thanks.detailPassengers') }}
                        </div>
                        <div @scroll="scrollPassengersWrapper" ref="passengersWrapper" class="max-h-[242px] overflow-auto w-full relative">
                            <div
                              v-for="passenger in scheduleStore.printInfo"
                              class="mb-[14px] border-[1px] w-full h-[114px] p-[10px] rounded-[12px] relative"
                              :class="`border-[${colors.secondaryColor200}]`"
                            >
                                <div class="flex">
                                    <div
                                      class="font-medium w-[111px] text-[19.46px] mb-[3px]"
                                      :class="`text-[${colors.fontSecondaryColor300}]`"
                                    >
                                    {{ $t('thanks.passengerName') }}
                                    </div>
                                    <div class="font-semibold text-[19.46px]">
                                      : <span v-if="passenger.passenger_name.length > 6">
                                          {{ passenger.passenger_name.slice(0, 6) + "..." }}
                                        </span>
                                        <span v-else>
                                          {{ passenger.passenger_name }}
                                        </span>({{ $t('thanks.seat') }} {{ passenger.seat_no }})
                                    </div>
                                </div>
                                <div class="flex">
                                    <div
                                      class="font-medium w-[111px] text-[19.46px] mb-[3px]"
                                      :class="`text-[${colors.fontSecondaryColor300}]`"
                                    >
                                    {{ $t('thanks.ticket') }}
                                    </div>
                                    <div class="font-semibold text-[19.46px]">: {{ passenger.ticket_no }}</div>
                                </div>
                                <QrcodeVue :value="passenger.qr_code" :size="94" class="absolute right-[10px] top-[10px]"  />
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
                          class="w-full h-[auto] p-[10px] rounded-[12px] mt-[20px] bg-[#F4F9FF]"
                        >
                            <div
                              class="font-medium text-[18px] flex items-center mb-[14px]"
                              :class="`text-[${colors.fontSecondaryColor300}]`"
                            >
                                <img src="../../../assets/images/information_ic.png" class="mr-[10px]">
                                {{ $t('thanks.important') }}
                            </div>
                            <div class="font-medium text-[16px] text-[#F18C33] leading-[18.48px]">
                              {{ $t('thanks.customerInfo') }}
                            </div>
                            <button
                              @click="TnCModal"
                              class="w-full py-[10px] rounded-[12px] mt-[14px] text-[16px] font-medium text-center border-[1px]"
                              :class="`text-[${colors.primaryColor}] border-[${colors.primaryColor}]`">
                              {{ $t('thanks.ctaTnc') }}
                            </button>
                        </div>
                    </template>
                </TripInformation>
                <TripInformationDirectPrint
                  v-else
                  width="w-[600px]"
                  height="h-[auto]"
                >
                  <div
                    class="w-full h-[auto] p-[10px] rounded-[12px] mt-[20px] bg-[#F4F9FF]"
                  >
                      <div
                        class="font-medium text-[18px] flex items-center mb-[14px]"
                        :class="`text-[${colors.fontSecondaryColor300}]`"
                      >
                          <img src="../../../assets/images/information_ic.png" class="mr-[10px]">
                          {{ $t('thanks.important') }}
                      </div>
                      <div class="font-medium text-[16px] text-[#F18C33] leading-[18.48px]">
                        {{ $t('thanks.customerInfo') }}
                      </div>
                      <button
                        @click="TnCModal"
                        class="w-full py-[10px] rounded-[12px] mt-[14px] text-[16px] font-medium text-center border-[1px]"
                        :class="`text-[${colors.primaryColor}] border-[${colors.primaryColor}]`">
                        {{ $t('thanks.ctaTnc') }}
                      </button>
                  </div>
                </TripInformationDirectPrint>
            </div>
            

            <div class="mt-[47px] absolute bottom-0 w-full">
                <div class="justify-between flex items-center">
                    <div class="flex items-center">
                        <div class="flex flex-col justify-center items-center self">
                          <LanguageSelector dynamicClass="mb-6 py-[16.5px] rounded-[16px] px-[12px] text-[20px]" />
                          <div class="mb-[26px] w-[231px] leading-9 text-white text-[32px] text-center">
                            {{ $t('thanks.takeTicket') }}
                          </div>
                          <div
                            class="mr-[24px] flex flex-col justify-center items-center pt-[57px] w-[231px] h-[396px] rounded-t-[116px] ml-[24px]"
                            :class="`bg-[${colors.secondaryColor}]`"
                          >
                              <img src="../../../assets/images/arrow-bottom-orange.png">
                              <div class="font-semibold text-[24px] text-center text-[#F18C33] mt-[36px]">
                                {{ isPrinting ? $t('thanks.processing') : $t('thanks.done') }}
                              </div>
                              
                          </div>
                        </div>


                        <div
                          @click="rePrintTicket"
                          v-show="!isPrinting"
                          class="py-[10px] px-[16px] rounded-[25px] h-[47.63px] flex items-center text-[16px]"
                          :class="`bg-[${colors.accentSecondaryColor}] text-[${colors.secondaryColor}]`"
                        >
                            <img class="mr-[10px]" src="../../../assets/images/print.png">
                            {{ $t('thanks.reprintTicket') }}
                        </div>
                        <div
                          v-show="isPrinting"
                          class="py-[10px] px-[16px] rounded-[25px] h-[47.63px] flex items-center text-[16px]"
                          :class="`bg-[${colors.secondaryColor400}] text-[${colors.secondaryColor}]`"
                        >
                            <img class="mr-[10px]" src="../../../assets/images/print.png">
                            {{ $t('thanks.reprintTicket') }}
                        </div>
                    </div>
                   <div class="items-center justify-center  w-auto pb-[30px]">
                        <div
                          @click="complete"
                          class="flex items-center justify-center gap-4 py-[30px] rounded-l-full bg-[#F18C33]"
                          :class="[isDirectPrint ? 'pl-5' : 'pl-10']"
                        >
                            <CircularProgress v-if="isDirectPrint" :duration="30" @onComplete="complete" />
                            <div
                              class="font-semibold text-[48px] flex justify-center w-full relative"
                              :class="`text-[${colors.secondaryColor}]`"
                            >
                                <span>
                                  {{ $t('thanks.done') }}
                                </span>
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
              <div @click="TnCModal" class="bg-[#C66C6C] flex justify-center items-center cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
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
