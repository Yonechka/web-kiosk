<script setup>
  import { useScheduleStore } from '../../store/ScheduleStore';
  import { storeToRefs } from 'pinia';
  import { formattingDate, formattingNumber } from '../../utils';
  import { toRef } from 'vue';
  import QrcodeVue from 'qrcode.vue';

  const props = defineProps({
    width: {
      type: String,
      default: 'w-[full]'
    },
    height: {
      type: String,
      default: 'h-[auto]'
    },
    isScrollMax: Boolean
  });

  const isScrollMax = toRef(() => props.isScrollMax);

  const scheduleStore = useScheduleStore();
  const {
    updateBookingInfo,
    printInfo
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
                <div class="font-bold text-[24px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ updateBookingInfo.departure_city }}</div>
                <div class="text-[19px] font-normal" :class="`text-[${colors.fontSecondaryColor300}]`">
                  <!-- {{ selectedDeparturePool.pool_full_address }} -->
                  <span v-if="updateBookingInfo.outlet_departure_address > 35">
                    {{ updateBookingInfo.outlet_departure_address.slice(0, 35) + "..." }}
                  </span>
                  <span v-else>
                    {{ updateBookingInfo.outlet_departure_address }}
                  </span>
                </div>
                <div class="flex pt-[30px] items-center">
                    <div
                      class="text-[22px] font-semibold"
                      :class="`text-[${colors.primaryColor}]`"
                    >
                      {{ $d(new Date(updateBookingInfo.departure_date), 'long') }}
                    </div>
                    <div class="flex items-center pl-[17px]">
                        <div
                          class="h-[17px] w-[17px] rounded-full"
                          :class="`bg-[${colors.primaryColor40}]`"
                        ></div>
                        <div
                          class="text-[22px] font-semibold pl-[19px]"
                          :class="`text-[${colors.primaryColor}]`"
                        >{{ updateBookingInfo.departure_time }}</div>
                    </div>
                </div>
                <div class="font-bold pt-[25px] text-[24px]">{{ updateBookingInfo.destination_city }}</div>
                <div
                  class="font-normal text-[19px]"
                  :class="`text-[${colors.fontSecondaryColor300}]`"
                >
                  <!-- {{ selectedDestinationPool.destination_pool }} -->
                  <span v-if="updateBookingInfo.outlet_destination_address.length > 35">
                    {{ updateBookingInfo.outlet_destination_address.slice(0, 35) + "..." }}
                  </span>
                  <span v-else>
                    {{ updateBookingInfo.outlet_destination_address }}
                  </span>
                </div>
            </div>
          </div>
        <div class="w-full mt-[20px]">
            <!-- Pricing -->
            <!-- <div class="flex justify-between items-center">
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">Harga Kursi</div>
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">Rp. {{ formattingNumber(selectedDepartureTime.total_ticket_price) }} </div>
            </div> -->
            <div class="flex justify-between items-center  pt-[9px]">
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">{{ $t('tripCard.totalSeats', updateBookingInfo.passengers.length) }}</div>
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">{{ updateBookingInfo.passengers.length }} {{ $t('tripCard.seats', updateBookingInfo.passengers.length) }}</div>
            </div>
            <div class="flex justify-between items-center  pt-[5px]">
                <div class="font-bold text-[29px]" :class="`${colors.fontPrimaryColor}`">Total</div>
                <div class="font-bold text-[29px]" :class="`${colors.fontPrimaryColor}`">Rp. {{ formattingNumber(updateBookingInfo.total_price) }} </div>
            </div>
            <div v-if="features.isInsurance" class="flex flex-col items-end text-[#10B94E] text-[20px] font-semibold pt-[5px]">
              <span class="text-[#71747D] text-[20px] font-medium">{{ $t('tripCard.include') }}</span>
              <div class="flex items-center">
                <img src="../../assets/images/ic_insurance.png" class="mr-2" alt="insurance_ic">
                {{ $t('tripCard.travelInsurance') }} (+{{ formattingNumber(scheduleStore.insuranceTotalNewAsmat)  }})
              </div>
              <div v-if="scheduleStore.appliedVoucher" class="flex items-center text-[#10B94E] text-[20px] font-semibold mt-2">
                <img src="@/assets/images/ic_voucher_green.svg" class="mr-1" alt="insurance_ic">
                Voucher Potongan (-{{ formattingNumber(scheduleStore.voucherData.deduction_nominal)  }})
              </div>
              
            </div> 
            <div v-if="!features.isInsurance && scheduleStore.appliedVoucher" class="flex flex-col items-end text-[#10B94E] text-[20px] font-semibold pt-[5px]">
              <span class="text-[#71747D] text-[20px] font-medium">{{ $t('tripCard.include') }}</span>
              <div v-if="updateBookingInfo.total_discount && updateBookingInfo.total_discount > 0" class="flex items-center text-[#10B94E] text-[20px] font-semibold mt-2">
                <img src="@/assets/images/ic_voucher_green.svg" class="mr-1" alt="insurance_ic">
                Voucher Potongan (-{{ formattingNumber(scheduleStore.voucherData.deduction_nominal)  }})
              </div>
              
            </div>

            <!-- Customer Detail -->
            <div class="font-medium text-xl pt-[20px]" :class="`text-[${colors.fontSecondaryColor300}]`">
              {{ $t('tripCard.detailCustomer') }}
            </div>
            <div class="flex justify-between items-center mb-[10px] mt-[14px]">
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`">{{ $t('tripCard.phoneNo') }}</div>
                <div class="font-medium text-[19px]" :class="`${colors.fontPrimaryColor}`"> {{ updateBookingInfo.phone_no }} </div>
            </div>

            <div class="flex justify-between items-center mb-[10px]">
                <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                  {{ $t('thanks.customerName') }}
                </div>
                <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                  <span v-if="updateBookingInfo.customer_name && updateBookingInfo.customer_name.length > 12">
                    {{ updateBookingInfo.customer_name.slice(0, 12) + "..." }}
                  </span>
                  <span v-else>
                    {{ updateBookingInfo.customer_name }}
                  </span>
                </div>
            </div>

            <div class="flex justify-between items-center mb-[10px]">
                <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                  {{ $t('thanks.bookingCode') }}
                </div>
                <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ updateBookingInfo.booking_code }}</div>
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
                            <img src="../../assets/images/arrow-bottom-white.png" alt="" srcset="">
                        </div>
                    </div>
                </div>
            </div>

            <!-- TNC -->
            <slot></slot>
        </div>
        </div>
    </div>
</template>