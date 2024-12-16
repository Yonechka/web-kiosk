<script setup>
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { storeToRefs } from 'pinia';
  import { reactive, computed, ref, watch , toRef} from 'vue';
  import { formattingNumber, formattingNumberHuman } from '../../../utils';
  import { useSeatsNo, useSelectSeats, useScrollIndicator } from '../../../composeable/schedule';
  import { useRouter } from 'vue-router';

  import OverlaySpinner from '../../../components/daytrans/OverlaySpinner.vue';

  const router = useRouter();
  const scheduleStore = useScheduleStore();
  const {
    seats,
    selectedSeats,
    totalTicketPrice,
    totalTicketPriceNewAsmat,
    subTotalTicketNewAsmat,
    selectedDepartureTime,
    selectedDeparturePool,
    selectedDestinationPool,
    date
  } = storeToRefs(scheduleStore);

  /* Seats No */
  const { seatsNo } = useSeatsNo();

  const props = defineProps({ isSelectScheduleError: Boolean })
  const isError = toRef(() => props.isSelectScheduleError)

  /* Emit Back To Select Time */
  const emit = defineEmits(['backToSelectTime']);
  const backToSelectTime = () => emit('backToSelectTime');

  /* Seats Layout Modal */
  const isShow = ref(false);
  const seatsLayoutModal = () => isShow.value = !isShow.value;

  /* Select Seat */
  const { selectSeat, toReservation } = useSelectSeats(router);

  /* Scroll Indicator */
  const { seatsWrapper, isScrollMax, scrollSeatsWrapper, scrollBottom } = useScrollIndicator();

  /* Seat Size px */
  const seatsLayoutSize = ref('w-[64px] h-[64px] text-[20px]')
  watch(seats, () => {
    console.log('watch seats tiggered!')
    if (seats.value.seats_layout.length > 30) {
      seatsLayoutSize.value = 'w-[64px] h-[64px] text-[20px]'
    } else if (seats.value.seats_layout.length > 20) {
      seatsLayoutSize.value = 'w-[64px] h-[64px] text-[20px]'
    } else if (seats.value.seats_layout.length > 19) {
      if (seats.value.col < 5) {
        seatsLayoutSize.value = 'w-[64px] h-[64px] text-[20px]'
      } else {
        seatsLayoutSize.value = 'w-[64px] h-[64px] text-[20px]'
      }
    } else if (seats.value.seats_layout.length > 14) {
      seatsLayoutSize.value = 'w-[64px] h-[64px] text-[20px]'
    } else if (seats.value.seats_layout.length > 12) {
      seatsLayoutSize.value = 'w-[64px] h-[64px] text-[20px]'
    } else {
      seatsLayoutSize.value = 'w-[64px] h-[64px] text-[20px]'
    }
  })
</script>

<template>
    <div class=" w-full h-full px-[56px] absolute top-0 left-0" :class="`bg-[${colors.primaryColor}]`">
      <div class="w-full p-8 bg-white flex justify-between items-end rounded-[36px] my-8">
        <div class=" flex flex-col gap-2">
          <div class=" text-xl text-[#71747D]">{{ $d(date, 'short') }}</div>
          <div class=" text-2xl font-bold flex items-center gap-3">
            <div v-if="selectedDeparturePool?.pool_name.length > 18">
              {{ selectedDeparturePool?.pool_name.slice(0, 13) + "..." }}
            </div>
            <div v-else>
              {{ selectedDeparturePool?.pool_name }}
            </div>
            <img src="./../../../assets/images/right_arrow.png" alt="right_arrow.png">
            <div v-if="selectedDestinationPool?.destination_pool.length > 12">
                {{ selectedDestinationPool?.destination_pool.slice(0, 12) + "..." }}
            </div>
            <div v-else>
              {{ selectedDestinationPool?.destination_pool }}
            </div>
          </div>
        </div>

        <button @click="backToSelectTime" class=" text-lg font-semibold bg-transparent" :class="`text-[${colors.primaryColor}]`">
          {{ $t('schedule.change') }}
        </button>
      </div>

      <div class="rounded-[35px] w-[645px] h-[1686px] relative" :class="`bg-[${colors.secondaryColor}]`">
          <div v-show="isError" class="w-full h-full rounded-[35px] bg-white absolute top-0 left-0 z-10"></div>
          <div
            v-if="seats.isTimePassed"
            class="w-full h-full bg-white rounded-[35px] text-[30px] absolute top-0 left-0 z-10 flex flex-col justify-center items-center"
          >
            <div class="mb-[20px] text-center">
              {{ $t('schedule.seats.timePassed') }}
            </div>
            <div
              @click="backToSelectTime"
              class="p-[20px] text-white rounded-md text-center bg-teal-600"
            > {{ $t('schedule.seats.chooseOther') }} </div>
          </div>
          <div class="flex justify-between pt-[33px] pl-[37px] pr-[32px] items-center">
              <div class="flex items-center">
                <img src="./../../../assets/images/left.png" @click="backToSelectTime" class="w-8 mr-[15px] cursor-pointer">
                <div
                  class="font-medium text-2xl"
                  :class="`text-[${colors.fontPrimaryColor}]`"
                >{{ $t('schedule.seats.selectSeats') }}</div>
              </div>
          </div>
          <div class="flex justify-center my-8">
             <div class="flex items-center">
                <img src="./../../../assets/images/terisi.png" class="w-[16px] h-[16px] mr-[13px]">
                <div
                  class="text-[16px] mr-[30px] text-[#71747D]">
                  {{ $t('schedule.seats.booked') }}
                </div>
              </div>
              <div class="flex items-center">
                <div
                  class="h-[16px] w-[16px] rounded-[4px] border-2 mr-[13px]"
                  :class="`border-[${colors.secondaryColor200}]`"
                ></div>
                <div
                  class="text-[16px] mr-[30px] text-[#71747D]">
                  {{ $t('schedule.seats.available') }}
                </div>
              </div>
              <div class="flex items-center">
                <div
                  class="border-1 h-[16px] w-[16px] mr-[13px] rounded-[4px]"
                  :class="`bg-[${colors.primaryColor}]`"
                ></div>
                <div
                  class="text-[16px] pr-[20px] text-[#71747D]">
                  {{ $t('schedule.seats.selected') }}
                </div>
              </div>
          </div>

          <div class="text-center mb-4">
              <div
                class="text-[20px] font-bold text-center mb-[4px]"
                :class="`text-[${colors.fontPrimaryColor}]`">
                {{ scheduleStore.selectedDepartureTime.departure_time }}
              </div>
              <span v-if="scheduleStore.seats && scheduleStore.seats?.vehicle" class="text-[20px] font-medium" :class="`text-[${colors.fontSecondaryColor400}]`">
                {{ $t('schedule.seats.transportationType') }} {{ scheduleStore.seats.vehicle }}
              </span>
          </div>

          <div class="flex justify-center mb-6">
              <div class="bg-[#F5F5F5] rounded-[41px] text-center mx-auto px-8 py-2">
                  <div class=" text-base text-[#1F2937] font-semibold">
                    {{ $t('schedule.seats.front') }}
                  </div>
              </div>
          </div>

          <div class="w-full flex flex-col items-center justify-center relative">
            
            <slot name="overlaySpinner"></slot>
            <div ref="seatsWrapper" class="w-auto h-auto min-h-[400px]  overflow-auto">
                <div v-if="seats?.row" v-for="(layout, indexParent) in parseInt(seats?.row)" :key="indexParent" class=" w-auto mb-6 flex gap-x-6">
                  <template v-if="seats.seats_layout.length > 0" v-for="(seat, index) in seats.seats_layout">
                    <!-- <span v-if="seat.row == indexParent" class="bg-[green]"> {{ seat.row }} </span> -->
                    <div
                      v-if="seat.row == indexParent"
                      class="font-bold flex items-center justify-center"
                      :class="[seatsLayoutSize]"
                    >

                      <div v-if="seatsNo.includes(seat.label)" class="w-full h-full">
                        <div v-if="seat.ticket_no === null" @click="selectSeat(seat.label)"
                          class="border-[2px] relative cursor-pointer w-full h-full rounded-[15px] flex items-center justify-center"
                          :class="[seat.isSelected ? `bg-[${colors.primaryColor}] text-[${colors.secondaryColor}]` : '', `border-[${colors.secondaryColor200}]`]">
                          {{ seat.label }}
                        </div>
                        <img v-else
                          src="./../../../assets/images/terisi.png"
                          :class="[seatsLayoutSize]"
                        >
                      </div>

                      <div v-else-if="seat.status == 's'">
                          <img src="./../../../assets/images/ic_driver.png" alt="ic-driver">
                      </div>

                      <div v-else-if="seat.status == 'px'">
                        <img
                          src="./../../../assets/images/terisi.png"
                          :class="[seatsLayoutSize]"
                        >
                      </div>

                      
                      <div v-else></div>
                    
                    </div>
                  </template>
                </div>
            </div>
          </div>

          <div class="absolute bottom-[40px] w-full">
            <!-- Harga -->
            <div v-if="selectedSeats.length" class=" pl-[37px] mb-8">
              <div class="text-[#71747D] text-xl">
                {{ $t('schedule.seats.totalPrice') }}
              </div>
              <div 
                class="font-semibold text-[32px]"
                :class="`text-${colors.fontPrimaryColor}`"
              >
                  Rp. {{ formattingNumber(selectedDepartureTime.total_ticket_price) }}
                  <span
                    :class="`text-[${colors.fontPrimaryColor}]`"
                    class="text-[26px] pl-[9px] font-medium"
                  >
                    x{{ selectedSeats.length }}
                  </span>

              </div>
            </div>
            

            <!-- Next -->
            <div class="flex justify-center px-[23px] items-center">
                <router-link
                  :to="{ name: 'reservation' }"
                  class="flex justify-center w-full rounded-[26px] py-[14px]"
                  :class="[ selectedSeats.length ? `bg-[${colors.accentSecondaryColor}] cursor-pointer` : `bg-[#71747D] cursor-not-allowed` ]" >
                    <div class="flex items-center">
                        <div class="font-bold text-2xl" :class="`text-[${colors.secondaryColor}]`">
                          {{ $t('schedule.seats.continue') }}
                        </div>
                        <img src="./../../../assets/images/next.png" class="pl-[16.25px]">
                    </div>
                </router-link>
            </div>
        </div>
      </div>
    </div>
</template>

