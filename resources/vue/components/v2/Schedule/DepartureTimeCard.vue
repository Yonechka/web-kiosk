<script setup>
import { watch, ref, reactive, onMounted, computed, toRefs, toRef } from 'vue';
import { storeToRefs } from 'pinia';
import { formattingNumber } from '@/utils';
import { useScheduleStore } from '@/store/ScheduleStore';
import {
  useSelectDepartureTime,
  useResetScroll,
  useTodayTomorrowDate,
  useDepartureTimeModal,
} from '@/composeable/schedule';

import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';
import Modal from '@/components/v2/Modal.vue';
import IcDeparturePrice from '@/components/v2/ic/IcDeparturePrice.vue';
import IcDestinationPrice from '../ic/IcDestinationPrice.vue';
import IcExpand from '@/components/v2/ic/IcExpand.vue';
import IcSeat from '@/components/v2/ic/Seat.vue';
import RoundtripLabel from '@/components/v2/Schedule/RoundtripLabel.vue';


const scheduleStore = useScheduleStore();
const { departureTime, date, selectedDestinationPool } = storeToRefs(scheduleStore);

/* Reset Scroll */
const props = defineProps({
  departureReturn: {
    type: Boolean,
    default: false
  },
  showScheduleCards: {
    type: Boolean,
    default: true,
  },
  expandCard: {
    type: Boolean,
    default: true
  },
  isSeatSelected: Boolean,
  departureTimes: Array,
  selectedDepartureTime: String,
  subtotalPrice: Number,
  selectedSeats: Array,
  //price: String,
  //labelComp: Object
});



/* Select Departure Time */
const emit = defineEmits(['selectDepartureTimeEvent', 'onClickChangeSeat', 'backToSelectTime']);
const { selectDepartureTime } = useSelectDepartureTime(emit, props.departureReturn);


/* isToday Check */
const { isToday } = useTodayTomorrowDate();

/* Logo Label */
const logoLabel = props.departureReturn ? IcDestinationPrice : IcDeparturePrice;

/* Label Departure */
const label = props.departureReturn ? 'schedule.times.selectDepartureReturnTime' : 'schedule.times.selectDepartureTime'

/* Show Departure Time Modal */
const { isShow, departureTimeModal } = useDepartureTimeModal();

/* Change Seat */
const onClickChangeSeat = () => {
  emit('onClickChangeSeat');
}

/* Roundtrip Style Handler */
const roundTripDynamicClass = computed(() => {
  const expandedCard = 'border border-[#C9C9C9] rounded-2xl p-6 pb-0 h-[848px] flex flex-col gap-4';
  const shrinkedCard = 'border border-[#C9C9C9] rounded-2xl p-6 h-fit flex flex-col gap-4';

  const dynamicClass = props.expandCard ? expandedCard : shrinkedCard ;

  return scheduleStore.isRoundedTrip ? dynamicClass : '';
}); 
</script>

<template>
  <!-- Departure Trip -->
  <div class=" relative h-full flex flex-col gap-4" :class="[ roundTripDynamicClass ]">
    <Teleport to='.appWrapper'>
      <Transition :duration="350" name="nested">   
          <Modal v-show="isShow" @onClickModal="departureTimeModal">
            <div class="flex justify-between">
                <p class="text-[36px]" :class="`text-[${colors.fontPrimaryColor}]`">
                  {{ $t('schedule.times.selectDepartureTime') }}
                </p>
            </div>
            <div class="row mt-[23px] h-full relative">
                <slot name="overlaySpinner"></slot>
                <div v-if="props.departureTimes.length > 0" class="grid grid-cols-3 gap-x-[18px] gap-y-[20px] pb-[30px]">
                  <div
                    v-for="(item, index) in props.departureTimes"
                    :id="`btnDepartureTime_${index+1}`"
                    :data-time="item.departure_time"
                    :key="item.code"
                    @click="selectDepartureTime(item.code, selectedDestinationPool.destination_id)"
                    class="gradientCard border-[2px] border-[#E5E7EB] cursor-pointer py-9 px-5 flex flex-col justify-center rounded-[12px] relative"
                  >     
                      <img
                        :src="$t('schedule.times.assets.tagDeparture')"
                        v-if="(isToday && index === 0) && !props.departureReturn"
                        class="absolute bottom-[-10px] left-[-6px]"
                      />
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
          </Modal>
      </Transition>
    </Teleport>
    
    <!-- Header -->
    <div class="flex justify-between items-center">
        <p class="text-[24px] leading-none font-semibold text-[#1F2937] flex items-center gap-2">
          {{ $t(label) }}
          <Transition>
            <img v-if="props.selectedSeats.length > 0" src="@/assets/images/ic-checklist-green.svg" alt="ic-checklist-green">
          </Transition>
        </p>

        <div class=" flex gap-6" v-show="props.selectedSeats.length <= 0">
          <RoundtripLabel :isReturn="props.departureReturn" />
          <IcExpand
            v-if="props.departureTimes.length > 0"
            @click="departureTimeModal"
            class="h-[28px] w-[28px]"
          />
        </div>

        
    </div>

    <!-- Roundtrip -->
    <div
      v-show="props.isSeatSelected && scheduleStore.isRoundedTrip"
      class="w-full flex flex-col px-4 py-3 gap-2 border border-[#EBEBEB] rounded-2xl bg-[#FAFAFA]"
    >
      <!-- Schedule Time & Label -->
      <div class=" flex justify-between items-center w-full">
        <span class=" font-bold text-2xl" :class="[`text-[${colors.primaryColor}]`]">
          {{ props.selectedDepartureTime }}
        </span>
        <RoundtripLabel :isReturn="props.departureReturn" />
      </div>

      <!-- Seat & Price -->
      <div class=" flex justify-between items-center w-full">
        <div class=" flex gap-1 items-center w-[70%] line-clamp-1">
          <IcSeat/>
          <span class=" text-[#555555] font w-full line-clamp-1">
            {{ $t('schedule.times.seat', props?.selectedSeats?.length ?? 1 ) }}
            <template v-if="props.isSeatSelected" v-for="seat in props?.selectedSeats">
              {{ seat.label + ', ' }}
            </template>
          </span>
        </div>
        <div class=" font-medium" :class="[`text-[${colors.primaryColor}]`]">
          Rp. {{ formattingNumber(props.subtotalPrice) }}
        </div>
      </div>
    </div>

    <!-- CTA Change Seats and Departure Time -->
    <div v-show="props.selectedSeats.length > 0" class=" w-full flex gap-4">
      <button @click="emit('onClickChangeSeat')" class=" w-full py-3 border rounded-xl font-semibold text-center" :class="[ `border-[${colors.primaryColor}]`,  `text-[${colors.primaryColor}]` ]">
        {{ $t('schedule.times.changeSeat') }}
      </button>
      <button @click="emit('backToSelectTime')" class=" w-full py-3 border rounded-xl font-semibold text-white text-center" :class="[ `bg-[${colors.primaryColor}]` ]">
        {{ $t('schedule.times.changeTime') }}
      </button>
    </div>

    <!-- Schedule Cards -->
    <div v-if="props.showScheduleCards" class="row mt-[23px] relative overflow-y-auto h-full">
        <slot name="overlaySpinner"></slot>
        <div v-if="props.departureTimes.length > 0" class="grid grid-cols-3 gap-x-[18px] gap-y-[20px] pb-[30px]">
            <div
              v-for="(item, index) in props.departureTimes"
              :id="`btnDepartureTime_${index+1}`"
              :data-time="item.departure_time"
              :key="item.code"
              @click="selectDepartureTime(item.code, selectedDestinationPool.destination_id)"
              class="gradientCard border-[2px] border-[#E5E7EB] cursor-pointer py-9 px-5 flex flex-col justify-center rounded-[12px] relative"
            >     
                <img
                  :src="$t('schedule.times.assets.tagDeparture')"
                  v-if="(isToday && index === 0) && !props.departureReturn"
                  class="absolute bottom-[-10px] left-[-6px]"
                />
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

  
</template>

<style scoped>
.gradientCard {
  background: linear-gradient(180deg, #FAFAFA 0%, #F2F2F2 100%);
}
</style>
