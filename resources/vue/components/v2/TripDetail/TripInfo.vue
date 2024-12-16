<script setup>
import { ref, computed, onMounted, defineExpose, nextTick } from 'vue';
import { formattingDateYMD } from '@/utils';
import useDynamicHeight from '@/composeable/useDynamicHeight.js';
import { useScheduleStore } from '../../../store/ScheduleStore';
import { useRoute } from 'vue-router';

import Caret from '@/components/v2/ic/Caret.vue';
import RoundtripLabel from '@/components/v2/Schedule/RoundtripLabel.vue';

const route = useRoute();
const scheduleStore = useScheduleStore();

const departureEl = ref(null);
const destinationEl = ref(null);
const departureElHeight = ref(0);
const destinationElHeight = ref(0);
const baseHeight = scheduleStore.isRoundedTrip ? 111 : 90;

const departureElReturn = ref(0);
const departureElHeightReturn = ref(0);

const showChangeLocationRoute = ['reservation'];
const isChangeLocation = computed(() => showChangeLocationRoute.includes(route.name));


const {
  dynamicHeight: tripInfoHeight,
  isElementExpanded: isTripInfoExpanded,
  onClickHandler
} = useDynamicHeight(
  {
    baseHeight, expandedHeight: [ departureElHeight, destinationElHeight ] //TODO: Base height based on roundtrip
  }
);

const {
  dynamicHeight: tripInfoHeightReturn,
  isElementExpanded: isTripInfoExpandedReturn,
  onClickHandler: onClickHandlerReturn
} = useDynamicHeight(
  {
    baseHeight, expandedHeight: [ departureElHeightReturn, destinationElHeight ] //TODO: Base height based on roundtrip
  }
);

defineExpose({
  isTripInfoExpanded, isTripInfoExpandedReturn
});

const dynamicClass = computed(() => {
  return {
    parentEl: isTripInfoExpanded.value ? 'gap-3' : 'gap-0',
    city: isTripInfoExpanded.value ? 'opacity-0 invisible' : 'opacity-100 visible',
    paddingLine: isTripInfoExpanded.value ? 'pt-2 pb-[46px]': 'py-2',
    overlayLine: isTripInfoExpanded.value ? 'h-[50px]' : 'h-[10px]',
    detailDepartureEl: isTripInfoExpanded.value ? `opacity-100 h-[${departureElHeight.value + 50}px] visible` : 'opacity-0 invisible h-[0px]',
    detailDepartureElReturn: isTripInfoExpandedReturn.value ? `opacity-100 h-[${departureElHeightReturn.value + 50}px] visible` : 'opacity-0 invisible h-[0px]',
    detailDestinationEl: isTripInfoExpanded.value ? `opacity-100 h-[28px] visible` : 'opacity-0 invisible h-[0px]',
    icCaret: isTripInfoExpanded.value ? 'rotate-180' : 'rotate-0'
  }
});

const onClickExpandCard = () => {
  onClickHandler();
  if (scheduleStore.isRoundedTrip) {
    onClickHandlerReturn();
  }
}

onMounted(() => {
  departureElHeight.value = departureEl.value.scrollHeight;
  destinationElHeight.value = destinationEl.value.scrollHeight;

  departureElHeightReturn.value = departureEl.value.scrollHeight;
  isTripInfoExpanded.value = false;
  isTripInfoExpandedReturn.value = false;
});



</script>

<template>
 
    <div class=" w-[696px] h-fit p-8 border-2 bg-white rounded-[35px]">
      <!-- Route Info -->
      <div
       class="w-full flex gap-3 expandAnimation " 
       :class="[ scheduleStore.isRoundedTrip ? 'border rounded-3xl p-6' : '' ]"
       :style="{ height: isTripInfoExpanded && scheduleStore.isRoundedTrip ? tripInfoHeight + 32 + 42 + 'px' : tripInfoHeight + 'px' }"
       ><!-- TODO: Height Based on rounded Trip or not -->
        <div
          v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded"
          class=" w-3 h-full  flex flex-col items-center justify-between relative  animateFade"
          :class="[ dynamicClass.paddingLine ]"
        >
          <div class=" w-3 h-3 ronded-full bg-[#EB2C27] rounded-full z-10"></div>
          <div class=" absolute h-full bottom-0 border-dashed border-l-2 border-[#E5E7EB]"></div>
          <div class=" w-3 h-3 ronded-full bg-[#E5E7EB] rounded-full z-10"></div>
          
          <div
            class=" w-full bg-white h-[10px] absolute top-0 left-0"></div>
          <div
            class=" w-full bg-white absolute bottom-0 left-0 expandAnimation"
            :class="dynamicClass.overlayLine"></div>
        </div>
        <div
          class=" w-full h-full flex flex-col justify-between"
          :class="[ scheduleStore.isRoundedTrip &&  isTripInfoExpanded ? 'pr-6' : '']
        ">

          <!-- Rounded Trip Only -->
          <div v-if="scheduleStore.isRoundedTrip" class=" w-full flex justify-between" :class="[ isTripInfoExpanded ? 'mb-4' : 'mb-2' ]">
            <!-- Date Time Info -->
            <div class=" flex items-center gap-3 text-[#555555]">
            <span
              id="departureDate"
              :data-departure-date-ymd="formattingDateYMD(scheduleStore.date)"
              :data-departure-date-formatted="$d(scheduleStore.date, 'long')"
            >
              {{ $d(scheduleStore.date, 'long') }}
            </span>
            <div class=" w-2 h-2 rounded-full bg-[#1F2937]"></div>
            <span
              id="departureTime"
              :data-depature-time="scheduleStore.selectedDepartureTime.departure_time"
            >
              {{ scheduleStore.selectedDepartureTime.departure_time }}
            </span>
            </div>

            <RoundtripLabel/>
          </div>

          <!-- Rounded Trip Only -->
          <div
            v-if="scheduleStore.isRoundedTrip && !isTripInfoExpanded"
            class=" leading-none text-xl font-semibold text-[#1F2937] flex items-center gap-1"
          >
            <!-- Departure -->
            <span>
              {{ scheduleStore.selectedDeparturePool.pool_name }}
            </span>

            <img src="@/assets/images/arrow-right.svg" alt="arrow-right">

            <!-- Destination -->
            <span>
              {{ scheduleStore.selectedDestinationPool.destination_pool }}
            </span>

          </div>

          <!-- Departure -->
          <div class=" flex flex-col" :class="[dynamicClass.parentEl]">

            <!-- Title -->
            <div v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded" class=" text-2xl text-[#1F2937] font-bold leading-[27px]">
              <span
                :data-departure-outlet-name="scheduleStore.selectedDeparturePool.pool_name"
                id="departureOutletName"
              >  
                {{ scheduleStore.selectedDeparturePool.pool_name }}
              </span>
              <span class="animateFade" :class="[dynamicClass.city]">, {{ scheduleStore.selectedDeparturePool.city }}</span>
            </div>

            <!-- Dynamic Element -->
            <div v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded" ref="departureEl" :key="1" class="animateFade" :class="[dynamicClass.detailDepartureEl]">
              <!-- Address -->
              <div class="text-base text-[#71747D] line-clamp-1">
                {{ scheduleStore.selectedDeparturePool.pool_full_address }}
              </div>

              <!-- Seat -->
              <div class=" w-full py-3 px-4 flex border-[1px] border-[#E5E7EB] rounded-2xl mt-3">
                <div class=" pr-4 flex items-center">
                  <img src="@/assets/images/ic-seat.svg" alt="ic-seat">
                </div>
                <div class="w-[552px] text-[#71747D] text-base">
                  <span
                    v-for="(seat, index) in scheduleStore.selectedSeats"
                    :id="`seat_list_${index+1}`"
                    :data-seat-numb="seat.label"
                  >
                    {{ `${$t('tripCard.seats', 1)} ${seat.label}${index === scheduleStore.selectedSeats.length - 1 ? '' : ','} ` }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Destination -->
          <div class=" flex flex-col" :class="[dynamicClass.parentEl]">
            <!-- Title -->
            <div v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded" class=" text-2xl text-[#1F2937] font-bold leading-[27px]">
              <span
                id="destinationOutletName"
                :data-destination-outlet-name="scheduleStore.selectedDestinationPool.destination_pool"
              >
                {{ scheduleStore.selectedDestinationPool.destination_pool }}
              </span>
              <span class="animateFade" :class="[dynamicClass.city]">, {{ scheduleStore.selectedDestinationPool.destination_city }}</span>
            </div>

            <!-- Dynamic Element -->
            <div v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded" ref="destinationEl" :key="2" class="animateFade" :class="[dynamicClass.detailDestinationEl]">
              <!-- Address -->
              <div class="text-base text-[#71747D] line-clamp-1">
                {{ scheduleStore.selectedDestinationPool.alamat }}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <!-- Route Info Return (Roundtrip Only) -->
      <div
        v-if="scheduleStore.isRoundedTrip"
        class="w-full h-[111px] flex gap-3 expandAnimation border rounded-3xl p-6 mt-6" 
        :style="{ height: isTripInfoExpanded ? tripInfoHeightReturn + 32 + 42 + 'px' : tripInfoHeightReturn + 'px' }"
      ><!-- TODO: Height Based on rounded Trip or not -->
        <div
          v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded"
          class=" w-3 h-full  flex flex-col items-center justify-between relative  animateFade"
          :class="[ dynamicClass.paddingLine ]"
        >
          <div class=" w-3 h-3 ronded-full bg-[#EB2C27] rounded-full z-10"></div>
          <div class=" absolute h-full bottom-0 border-dashed border-l-2 border-[#E5E7EB]"></div>
          <div class=" w-3 h-3 ronded-full bg-[#E5E7EB] rounded-full z-10"></div>
          
          <div
            class=" w-full bg-white h-[10px] absolute top-0 left-0"></div>
          <div
            class=" w-full bg-white absolute bottom-0 left-0 expandAnimation"
            :class="dynamicClass.overlayLine"></div>
        </div>
        <div
          class=" w-full h-full flex flex-col justify-between"
          :class="[ scheduleStore.isRoundedTrip &&  isTripInfoExpanded ? 'pr-6' : '']
        ">

          <!-- Rounded Trip Only -->
          <div v-if="scheduleStore.isRoundedTrip" class=" w-full flex justify-between" :class="[ isTripInfoExpanded ? 'mb-4' : 'mb-2' ]">
            <!-- Date Time Info -->
            <div class=" flex items-center gap-3 text-[#555555]">
            <span
              id="departureDate"
              :data-departure-date-ymd="formattingDateYMD(scheduleStore.date)"
              :data-departure-date-formatted="$d(scheduleStore.date, 'long')"
            >
              {{ $d(scheduleStore.dateReturn, 'long') }}
            </span>
            <div class=" w-2 h-2 rounded-full bg-[#1F2937]"></div>
            <span
              id="departureTime"
              :data-depature-time="scheduleStore.selectedDepartureTimeReturn.departure_time"
            >
              {{ scheduleStore.selectedDepartureTimeReturn.departure_time }}
            </span>
            </div>

            <RoundtripLabel :isReturn="true" />
          </div>

          <!-- Rounded Trip Only -->
          <div
            v-if="scheduleStore.isRoundedTrip && !isTripInfoExpanded"
            class=" leading-none text-xl font-semibold text-[#1F2937] flex items-center gap-1"
          >
            <!-- Departure -->
            <span>
              {{ scheduleStore.selectedDestinationPool.destination_pool }}
            </span>

            <img src="@/assets/images/arrow-right.svg" alt="arrow-right">

            <!-- Destination -->
            <span>
              {{ scheduleStore.selectedDeparturePool.pool_name }}
            </span>

          </div>

          <!-- Departure -->
          <div class=" flex flex-col" :class="[dynamicClass.parentEl]">

            <!-- Title -->
            <div v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded" class=" text-2xl text-[#1F2937] font-bold leading-[27px]">
              <span
                id="destinationOutletName"
                :data-destination-outlet-name="scheduleStore.selectedDestinationPool.destination_pool"
              >
                {{ scheduleStore.selectedDestinationPool.destination_pool }}
              </span>
              <span class="animateFade" :class="[dynamicClass.city]">, {{ scheduleStore.selectedDestinationPool.destination_city }}</span>
            </div>

            <!-- Dynamic Element -->
            <div v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded" ref="departureElReturn" :key="1" class="animateFade" :class="[dynamicClass.detailDepartureElReturn]">
              <!-- Address -->
              <div class="text-base text-[#71747D] line-clamp-1">
                {{ scheduleStore.selectedDestinationPool.alamat }}
              </div>

              <!-- Seat -->
              <div class=" w-full py-3 px-4 flex border-[1px] border-[#E5E7EB] rounded-2xl mt-3">
                <div class=" pr-4 flex items-center">
                  <img src="@/assets/images/ic-seat.svg" alt="ic-seat">
                </div>
                <div class="w-[552px] text-[#71747D] text-base">
                  <span
                    v-for="(seat, index) in scheduleStore.selectedSeatsReturn"
                    :id="`seat_list_${index+1}`"
                    :data-seat-numb="seat.label"
                  >
                    {{ `${$t('tripCard.seats', 1)} ${seat.label}${index === scheduleStore.selectedSeatsReturn.length - 1 ? '' : ','} ` }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Destination -->
          <div class=" flex flex-col" :class="[dynamicClass.parentEl]">
            <!-- Title -->
            <div v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded" class=" text-2xl text-[#1F2937] font-bold leading-[27px]">
              <span
                :data-departure-outlet-name="scheduleStore.selectedDeparturePool.pool_name"
                id="departureOutletName"
              >  
                {{ scheduleStore.selectedDeparturePool.pool_name }}
              </span>
              <span class="animateFade" :class="[dynamicClass.city]">, {{ scheduleStore.selectedDeparturePool.city }}</span>
            </div>

            <!-- Dynamic Element -->
            <div v-if="!scheduleStore.isRoundedTrip || isTripInfoExpanded" ref="destinationEl" :key="2" class="animateFade" :class="[dynamicClass.detailDestinationEl]">
              <!-- Address -->
              <div class="text-base text-[#71747D] line-clamp-1">
                {{ scheduleStore.selectedDeparturePool.pool_full_address }}
              </div>
            </div>
            
          </div>
        </div>
      </div>



      <!-- Time Info -->
      <div v-if="!scheduleStore.isRoundedTrip" class="w-full py-3 flex justify-center gap-2 text-xl mt-3 items-center text-[#1F2937]">
        <span
          id="departureDate"
          :data-departure-date-ymd="formattingDateYMD(scheduleStore.date)"
          :data-departure-date-formatted="$d(scheduleStore.date, 'long')"
          class=" font-semibold"
        >
          {{ $d(scheduleStore.date, 'long') }}
        </span>
        <div class=" w-2 h-2 rounded-full bg-[#1F2937]"></div>
        <span
          id="departureTime"
          :data-depature-time="scheduleStore.selectedDepartureTime.departure_time"
          class=" font-semibold"
        >
          {{ scheduleStore.selectedDepartureTime.departure_time }}
        </span>
      </div>

      <!-- CTA -->
      <div class=" w-full flex justify-center mt-6 relative" :class="[ `text-[${colors.primaryColor}]` ]">

        <div
          @click="onClickExpandCard"
          id="btnToggleTripInfo"
          class="cursor-pointer flex items-center gap-3"
        >
          <Caret class="animateRotate" :class="dynamicClass.icCaret" />
          
          {{ isTripInfoExpanded ? $t('tripCard.hide') : $t('tripCard.show') }}
        </div>

        <div
          v-show="isChangeLocation"
          @click="$router.push({ name: 'schedule' })"
          id="btnChangeReservation"
          class="text-lg font-medium absolute right-0"
        >
          {{ $t('tripCard.changeLocation') }}
        </div>
      </div>
    </div>
</template>
