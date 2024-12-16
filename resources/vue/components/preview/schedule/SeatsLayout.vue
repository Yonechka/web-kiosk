<script setup>
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { storeToRefs } from 'pinia';
  import { reactive, computed, ref } from 'vue';
  import { formattingNumber } from '../../../utils';
  import { useSeatsNo, useSelectSeats, useScrollIndicator } from '../../../composeable/schedule';

  const scheduleStore = useScheduleStore();
  const { seats, selectedSeats, totalTicketPrice, selectedDepartureTime } = storeToRefs(scheduleStore);

  /* Seats No */
  const { seatsNo } = useSeatsNo();

  /* Emit Back To Select Time */
  const emit = defineEmits(['backToSelectTime']);
  const backToSelectTime = () => emit('backToSelectTime');

  /* Seats Layout Modal */
  const isShow = ref(false);
  const seatsLayoutModal = () => isShow.value = !isShow.value;

  /* Select Seat */
  const { selectSeat } = useSelectSeats();

  /* Scroll Indicator */
  const { seatsWrapper, isScrollMax, scrollSeatsWrapper, scrollBottom } = useScrollIndicator();
</script>

<template>
    <div class="mt-[24px] rounded-[35px] w-full h-[1249px] relative" :class="`bg-[${colors.secondaryColor}]`">
        <div class="flex justify-between pt-[33px] pl-[37px] pr-[32px] items-center">
            <div class="flex items-center">
              <img src="./../../../assets/images/left.png" @click="backToSelectTime" class="h-10 mr-[15px] cursor-pointer">
              <div
                class="font-medium text-[36px]"
                :class="`text-[${colors.fontPrimaryColor}]`"
              >Pilih Posisi Duduk</div>
            </div>
            <img @click="seatsLayoutModal" src="./../../../assets/images/vector.png" class="al items-center">
        </div>

            <!-- Keterangan -->
          <div class="flex justify-center mt-[54px] mb-[55px]">
              <img src="./../../../assets/images/terisi.png" class="w-[33px] h-[33px] mr-[13px]">
              <div
                class="text-[26px] font-semibold mr-[30px]"
                :class="`text-[${colors.fontPrimaryColor}]`">Terisi</div>

              <div
                class="h-[33px] w-[33px] rounded-[6px] border-2 mr-[13px]"
                :class="`border-[${colors.secondaryColor200}]`"
              ></div>
              <div
                class="text-[26px] font-semibold mr-[30px]"
                :class="`text-[${colors.fontPrimaryColor}]`">Tersedia</div>

              <div
                class="border-1 h-[33px] w-[33px] mr-[13px] rounded-[6px]"
                :class="`bg-[${colors.primaryColor}]`"
              ></div>
              <div
                class="text-[26px] font-semibold pr-[20px]"
                :class="`text-[${colors.fontPrimaryColor}]`">Dipilih</div>
          </div>

          <div class="text-center mb-[20px]">
              <div
                class="text-[26px] font-bold text-center mb-[4px]"
                :class="`text-[${colors.fontPrimaryColor}]`">
                {{ scheduleStore.selectedDepartureTime.departure_time }}
              </div>
              <span class="text-[22px] font-medium" :class="`text-[${colors.fontSecondaryColor400}]`">Jenis Kendaraan Hiace</span>
          </div>

          <div class="flex justify-center mb-[33px]">
              <div class="bg-[#FFF7EE] w-[330px] rounded-[41px] text-center mx-auto">
                  <div class="text-[30px] text-[#FE8900] font-semibold py-[2px]">Depan</div>
              </div>
          </div>

          <div class="w-full flex flex-col items-center justify-center relative">
            
            <slot name="overlaySpinner"></slot>
              <div @scroll="scrollSeatsWrapper" ref="seatsWrapper" class="flex justify-between flex-wrap w-[330px] h-[538px] pb-[30px] overflow-auto">
                <div
                  v-for="(seat, index) in seats.seats_layout" :key="index"
                  class="mb-[32px] font-bold text-4xl flex items-center justify-center"
                  :class="[seats.seats_layout.length > 12 ? 'w-[55px] h-[55px] text-[18px]' : 'w-[95px] h-[95px] text-4xl']"
                >

                  <div v-if="seatsNo.includes(seat.label)" class="w-full h-full">
                    <div v-if="seat.ticket_no === null" @click="selectSeat(seat.label)"
                      class="border-[2px] cursor-pointer w-full h-full rounded-[15px] flex items-center justify-center"
                      :class="[seat.isSelected ? `bg-[${colors.primaryColor}] text-[${colors.secondaryColor}]` : '', `border-[${colors.secondaryColor200}]`]">
                      {{ seat.label }}
                    </div>
                    <img v-else
                      src="./../../../assets/images/terisi.png"
                      :class="[seats.seats_layout.length > 12 ? 'w-[55px] h-[55px]' : 'w-[90px] h-[90px]']"
                    >
                  </div>

                  <div v-else-if="index === 2" class="rounded-[54px]" :class="`bg-[${colors.secondaryColor200}]`">
                      <div
                        class="font-bold"
                        :class="[seats.seats_layout.length > 12 ? 'w-[55px] h-[55px] flex justify-center items-center text-[16px]' : 'py-[26.5px] px-[38.9px] text-4xl']"
                      >S</div>
                  </div>
                  <div v-else></div>
                  
                </div>
                <div v-show="!isScrollMax && seats.seats_layout.length > 12" class="absolute bottom-0 w-full h-[43px]">
                    <div
                      class="fixed w-[330px] h-[43px] flex justify-center items-end"
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
          </div>

          <div class="absolute bottom-[40px] w-full">
              <!-- Harga -->
              <div v-if="selectedSeats.length"
                class="font-semibold pb-[39px] pl-[37px] text-[36px]"
                :class="`text-${colors.fontPrimaryColor}`"
              >
                  Rp. {{ formattingNumber(selectedDepartureTime.total_ticket_price) }}
                  <span
                    :class="`text-[${colors.fontPrimaryColor}]`"
                    class="text-[26px] pl-[9px] font-medium"
                  >x{{ selectedSeats.length }}</span>
              </div>

              <!-- Next -->
              <div class="flex justify-center px-[23px] items-center">
                  <router-link
                    :to="{ name: 'reservation' }" class="flex justify-center w-full rounded-[26px]"
                    :class="[ selectedSeats.length ? `bg-[${colors.accentColor}] cursor-pointer` : `bg-[${colors.secondaryColor200}] cursor-not-allowed` ]" >
                      <div class="flex items-center py-[37px]">
                          <div class="font-bold text-4xl" :class="`text-[${colors.secondaryColor}]`">Lanjutkan</div>
                          <img src="./../../../assets/images/next.png" class="pl-[16.25px]">
                      </div>
                  </router-link>
              </div>
          </div>
    </div>
    <Teleport to=".appWrapper">
      <Transition :duration="350" name="nested">
        <div v-show="isShow" class="w-full h-full absolute top-0  flex justify-end items-center">
          <div @click="seatsLayoutModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
          <div class="flex inner z-[99]">
              <div @click="seatsLayoutModal" class="bg-[#C66C6C] z-[100] cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
                <img src="./../../../assets/images/x.png" class="">
              </div>
              
              <div
                class="w-[755px] flex justify-center items-center flex-col rounded-l-[30px] overflow-y-auto overflow-x-hidden  relative"
                :class="[seats.seats_layout.length > 12 ? 'h-[1600px]' : 'h-[1400px]', `bg-[${colors.secondaryColor}]`]"
              >
                  <div class="text-[#000] text-[36px]">Pilih Posisi Duduk</div>
                  <div>
                    <div class="flex justify-center mt-[54px] mb-[55px]">
                        <img src="./../../../assets/images/terisi.png" class="w-[33px] h-[33px] mr-[13px]">
                        <div class="text-[26px] font-semibold mr-[30px]" :class="`text-[${colors.fontPrimaryColor}]`">Terisi</div>

                        <div class="h-[33px] w-[33px] rounded-[6px] border-2 mr-[13px]" :class="`border-[${colors.secondaryColor200}]`"></div>
                        <div class="text-[26px] font-semibold mr-[30px]" :class="`text-[${colors.fontPrimaryColor}]`">Tersedia</div>

                        <div class="border-1 h-[33px] w-[33px] mr-[13px] rounded-[6px]" :class="`bg-[${colors.primaryColor}]`"></div>
                        <div class="text-[26px] font-semibold pr-[20px]" :class="`text-[${colors.fontPrimaryColor}]`">Dipilih</div>
                    </div>

                    <div class="text-center mb-[20px]">
                        <div class="text-[26px] font-bold text-center mb-[4px]" :class="`text-[${colors.fontPrimaryColor}]`">
                          {{ scheduleStore.selectedDepartureTime.departure_time }}
                        </div>
                        <span class="text-[22px] font-medium" :class="`text-[${colors.fontSecondaryColor400}]`">
                          Jenis Kendaraan Hiace
                        </span>
                    </div>

                    <div class="flex justify-center mb-[33px]">
                        <div class="bg-[#FFF7EE] w-[330px] rounded-[41px] text-center mx-auto">
                            <div class="text-[30px] text-[#FE8900] font-semibold py-[2px]">Depan</div>
                        </div>
                    </div>
                    
                    <div class="w-full flex flex-col items-center justify-center">
                        <div class="flex justify-between flex-wrap w-[320px]">
                          <div
                            v-for="(seat, index) in seats.seats_layout" :key="index"
                            class="mb-[32px] font-bold text-4xl flex items-center justify-center"
                            :class="[seats.seats_layout.length > 12 ? 'w-[55px] h-[55px] text-[18px]' : 'w-[95px] h-[95px] text-4xl']"
                          >

                            <div v-if="seatsNo.includes(seat.label)" class="w-full h-full">
                              <div v-if="seat.ticket_no === null" @click="selectSeat(seat.label)"
                                class="border-[2px] cursor-pointer w-full h-full rounded-[15px] flex items-center justify-center"
                                :class="[seat.isSelected ? `bg-[${colors.primaryColor}] text-[${colors.secondaryColor}]` : '', `border-[${colors.secondaryColor200}]`]">
                                {{ seat.label }}
                              </div>
                              <img v-else
                                src="./../../../assets/images/terisi.png"
                                :class="[seats.seats_layout.length > 12 ? 'w-[55px] h-[55px]' : 'w-[90px] h-[90px]']"
                              >
                            </div>

                            <div v-else-if="index === 2" class="rounded-[50%]" :class="`bg-[${colors.secondaryColor200}]`">
                                <div
                                  class="font-bold"
                                  :class="[seats.seats_layout.length > 12 ? 'py-[16.5px] px-[28.9px] text-[16px]' : 'py-[26.5px] px-[38.9px] text-4xl']"
                                >S</div>
                            </div>
                            <div v-else></div>
                            
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

