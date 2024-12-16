<script setup>
import { onMounted } from 'vue';
import { useScheduleStore } from '@/store/ScheduleStore';
import { formattingNumber, formattingDateYMD } from '@/utils';
import { useTNC } from '@/composeable/thanks';

import ExpandedInfoContent from '@/components/v2/TripDetail/PriceInfo/ExpandedInfoContent.vue';
import Button from '@/components/v2/Common/Button.vue';
import Seat from '@/components/v2/ic/Seat.vue';
import RoundtripLabel from '@/components/v2/Schedule/RoundtripLabel.vue';
import QrcodeVue from 'qrcode.vue';

const scheduleStore = useScheduleStore();

const { isTnC, tnc, TnCModal, tncInit } = useTNC();
onMounted(async() => {
  await tncInit();
})
</script>

<template>
  <div
      class=" w-full h-[1760px]  rounded-[36px] bg-white flex flex-col gap-8 p-8"
    >
      
      <!-- Not Rounded trip -->
      <template v-if="!scheduleStore.isRoundedTrip">
        <!-- Route Info -->
        <div class="w-full h-fit flex gap-3">
          <div class=" w-3 h-full  flex flex-col items-center justify-between relative pt-2 pb-[46px]">
            <div class=" w-3 h-3 ronded-full bg-[#EB2C27] rounded-full z-10"></div>
            <div class=" absolute h-full bottom-0 border-dashed border-l-2 border-[#E5E7EB]"></div>
            <div class=" w-3 h-3 ronded-full bg-[#E5E7EB] rounded-full z-10"></div>
            
            <div
              class=" w-full bg-white h-[10px] absolute top-0 left-0"></div>
            <div
              class=" w-full bg-white h-[50px] absolute bottom-0 left-0 expandAnimation"></div>
          </div>
          <div class=" w-full h-full flex flex-col justify-between">
            <!-- Departure -->
            <div class=" flex flex-col gap-3 mb-4">

              <!-- Title -->
              <div
                class=" text-2xl font-bold leading-[27px] text-[#1F2937]"
                id="departurePoolName"
                :data-departure-pool-name="scheduleStore.selectedDeparturePool.pool_name"
              >
                {{ scheduleStore.selectedDeparturePool.pool_name }}
              </div>

              <!-- Dynamic Element -->
              <div
                class="animateFade h-fill"
              >
                <!-- Address -->
                <div class="text-base text-[#71747D] line-clamp-1">
                  {{ scheduleStore.selectedDeparturePool.pool_full_address }}
                </div>

                <!-- Seat -->
                <div class=" w-full py-3 px-4 flex border-[1px] border-[#E5E7EB] rounded-2xl mt-3">
                  <div class=" pr-4 flex items-center">
                    <Seat/>
                  </div>
                  <div class="w-[552px] text-[#71747D] text-base">
                    <span
                      v-for="(seat, index) in scheduleStore.selectedSeats"
                      :id="`seat_list_${index+1}`"
                      :data-seat-numb="seat.label"
                    >
                      {{ `${$t('tripCard.seats', 1)}
                      ${seat.label}${index === scheduleStore.selectedSeats.length - 1 ? '' : ','} `
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Destination -->
            <div class=" flex flex-col gap-3">
              <!-- Title -->
              <div
                class=" text-2xl font-bold leading-[27px] text-[#1F2937]"
                id="destinationOutletName"
                :data-destination-outlet-name="scheduleStore.selectedDestinationPool.destination_pool"
              >
                {{ scheduleStore.selectedDestinationPool.destination_pool }}
              </div>

              <!-- Dynamic Element -->
              <div ref="destinationEl" :key="2" class="h-[28px]">
                <!-- Address -->
                <div class="text-base text-[#71747D] line-clamp-1">
                  {{ scheduleStore.selectedDestinationPool.alamat }}
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <!-- Time Info -->
        <div class="w-full flex justify-center gap-2 text-xl">
          <span
            class=" font-semibold"
            id="departureDate"
            :data-departure-date-ymd="formattingDateYMD(scheduleStore.date)"
            :data-departure-date-formatted="$d(scheduleStore.date, 'long')"
          >
            {{ $d(scheduleStore.date, 'long') }}
          </span>
          <div class=" w-2 h-2 rounded-full"></div>
          <span
            class=" font-semibold"
            id="departureTime"
            :data-depature-time="scheduleStore.selectedDepartureTime.departure_time"
          >
            {{ scheduleStore.selectedDepartureTime.departure_time }}
          </span>
          <!-- <div class=" w-2 h-2 rounded-full"></div>
          <span>
            Estimasi <b> 3 </b> Jam
          </span> -->
        </div>
      </template>

      <!-- Rounded Trip Info -->
      <div v-if="scheduleStore.isRoundedTrip">      
        <!-- Route Info -->
        <div
          class="w-full flex gap-3 border rounded-3xl p-6 h-fit mb-4" 
        >
            <div
              class=" w-full h-full flex flex-col justify-between"
            >
              <!-- Rounded Trip Only -->
              <div class=" w-full flex justify-between mb-4">
                <!-- Date Time Info -->
                <div class=" flex items-center gap-3 text-[#555555]">
                <span>
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

              <!-- Departure -->
              <div class=" flex flex-col gap-3 mb-4">

                <!-- Title -->
                <div class=" text-2xl text-[#1F2937] font-bold leading-[27px]">
                  <span>  
                    {{ scheduleStore.selectedDeparturePool.pool_name }}
                  </span>
                </div>

                <!-- Dynamic Element -->
                <div
                  ref="departureEl"
                  :key="1"
                  class="animateFade opacity-100 h-fit visible"
                >
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
              <div class=" flex flex-col gap-3">
                <!-- Title -->
                <div class=" text-2xl text-[#1F2937] font-bold leading-[27px]">
                  <span>
                    {{ scheduleStore.selectedDestinationPool.destination_pool }}
                  </span>
                </div>

                <!-- Dynamic Element -->
                <div ref="destinationEl" :key="2" class="animateFade opacity-100 h-[28px] visible">
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
          class="w-full flex gap-3 border rounded-3xl p-6 h-fit" 
        >
          <div
            class=" w-full h-full flex flex-col justify-between"
          >
            <!-- Rounded Trip Only -->
            <div class=" w-full flex justify-between mb-4">
              <!-- Date Time Info -->
              <div class=" flex items-center gap-3 text-[#555555]">
              <span>
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

            <!-- Departure -->
            <div class=" flex flex-col gap-3 mb-4">

              <!-- Title -->
              <div class=" text-2xl text-[#1F2937] font-bold leading-[27px]">
                <span>  
                  {{ scheduleStore.selectedDestinationPool.destination_pool }}
                </span>
              </div>

              <!-- Dynamic Element -->
              <div
                ref="departureEl"
                :key="1"
                class="animateFade opacity-100 h-fit visible"
              >
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
            <div class=" flex flex-col gap-3">
              <!-- Title -->
              <div class=" text-2xl text-[#1F2937] font-bold leading-[27px]">
                <span>
                  {{ scheduleStore.selectedDeparturePool.pool_name }}
                </span>
              </div>

              <!-- Dynamic Element -->
              <div ref="destinationEl" :key="2" class="animateFade opacity-100 h-[28px] visible">
                <!-- Address -->
                <div class="text-base text-[#71747D] line-clamp-1">
                  
                  {{ scheduleStore.selectedDeparturePool.pool_full_address }}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <hr>

      <!-- Total Price -->
      <div>
        <div class="w-full flex justify-between items-start">
          <div class=" text-lg text-[#71747D] font-medium">
            {{ $t('priceDetailCard.totalPrice') }}
          </div>

          <div
            class=" font-bold text-[32px] leading-[41.58px] text-[#1F2937]"
            id="totalTicketPrice"
            :data-total-ticket-price="scheduleStore.totalTicketPriceNewAsmat"
            :data-total-ticket-price-formatted="formattingNumber(scheduleStore.totalTicketPriceNewAsmat)"
          >
            Rp. {{ formattingNumber(scheduleStore.totalTicketPriceNewAsmat) }}
          </div>
        </div>  
      </div>

      <!-- Include Price -->
      <div v-if="features.isInsurance || scheduleStore.appliedVoucher" class=" text-lg text-[#71747D]">
          {{ $t('priceDetailCard.include') }} :
      
        <!-- Insurance -->
        <div v-if="features.isInsurance">  
          <div
            id="insuranceRate"
            :data-insurance-rate="scheduleStore.insuranceTotalNewAsmat"
            class="text-[#15803D] text-xl font-medium flex items-center gap-2"
          >
            <img src="@/assets/images/ic-shield.svg" alt="ic-shield">
            {{ $t('priceDetailCard.travelInsurance') }} (+{{ formattingNumber(scheduleStore.insuranceTotalNewAsmat)  }}) 
          </div>
        </div>
        <!-- Voucher -->
        <div v-if="scheduleStore.appliedVoucher">
          <div
            id="discount"
            :data-discount="scheduleStore.voucherData.deduction_nominal"
            class="text-[#15803D] text-xl font-medium flex items-center gap-2"
          >
            <img src="@/assets/images/ic_voucher_green.svg" alt="ic-voucher">
            {{ $t('priceDetailCard.deduction') }}
            - Rp. {{ formattingNumber(scheduleStore.voucherData.deduction_nominal) }}
          </div>
        </div>
      </div>

      <!-- Divider -->
      <hr>

      <!-- Customer Detail -->
      <div>
        <div class=" text-lg mb-3 text-[#71747D]">
          {{ $t('thanks.detailCustomer') }}
        </div>
        <div class=" flex flex-col gap-4">
          <ExpandedInfoContent
            text-size="xl"
            id="phoneNumb"
            :data-phone-numb="scheduleStore.customerInfo.PhoneNo"
          >
            <template #label>
              {{ $t('tripCard.phoneNo') }}
            </template>
            <template #content>
              {{ scheduleStore.customerInfo.PhoneNo }}
            </template>
          </ExpandedInfoContent>
          <ExpandedInfoContent
            text-size="xl"
            id="customerName"
            :data-customer-name="scheduleStore.customerInfo.name"
          >
            <template #label>
              {{ $t('thanks.customerName') }}
            </template>
            <template #content>
              <span v-if="scheduleStore.customerInfo.name.length > 12">
                {{ scheduleStore.customerInfo.name.slice(0, 12) + "..." }}
              </span>
              <span v-else>
                {{ scheduleStore.customerInfo.name }}
              </span>
            </template>
          </ExpandedInfoContent>
          <ExpandedInfoContent
            text-size="xl"
            id="bookingCode"
            :data-booking-code="scheduleStore.bookingInfo.booking_code"
          >
            <template #label>
              {{ $t('thanks.bookingCode') }}
            </template>
            <template #content>
              {{ scheduleStore.bookingInfo.booking_code }}
            </template>
          </ExpandedInfoContent>
          <ExpandedInfoContent text-size="xl" >
            <template #label>
              {{ $t('thanks.otp') }}
            </template>
            <template #content>
              {{ scheduleStore.otpNewAsmat }}
            </template>
          </ExpandedInfoContent>
        </div>
      </div>

      <!-- Divider -->
      <hr>

      <template v-if="!scheduleStore.isRoundedTrip">
        <!-- Passengers -->
        <div>
          <div class=" text-lg mb-3 text-[#71747D]">
            {{ $t('thanks.detailPassengers') }}
          </div>

          <div class=" flex flex-col gap-[14px] max-h-[600px] overflow-y-auto">
            <div v-for="(passenger, index) in scheduleStore.updateBookingSeats" class=" w-full border border-[#E5E7EB] p-4 flex gap-[10px] rounded-xl items-center">
              <div class=" w-[526px] h-full flex flex-col gap-[14px]">
                <div class=" flex items-center">
                  <div class=" w-[112px] text-xl font-medium text-[#71747D]">
                    {{ $t('thanks.passengerName') }}
                  </div>
                  <div
                    class=" w-fit font-medium text-xl text-[#1F2937]"
                    :id="`passengerInfo_${index+1}`"
                    :data-passenger-name="passenger.name"
                    :data-passenger-seat-numb="passenger.seat_no "
                  >
                    : <span v-if="passenger.name.length > 14">
                        {{ passenger.name.slice(0, 14) + "..." }}
                      </span>
                      <span v-else>
                        {{ passenger.name }}
                      </span>({{ $t('thanks.seat') }} {{ passenger.seat_no }})
                  </div>
                </div>
                <div class=" flex items-center">
                  <div class=" w-[112px] text-xl font-medium text-[#71747D]">
                    {{ $t('thanks.ticket') }}
                  </div>
                  <div
                    :id="`ticketNumb_${index+1}`"
                    :data-ticket-numb="passenger.ticket"
                    class=" w-fit font-medium text-xl text-[#1F2937]"
                  >
                    : {{ passenger.ticket }}
                  </div>
                </div>
              </div>
              <div class=" w-[64px] h-full">
                <QrcodeVue :value="passenger.ticket" :size="64"  />
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class=" w-full h-fit p-4 bg-[#F4F9FF] rounded-xl">
          <div class="flex items center gap-2 mb-4">
            <img src="@/assets/images/ic-info.svg" alt="ic-info">
            <span class=" font-medium text-[#3B82F6]">
              {{ $t('thanks.important') }}
            </span>
          </div>

          <div class=" font-medium text-[#1F2937] text-base mb-4">
            {{ $t('thanks.customerInfo') }}
          </div>

          <Button
            id="btnOpenModalTnc"
            @click="TnCModal"
            type="white"
            class=" border border-[#3B82F6] text-[#3B82F6] font-medium"
            size="sm"
          >
          {{ $t('thanks.ctaTnc') }}
          </Button>
        </div>
      </template>

      <div class=" flex flex-col gap-[14px] max-h-[600px] overflow-y-auto" v-if="scheduleStore.isRoundedTrip">
        <!-- Trip -->
        <div class=" text-lg mb-3 text-[#71747D]">
            {{ $t('thanks.detailPassengers') }}
        </div>
        <div class=" w-full flex gap-2">
          <RoundtripLabel/>
          <div class=" text-[#1F2937] flex gap-1 items-center font-semibold">
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
        </div>
        <div class=" flex flex-col gap-[14px]">
          <div v-for="(passenger, index) in scheduleStore.updateBookingSeats" class=" w-full border border-[#E5E7EB] p-4 flex gap-[10px] rounded-xl items-center">
            <div class=" w-[526px] h-full flex flex-col gap-[14px]">
              <div class=" flex items-center">
                <div class=" w-[112px] text-xl font-medium text-[#71747D]">
                  {{ $t('thanks.passengerName') }}
                </div>
                <div
                  class=" w-fit font-medium text-xl text-[#1F2937]"
                  :id="`passengerInfo_${index+1}`"
                  :data-passenger-name="passenger.name"
                  :data-passenger-seat-numb="passenger.seat_no "
                >
                  : <span v-if="passenger.name.length > 14">
                      {{ passenger.name.slice(0, 14) + "..." }}
                    </span>
                    <span v-else>
                      {{ passenger.name }}
                    </span>({{ $t('thanks.seat') }} {{ passenger.seat_no }})
                </div>
              </div>
              <div class=" flex items-center">
                <div class=" w-[112px] text-xl font-medium text-[#71747D]">
                  {{ $t('thanks.ticket') }}
                </div>
                <div
                  :id="`ticketNumb_${index+1}`"
                  :data-ticket-numb="passenger.ticket"
                  class=" w-fit font-medium text-xl text-[#1F2937]"
                >
                  : {{ passenger.ticket }}
                </div>
              </div>
            </div>
            <div class=" w-[64px] h-full">
              <QrcodeVue :value="passenger.ticket" :size="64"  />
            </div>
          </div>
        </div>

        <hr>

        <!-- Trip Return -->
        <div class=" w-full flex gap-2">
          <RoundtripLabel :isReturn="true" />
          <div class=" text-[#1F2937] flex gap-1 items-center font-semibold">
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
        </div>
        <div class=" flex flex-col gap-[14px]">
          <div v-for="(passenger, index) in scheduleStore.updateBookingSeatsReturn" class=" w-full border border-[#E5E7EB] p-4 flex gap-[10px] rounded-xl items-center">
            <div class=" w-[526px] h-full flex flex-col gap-[14px]">
              <div class=" flex items-center">
                <div class=" w-[112px] text-xl font-medium text-[#71747D]">
                  {{ $t('thanks.passengerName') }}
                </div>
                <div
                  class=" w-fit font-medium text-xl text-[#1F2937]"
                  :id="`passengerInfo_${index+1}`"
                  :data-passenger-name="passenger.name"
                  :data-passenger-seat-numb="passenger.seat_no "
                >
                  : <span v-if="passenger.name.length > 14">
                      {{ passenger.name.slice(0, 14) + "..." }}
                    </span>
                    <span v-else>
                      {{ passenger.name }}
                    </span>({{ $t('thanks.seat') }} {{ passenger.seat_no }})
                </div>
              </div>
              <div class=" flex items-center">
                <div class=" w-[112px] text-xl font-medium text-[#71747D]">
                  {{ $t('thanks.ticket') }}
                </div>
                <div
                  :id="`ticketNumb_${index+1}`"
                  :data-ticket-numb="passenger.ticket"
                  class=" w-fit font-medium text-xl text-[#1F2937]"
                >
                  : {{ passenger.ticket }}
                </div>
              </div>
            </div>
            <div class=" w-[64px] h-full">
              <QrcodeVue :value="passenger.ticket" :size="64"  />
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class=" w-full h-fit p-4 bg-[#F4F9FF] rounded-xl">
          <div class="flex items center gap-2 mb-4">
            <img src="@/assets/images/ic-info.svg" alt="ic-info">
            <span class=" font-medium text-[#3B82F6]">
              {{ $t('thanks.important') }}
            </span>
          </div>

          <div class=" font-medium text-[#1F2937] text-base mb-4">
            {{ $t('thanks.customerInfo') }}
          </div>

          <Button
            id="btnOpenModalTnc"
            @click="TnCModal"
            type="white"
            class=" border border-[#3B82F6] text-[#3B82F6] font-medium"
            size="sm"
          >
          {{ $t('thanks.ctaTnc') }}
          </Button>
        </div>
      </div>
     


      <!-- TNC Modal -->
      <Teleport to='.appWrapper'>
        <Transition :duration="350" name="nested">
          <div id="modalTnc" v-show="isTnC" class="w-full h-full absolute top-0 flex justify-end items-center z-[100]">

            <div @click="TnCModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
            <div class="inner flex z-[99]">
                <div @click="TnCModal" class="bg-[#C66C6C] flex justify-center items-center cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
                    <img src="@/assets/images/x.png" class="">
                </div>
                  
                <div
                  v-html="tnc?.data"
                  class="w-[755px] pt-[49px] pl-[64px] pr-[32px] rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[1509px]  relative"
                  :class="`bg-[${colors.secondaryColor}]`"
                >
                </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
</template>