<script setup>

const props = defineProps({ data: Object });

</script>

<template>
    <div
      class="rounded-[35px] px-[35px] w-[700px] h-[auto] relative flex flex-wrap pt-[32px] pb-[35px] mb-[60px] mt-[30px]"
      :class="`bg-[${colors.secondaryColor}]`"
    >
      <div class="mt-[15px] mr-[10px]">
          <div class="h-[17px] w-[17px] rounded-full bg-[#FD0000] "></div>
          <img src="../../assets/images/reservation/arrow.png" class="pl-[6px]">
          <div class="h-[17px] w-[17px] rounded-full" :class="`bg-[${colors.secondaryColor200}]`"></div>
      </div>

      <!-- Route -->
      <div class="flex flex-col justify-between w-[550px]">
        <div class="flex flex-col">
          <div
            class="font-bold text-[24px] pt-[7px]"
            :class="`text-[${colors.fontPrimaryColor}]`"
          >
            {{ props.data.departure_city }}
          </div>
          <div class=" text-[19px] font-normal text-[#6B6B6B] line-clamp-1">
            {{ props?.data?.outlet_departure_address }}
          </div>
        </div>
        
        <div class="flex flex-col">
          <div class="font-bold pt-[90px] text-[24px]">{{ props.data.destination_city }}</div>
          <div class=" text-[19px] font-normal text-[#6B6B6B] line-clamp-1">
            {{ props?.data?.outlet_destination_address }}
          </div>
        </div>
        
      </div>

      <div class="flex items-center w-full mt-[25px]">
          <div
            class="text-[22px] font-semibold"
            :class="`text-[${colors.primaryColor}]`"
          >
            {{ props.data.departure_time }}
          </div>
          <div class="flex items-center pl-[17px]">
              <div
                class="h-[17px] w-[17px] rounded-full"
                :class="`bg-[${colors.primaryColor40}]`"
              ></div>
              <div
                class="text-[22px] font-semibold pl-[19px]"
                :class="`text-[${colors.primaryColor}]`"
              >{{ props.data.departure_date }}</div>
          </div>
      </div>

      <div class="w-full mt-[20px]">
          <!-- Customer Detail -->
          <div class="font-bold text-[23px] pt-[20px]" :class="`text-[${colors.fontPrimaryColor}]`">
            {{ $t('boarding.customerDetail') }}
          </div>
          <div class="flex justify-between items-center mb-[10px] mt-[13px]">
              <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                {{ $t('boarding.name') }}
              </div>
              <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                {{ props.data.customer_name }}
              </div>
          </div>
          <div class="flex justify-between items-center mb-[10px] mt-[13px]">
              <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                {{ $t('boarding.bookingCode') }}
              </div>
              <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                {{ props.data.booking_code }}
              </div>
          </div>

          <div class="font-bold text-[23px] pt-[20px]" :class="`text-[${colors.fontPrimaryColor}]`">
          {{ $t('boarding.passengersDetail', props?.data?.passengers?.length || 1) }}
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4 max-h-[544px] overflow-y-auto">
            <div v-for="passenger in props.data.passengers" class="border-[1px] border-[#B5B5B5] px-4 py-3 flex gap-3 rounded-[15px] overflow-hidden">
              <div class="flex flex-col gap-1 w-full">
                <div class=" text-xl line-clamp-1 font-semibold" :class="`text-[${colors.fontPrimaryColor}]`" >
                  {{ passenger.passenger_name }}
                </div>
                <div class=" text-xl text-[#818181]" >
                  {{ $t('boarding.seatDisplay') }} {{ passenger.seat_no }}
                </div>
                <div class=" text-xl text-[#818181]" >
                  {{ passenger.ticket_no }}
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
</template>
