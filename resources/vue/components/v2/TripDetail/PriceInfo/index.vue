<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { formattingNumber } from '@/utils';
import { useScheduleStore } from '@/store/ScheduleStore';
import { storeToRefs } from 'pinia';

import Caret from '@/components/v2/ic/Caret.vue';
import ExpandedInfo from '@/components/v2/TripDetail/PriceInfo/ExpandedInfo.vue';
import ExpandedInfoContent from '@/components/v2/TripDetail/PriceInfo/ExpandedInfoContent.vue';
import RoundtripLabel from '@/components/v2/Schedule/RoundtripLabel.vue';

const scheduleStore = useScheduleStore();
const { appliedVoucher, selectedSeats, selectedSeatsReturn } = storeToRefs(scheduleStore);

const datas = [
  {
    label: 'Kursi 2',
    content: 'Rp. 100.000'
  },
  {
    label: 'Kursi 3',
    content: 'Rp. 96.000'
  },
];

const parentEl = ref(null);
const expandedEl = ref(null);
const unExpandedEl = ref(null);
const dynamicHeight = ref(0);
const isExpanded = ref(false);

const dynamicClass = computed(() => {
  return {
    icCaret: isExpanded.value ? 'rotate-180' : 'rotate-0'
  }
});

watch([isExpanded, appliedVoucher], async () => {
  await nextTick();
  console.log(expandedEl?.value?.scrollHeight)
  isExpanded.value ?
    dynamicHeight.value = expandedEl?.value?.scrollHeight :
    dynamicHeight.value = unExpandedEl?.value?.scrollHeight
});

onMounted(() => {
  console.log('scrollHeight', expandedEl.value.scrollHeight);

  dynamicHeight.value = unExpandedEl.value.scrollHeight;
});

defineExpose({
  isPriceInfoExpanded: isExpanded
});



</script>


<template>
  <div ref="parentEl" class=" w-[696px] h-fit p-8 flex flex-col gap-6 rounded-[35px] bg-white" >
    <!-- Dynamic Element -->
    <div class=" w-full relative expandAnimation" :style="{ height: dynamicHeight + 'px' }">
      <Transition>
        <div v-show="!isExpanded" ref="unExpandedEl" class="absolute left-0 top-0">
          <div v-if="features.isInsurance || scheduleStore.appliedVoucher" class=" text-lg text-[#71747D]">
            {{ $t('priceDetailCard.include') }} :
          </div>

          <!-- Insurance -->
          <div
            v-if="features.isInsurance"
            class="text-[#15803D] text-xl font-medium flex items-center gap-2"
            id="insuranceRate"
            :data-insurance-rate="scheduleStore.insuranceTotalNewAsmat"
          >
            <img src="@/assets/images/ic-shield.svg" alt="ic-shield">
            {{ $t('priceDetailCard.travelInsurance') }} (+{{ formattingNumber(scheduleStore.insuranceTotalNewAsmat)  }}) 
          </div>
          <!-- Voucher -->
          <div v-if="scheduleStore.appliedVoucher" class="flex items-center text-[#10B94E] text-[20px] font-semibold mt-2">
            <img src="@/assets/images/ic_voucher_green.svg" class="mr-1" alt="insurance_ic">
            {{ $t('priceDetailCard.deduction') }} (-{{ formattingNumber(scheduleStore.voucherData.deduction_nominal)  }})
          </div>
        </div>
      </Transition>

      <Transition>
        <div v-show="isExpanded" ref="expandedEl" class="w-full flex flex-col gap-6 absolute left-0 top-0">
          <!-- Trip Price -->
          <ExpandedInfo :is-content-max="selectedSeats?.length >= 8 ? true : false">
            <template #tag>
                {{ scheduleStore.selectedDeparturePool.pool_name }}
                <img src="@/assets/images/arrow-right.svg" alt="arrow-right">
                {{ scheduleStore.selectedDestinationPool.destination_pool }}
            </template>

            <template #tagRightSide>
              <RoundtripLabel v-if="scheduleStore.isRoundedTrip" />
            </template>

            <ExpandedInfoContent
              v-for="(seat, index) in scheduleStore.selectedSeats"
              class=" mb-3"
              :id="`seatPrice_${index+1}`"
              :data-seat-numb="seat.label"
              :data-seat-price="seat.total_price"
            >
              <template #label>
                {{ $t('priceDetailCard.seat') }} {{ seat.label }}
              </template>
              <template #content>
                Rp. {{ formattingNumber(seat.total_price) }}
              </template>
            </ExpandedInfoContent>
            
          </ExpandedInfo>

          <!-- Trip Price Return (Roundtrip Only) -->
          <ExpandedInfo
            v-if="scheduleStore.isRoundedTrip"
            :is-content-max="selectedSeatsReturn?.length >= 8 ? true : false"
          >
            <template #tag> 
              {{ scheduleStore.selectedDestinationPool.destination_pool }}
              <img src="@/assets/images/arrow-right.svg" alt="arrow-right">
              {{ scheduleStore.selectedDeparturePool.pool_name }}
            </template>

            <template #tagRightSide>
              <RoundtripLabel :isReturn="true" />
            </template>

            <ExpandedInfoContent
              v-for="(seat, index) in scheduleStore.selectedSeatsReturn"
              class=" mb-3"
              :id="`seatPrice_${index+1}`"
              :data-seat-numb="seat.label"
              :data-seat-price="seat.total_price"
            >
              <template #label>
                {{ $t('priceDetailCard.seat') }} {{ seat.label }}
              </template>
              <template #content>
                Rp. {{ formattingNumber(seat.total_price) }}
              </template>
            </ExpandedInfoContent>
            
          </ExpandedInfo>


          <!-- Other Price -->
          <ExpandedInfo v-if="features.isInsurance || scheduleStore.appliedVoucher">
            <template #tag>
              {{ $t('priceDetailCard.other') }}
            </template>

            <ExpandedInfoContent
              v-if="features.isInsurance"
              id="insuranceRateExpanded"
              :data-insurance-rate="scheduleStore.insuranceTotalNewAsmat"
            >
              <template #label>
                <img src="@/assets/images/ic-shield.svg" alt="ic-shield" class=" mr-1.5">
                {{ $t('priceDetailCard.travelInsurance') }}
              </template>
              <template #content>
                + Rp. {{ formattingNumber(scheduleStore.insuranceTotalNewAsmat)  }}
              </template>
            </ExpandedInfoContent>

            <ExpandedInfoContent v-if="scheduleStore.appliedVoucher" >
              <template #label>
                <img src="@/assets/images/ic_voucher_green.svg" alt="ic-shield" class=" mr-1.5">
                {{ $t('priceDetailCard.deduction') }}
              </template>
              <template #content>
                - Rp. {{ formattingNumber(scheduleStore.voucherData.deduction_nominal) }}
              </template>
            </ExpandedInfoContent>
          </ExpandedInfo>
        </div>
      </Transition>
    </div>

    <!-- Price Total -->
    <div class="w-full flex justify-between items-start">
      <div class=" text-lg text-[#71747D] font-medium">
        {{ $t('priceDetailCard.totalPrice') }}
      </div>

      <div
        id="totalTicketPrice"
        :data-total-ticket-price="scheduleStore.totalTicketPriceNewAsmat"
        class=" font-bold text-[32px] leading-[41.58px]"
      >
        Rp. {{ formattingNumber(scheduleStore.totalTicketPriceNewAsmat) }}
      </div>

      
    </div>

    <!-- CTA -->
    <div
      @click="isExpanded = !isExpanded"
      id="btnTogglePriceInfo"
      :data-is-expanded="isExpanded"
      class=" flex justify-center items-center gap-3 text-[#EB2C27] font-medium cursor-pointer"
    >
      <Caret class="animateRotate" :class="dynamicClass.icCaret" />
      {{ $t('priceDetailCard.priceDetails') }}
    </div>
  </div>
</template>

<style>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.23s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .parent {
    transition: height 0.23s ease;
  }
</style>