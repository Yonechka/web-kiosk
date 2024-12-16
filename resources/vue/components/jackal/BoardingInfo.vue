<script setup>
  import { useScheduleStore } from '../../store/ScheduleStore';

  const scheduleStore = useScheduleStore();
</script>

<template>
    <div
      class="rounded-[35px] px-[35px] w-[534px] h-[auto] relative flex flex-wrap pt-[32px] pb-[35px] mb-[60px] mt-[67px]"
      :class="`bg-[${colors.secondaryColor}]`"
    >
            <div class="mt-[15px] mr-[10px]">
                <div class="h-[17px] w-[17px] rounded-full bg-[#FD0000] "></div>
                <img src="../../assets/images/reservation/arrow.png" class="pl-[6px]">
                <div class="h-[17px] w-[17px] rounded-full" :class="`bg-[${colors.secondaryColor200}]`"></div>
            </div>

            <!-- Route -->
            <div>
                <div
                  class="font-bold text-[24px] pt-[7px]"
                  :class="`text-[${colors.fontPrimaryColor}]`"
                >
                  {{ scheduleStore.detailBoarding.departure }}
                </div>
                <div class="font-bold pt-[120px] text-[24px]">{{ scheduleStore.detailBoarding.destination }}</div>
            </div>

            <div class="flex items-center w-full mt-[10px]">
                <div
                  class="text-[22px] font-semibold"
                  :class="`text-[${colors.primaryColor}]`"
                >
                  {{ scheduleStore.detailBoarding.departure_time }}
                </div>
                <div class="flex items-center pl-[17px]">
                    <div
                      class="h-[17px] w-[17px] rounded-full"
                      :class="`bg-[${colors.primaryColor40}]`"
                    ></div>
                    <div
                      class="text-[22px] font-semibold pl-[19px]"
                      :class="`text-[${colors.primaryColor}]`"
                    >{{ scheduleStore.detailBoarding.departure_date }}</div>
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
                    <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`"> {{ scheduleStore.detailBoarding.passengers.name }} </div>
                </div>
                <!-- <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">Nomor Telepon</div>
                    <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ scheduleStore.detailBoarding.passengers.phone_no }}</div>
                </div> -->
                <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                      {{ $t('boarding.bookingCode') }}
                    </div>
                    <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ scheduleStore.detailBoarding.booking_code }}</div>
                </div>
                <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                      {{ $t('boarding.ticket') }}
                    </div>
                    <div class="font-bold text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ scheduleStore.detailBoarding.ticket_no }}</div>
                </div>
                <div class="flex justify-between items-center mb-[10px] mt-[13px]">
                    <div class="font-medium text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">
                      {{ $t('boarding.seatNo') }}
                    </div>
                    <div class="font-bold text-[19px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ $t('boarding.seat') }} {{ scheduleStore.detailBoarding.seat_no }}</div>
                </div>
            </div>
            <img src="../../assets/images/bg-boarding-confirmation.png" class="absolute top-0 left-0 w-full h-full opacity-[0.5]">
    </div>
</template>