<script setup>
  import { useScheduleStore } from '../../store/ScheduleStore';
  import { storeToRefs } from 'pinia';
  import { formattingDate, formattingNumber } from '../../utils';

  const props = defineProps({
    width: {
      type: String,
      default: 'w-[full]'
    },
    height: {
      type: String,
      default: 'h-[auto]'
    }
  });

  const scheduleStore = useScheduleStore();
  const {
    selectedDeparturePool,
    selectedDestinationPool,
    selectedDepartureTime,
    departureDate,
    departureTime,
    totalTicketPrice,
    selectedSeats,
    bookingInfo,
    date
  } = storeToRefs(scheduleStore);
</script>

<template>
    <div class=" rounded-[35px] mt-[67px] relative">
        <div :class="[props.width, props.height, `bg-[${colors.secondaryColor}]`]"  
            class="rounded-[35px] px-[35px] flex flex-col pt-[32px] pb-[35px]">
          <div class="flex">
            <div class="mt-[15px] mr-[10px]">
                <div class="h-[17px] w-[17px] rounded-full bg-[#FD0000]"></div>
                <img src="../../assets/images/reservation/arrow.png" class="pl-[6px]">
                <div class="h-[17px] w-[17px] rounded-full" :class="`bg-[${colors.secondaryColor200}]`"></div>
            </div>

            <!-- Route -->
            <div>
                <div class="font-bold text-[24px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ selectedDeparturePool.city }}</div>
                <div class="text-[19px] font-normal" :class="`text-[${colors.fontSecondaryColor300}]`">
                  <!-- {{ selectedDeparturePool.pool_full_address }} -->
                  <span v-if="selectedDeparturePool.pool_full_address.length > 35">
                    {{ selectedDeparturePool.pool_full_address.slice(0, 35) + "..." }}
                  </span>
                  <span v-else>
                    {{ selectedDeparturePool.pool_full_address }}
                  </span>
                </div>
                <div class="flex pt-[30px] items-center">
                    <div
                      class="text-[22px] font-semibold"
                      :class="`text-[${colors.primaryColor}]`"
                    >
                      {{ $d(new Date(bookingInfo?.departure_date), 'long') }}
                    </div>
                    <div class="flex items-center pl-[17px]">
                        <div
                          class="h-[17px] w-[17px] rounded-full"
                          :class="`bg-[${colors.primaryColor40}]`"
                        ></div>
                        <div
                          class="text-[22px] font-semibold pl-[19px]"
                          :class="`text-[${colors.primaryColor}]`"
                        >{{ selectedDepartureTime.departure_time }}</div>
                    </div>
                </div>
                <div class="font-bold pt-[25px] text-[24px]">{{ selectedDestinationPool.destination_city }}</div>
                <div
                  class="font-normal text-[19px]"
                  :class="`text-[${colors.fontSecondaryColor300}]`"
                >
                  <!-- {{ selectedDestinationPool.destination_pool }} -->
                  <span v-if="selectedDestinationPool.alamat_cabang_lengkap_tujuan.length > 35">
                    {{ selectedDestinationPool.alamat_cabang_lengkap_tujuan.slice(0, 35) + "..." }}
                  </span>
                  <span v-else>
                    {{ selectedDestinationPool.alamat_cabang_lengkap_tujuan }}
                  </span>
                </div>
            </div>
          </div>
        <div class="w-full mt-[20px]">
            <!-- Pricing -->
            <div class="flex justify-between items-center">
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">
                  {{ $t('tripCard.seatPrice') }}
                </div>
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">Rp. {{ formattingNumber(selectedDepartureTime.total_ticket_price) }} </div>
            </div>
            <div class="flex justify-between items-center  pt-[9px]">
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">{{ $t('tripCard.totalSeats', selectedSeats.length) }}</div>
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">{{ selectedSeats.length }} {{ $t('tripCard.seats', 'selectedSeats.length') }}</div>
            </div>
            <div v-if="scheduleStore.appliedVoucher" class="flex justify-between items-center  pt-[9px]">
                <div class="font-medium text-[19px] text-[#10B94E]">Potongan Harga</div>
                <div class="font-medium text-[19px] text-[#10B94E]"> Rp. {{ formattingNumber(scheduleStore?.discountDeductionNominal) }}</div>
            </div>
            <div class="flex justify-between items-center  pt-[5px]">
                <div class="font-bold text-[29px]" :class="`${colors.fontPrimaryColor}`">Total</div>
                <div class="font-bold text-[29px]" :class="`${colors.fontPrimaryColor}`">Rp. {{ formattingNumber(totalTicketPrice) }} </div>
            </div>

            <!-- Customer Detail -->
            <div class="font-medium text-xl pt-[20px]" :class="`text-[${colors.fontSecondaryColor300}]`">
              {{ $t('tripCard.detailCustomer') }}
            </div>
            <div class="flex justify-between items-center mb-[10px] mt-[14px]">
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">
                  {{ $t('tripCard.phoneNo') }}
                </div>
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`"> {{ scheduleStore.customerInfo.PhoneNo }} </div>
            </div>
            <slot name="detail"></slot>
        </div>
        </div>
    </div>
</template>