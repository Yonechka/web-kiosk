<script setup>
  import { watch, ref, reactive, onMounted, computed, toRefs, toRef } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import {
    useSelectDepartureTime,
    useResetScroll,
    useTodayTomorrowDate,
    useDepartureTimeModal,
  } from '../../../composeable/schedule';

  import OverlaySpinner from '../../../components/daytrans/OverlaySpinner.vue';
  
  const scheduleStore = useScheduleStore();
  const { departureTime, date, selectedDestinationPool } = storeToRefs(scheduleStore);

  /* Select Departure Time */
  const emit = defineEmits(['selectDepartureTimeEvent']);
  const { selectDepartureTime } = useSelectDepartureTime(emit);

  /* Reset Scroll */
  const props = defineProps({ resetScroll: Number });
  const isResetScroll = toRef(props, 'resetScroll');
  const { wrapperDepartureTime } = useResetScroll(isResetScroll);
  
  /* isToday Check */
  const { isToday } = useTodayTomorrowDate();

  /* Show Departure Time Modal */
  const { isShow, departureTimeModal } = useDepartureTimeModal();
</script>

<template>
    <div class="overflow-hidden rounded-[35px] mt-[24px] relative">
        <div
          ref="wrapperDepartureTime"
          class="rounded-[35px] w-full h-[1140px] overflow-y-auto pb-[50px] pr-[32px]"
          :class="`bg-[${colors.secondaryColor}]`"
        >
            <div class="flex justify-between pt-[28px]">
                <p class="text-[36px] pl-[38px]" :class="`text-[${colors.fontPrimaryColor}]`">
                  {{ $t('schedule.times.selectDepartureTime') }}
                </p>
                <img @click="departureTimeModal" :src="images.icExpandModal" class="h-[36.66px] w-[36.66px]">
            </div>
            <div class="row mt-[23px] h-full relative">
                <slot name="overlaySpinner"></slot>
                <div v-if="departureTime.length > 0" class="grid grid-cols-3 gap-x-[20px] gap-y-[16px] pb-[30px] ml-[38px]">
                    <div
                      v-for="(item, index) in departureTime"
                      :key="item.code"
                      @click="selectDepartureTime(item.code, selectedDestinationPool.destination_id)"
                      class="bg-[#F4F9FF] cursor-pointer w-[181px] h-[250px] flex flex-col justify-center mr-[20px] rounded-[12px]"
                      :class="`bg-[${colors.primaryColor20}]`"
                    >
                        <div v-if="isToday">
                            <div
                              v-if="index === 0"
                              class="h-[35px] w-[149px] pb-[22px] mt-[10px] ml-[17px] leading-[23px] rounded-[8px]"
                              :class="[`bg-[${colors.accentColor}]`]"
                            >
                                <p
                                  class="text-[20px]  py-[6px] text-center font-semibold"
                                  :class="[`text-[${colors.fontSecondaryColor}]`]"
                                >
                                 {{ $t('schedule.times.leaveSoon') }}
                                </p>
                            </div>
                        </div>
                        <div class="text-center ">
                            <span class="text-[46px] font-bold" :class="`text-[${colors.fontPrimaryColor}]`">{{ item.departure_time }}</span><br>
                            <span
                              class="mt-[11px] text-[18px] stok"
                              :class="`text-[${colors.fontSecondaryColor400}]`"
                              v-html="$t('schedule.times.availableSeat', { totalSeats: item.available_seat })"
                            >
                            </span><br>
                            <div 
                              class="mt-[14px] text-[18px] font-bold"
                              :class="`text-[${colors.fontPrimaryColor}]`"
                            >
                              <span v-if="item.promo">{{ item.ticket_price_disc_range }}</span>  
                              <span v-else>{{ item.ticket_price_range }}</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="w-full h-full flex justify-center items-center">
                    <div class="text-[30px]">
                      {{ $t('schedule.times.scheduleNotAvailable') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Teleport to='.appWrapper'>
      <Transition :duration="350" name="nested">   
        <div v-show="isShow" class="w-full h-full absolute top-0 flex justify-end items-center">
            <div @click="departureTimeModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
            <div class="flex inner z-[99] h-full items-center">
                <div @click="departureTimeModal" class="bg-[#C66C6C] z-[100] flex justify-center items-center cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
                  <img src="./../../../assets/images/x.png" class="">
                </div>
                
                <div
                  class="w-[755px] py-[49px] rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[98%] pl-[38px] relative"
                  :class="`bg-[${colors.secondaryColor}]`"
                >
                    <div class="text-[36px] mb-[50px]" :class="`text-[${colors.fontPrimaryColor}]`">
                      {{ $t('schedule.times.selectDepartureTime') }}
                    </div>
                    <div class="grid grid-cols-3 gap-x-[20px] gap-y-[16px]  ml-[38px]">
                        <div
                          v-for="(item, index) in departureTime"
                          :key="item.code"
                          @click="selectDepartureTime(item.code)"
                          class="cursor-pointer bg-[#F4F9FF] w-[181px] h-[250px] flex flex-col justify-center mr-[20px] rounded-[12px]"
                        >
                            <div v-if="isToday">
                                <div
                                  v-if="index === 0"
                                  class="h-[35px] w-[149px] pb-[22px] mt-[10px] ml-[17px] leading-[23px] rounded-[8px]"
                                  :class="[`bg-[${colors.accentColor}]`]"
                                >
                                    <div
                                      class="text-[20px]  py-[6px] text-center font-semibold"
                                      :class="`text-[${colors.fontSecondaryColor}]`"
                                    >
                                      {{ $t('schedule.times.leaveSoon') }}
                                    </div>
                                </div>

                            </div>
                            <div class="text-center ">
                                <span class="text-[46px] font-bold text-[#1F2937]">
                                  {{ item.departure_time }}
                                </span><br>
                                <span
                                  class="mt-[11px] text-[18px] stok"
                                  :class="`text-[${colors.fontSecondaryColor400}]`"
                                  v-html="$t('schedule.times.availableSeat', { totalSeats: item.available_seat })"
                                ></span><br>
                                
                                <!-- <div v-if="item.promo" class="flex flex-col">
                                    <div  class="mt-[14px] text-[20px] font-bold text-[red] ">
                                        Rp {{ item.formattedTotalTicketPrice }} 
                                    </div>
                                    <div
                                      class="text-[20px] font-bold"
                                      :class="`text-[${colors.primaryColor}]`"
                                    >
                                        <s>Rp {{ item.formattedTicketPrice }}</s>  
                                    </div>
                                </div> -->
                                

                                <div 
                                  class="mt-[14px] text-[18px] font-bold"
                                  :class="`text-[${colors.fontPrimaryColor}]`"
                                >
                                  <span v-if="item.promo">{{ item.ticket_price_disc_range }}</span>  
                                  <span v-else>{{ item.ticket_price_range }}</span>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Transition>
    </Teleport>
</template>
