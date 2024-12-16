<script setup>
  import { useStore } from '../../../store/Store';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { storeToRefs } from 'pinia';
  import { reactive, computed, ref, onMounted, onActivated, onUnmounted, watch } from 'vue';
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
  import { formattingNumber, formattingDate } from '../../../utils';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import {
    useReservationInitialData,
    useBookingTicket,
    useOnBeforeRouteLeave,
    useKeyboard,
    useOnActivatedEvent,
    useVoucherCheck
  } from '../../../composeable/reservation';

  import LetterKeyboard from '../../../components/daytrans/completed/LetterKeyboard.vue';
  import OverlaySpinner from '../../../components/daytrans/OverlaySpinner.vue';
  import ToastCustom from '../../../components/daytrans/ToastCustom.vue';
  import VoucherCard from '@/components/daytrans/reservation/VoucherCard.vue';

  const router = useRouter();
  const route = useRoute();
  
  const scheduleStore = useScheduleStore();
  const store = useStore();
  const {
    selectedDeparturePool,
    selectedDestinationPool,
    departureTime,
    selectedSeats,
    selectedDepartureTime
  } = storeToRefs(scheduleStore);
  
  /* Initial Data */
  const {
    phoneNo,
    showSpinner,
    showToast,
    toastMessage
  } = useReservationInitialData();

  /* Booking */
  const { bookingTicket } = useBookingTicket(router);
  
  /* Routing */
  onBeforeRouteLeave( async (to, from) => {
    const { init } = useOnBeforeRouteLeave(to, from);
    return init();
  });

  /* Keyboard Function */
  let {
    input,
    isDeleteButtonPressed,
    intervalDuration,
    keyboardClick,
    deleteLetter,
    getIntervalDuration,
    keyUpDeleteLetter,
    keyDownDeleteLetter,
    onPointerChange
  } = useKeyboard();

  /* onActivated Event */
  const myButton = ref(null);


  /* Clear Voucher */
  const { clearVoucherHandler } = useVoucherCheck();
  const toSchedule = async () => {
    if (scheduleStore.appliedVoucher) {
      showSpinner.value = true;
      await clearVoucherHandler();
      showSpinner.value = false;
    }
    router.push({ name: 'schedule' })
  }

  const { init } = useOnActivatedEvent();
  onMounted(async () => {
    if (scheduleStore.appliedVoucher) {
      showSpinner.value = true;
      await clearVoucherHandler();
      showSpinner.value = false;
    }
    console.log('onMounted Reservation')
    init();
  });

  onActivated(async () => {
    console.log('onActivated Triggered')
    if (scheduleStore.appliedVoucher) {
      console.log('should reset voucher')
      showSpinner.value = true;
      await clearVoucherHandler();
      showSpinner.value = false;
    }
  });
  

</script>
<template>
  <Teleport to=".appWrapper">
    <transition>
      <ToastCustom
        type="failed"
        :title="$t('reservation.toast.bookingFailed')"
        :message="toastMessage"
        @closeToast="showToast = false"
        v-if="showToast"
      />
    </transition>
  </Teleport>
   <div class="rounded-[35px] px-[35px] w-full flex flex-wrap py-[42px] mt-[30px]" :class="`bg-[${colors.secondaryColor}]`">
      <div class="mt-[15px] mr-[10px]">
          <div class="h-[17px] w-[17px] rounded-full bg-[#FD0000] "></div>
          <img src="../../../assets/images/reservation/arrow.png" class="pl-[6px]">
          <div class="h-[17px] w-[17px] rounded-full " :class="`bg-[${colors.secondaryColor200}]`"></div>
      </div>
      <div>
          <div class="font-bold text-[30px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ selectedDeparturePool.city }}</div>
          <div class="text-[19px] font-normal" :class="`text-[${colors.fontSecondaryColor400}]`">
            <!-- {{ selectedDeparturePool.pool_full_address }} -->
            <span v-if="selectedDeparturePool.pool_full_address.length > 35">
              {{ selectedDeparturePool.pool_full_address.slice(0, 35) + "..." }}
            </span>
            <span v-else>
              {{ selectedDeparturePool.pool_full_address }}
            </span>
          </div>
          <div class="flex  pt-[30px] items-center">
              <div class="text-[22px] font-semibold" :class="`text-[${colors.primaryColor}]`">
                {{ $d(scheduleStore.date, 'long') }}
              </div>
              <div class="flex items-center pl-[17px]">
                  <div class="h-[17px] w-[17px] rounded-full" :class="`bg-[${colors.primaryColor40}]`"></div>
                  <div class="text-[22px] font-semibold pl-[19px]" :class="`text-[${colors.primaryColor}]`">
                    {{ selectedDepartureTime.departure_time }}
                  </div>
              </div>
              <div class="flex items-center pl-[20px]">
                  <div class="h-[17px] w-[17px] rounded-full" :class="`bg-[${colors.primaryColor40}]`"></div>
              </div>
          </div>
          <div class="font-bold pt-[23px] text-[24px] pb-1">{{ selectedDestinationPool.destination_city }}</div>
          <div class="font-normal text-[19px]" :class="`text-[${colors.fontSecondaryColor400}]`">
            <!-- {{ selectedDestinationPool.destination_pool }} -->
            <span v-if="selectedDestinationPool.alamat.length > 35">
              {{ selectedDestinationPool.alamat.slice(0, 35) + "..." }}
            </span>
            <span v-else>
              {{ selectedDestinationPool.alamat }}
            </span>
          </div>
      </div>
      <template v-if="features.isInsurance">
        <div class="flex justify-between items-center my-[16px] basis-full">
            <div>
              <div class="text-[#71747D] text-lg font-medium mb-[4px]">
                {{ $t('reservation.card.totalPrice') }}
              </div>
              <!-- <div class="font-semibold text-[19px] pt-[21px] flex items-center" :class="`text-[${colors.fontPrimaryColor}]`">
              <span class="mr-[8px]">Rp. {{ formattingNumber(selectedDepartureTime.total_ticket_price) }}</span> <span class="text-[14px] text-[#000000] font-medium">x{{ selectedSeats.length }}</span>
              </div>   -->
              <div class="font-bold text-4xl" :class="`text-[${colors.fontPrimaryColor}]`">
                Rp. {{ formattingNumber(scheduleStore.totalTicketPriceNewAsmat) }}
              </div>  
            </div>
        </div>
        <div class="flex justify-between items-center  basis-full">
          <div class="flex flex-col">
            <span class="text-[#71747D] text-[20px] font-medium mb-[4px]">
              {{ $t('reservation.card.include') }}
            </span>
            <div class="flex justify-center items-center text-[#10B94E] text-[20px] font-semibold">
              <img src="../../../assets/images/ic_insurance.png" class="mr-1" alt="insurance_ic">
              {{ $t('reservation.card.travelInsurance') }} (+{{ formattingNumber(scheduleStore.insuranceTotalNewAsmat)  }})
            </div>
            <div v-if="scheduleStore.appliedVoucher" class="flex items-center text-[#10B94E] text-[20px] font-semibold mt-2">
              <img src="../../../assets/images/ic_voucher_green.svg" class="mr-1" alt="insurance_ic">
              {{ $t('reservation.voucher.deduction') }} (-{{ formattingNumber(scheduleStore.voucherData.deduction_nominal)  }})
            </div>
          </div>

          <div
            @click="toSchedule"
            class="bg-[#FF2E00] rounded-[37px] font-semibold text-[30px] py-[14px] px-[22px]"
            :class="`text-[${colors.secondaryColor}]`"
          >
            {{ $t('reservation.card.change') }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex justify-between items-center  basis-full mt-4">
            <div>
              <div class="text-[#71747D] text-lg font-medium mb-[4px]">
                {{ $t('reservation.card.totalPrice') }}
              </div>
              <div v-if="scheduleStore.appliedVoucher" class="mr-[8px] text-[#15803d] mb-3 relative">
                <div class="absolute left-[-15px]">-</div>
                Rp. {{ formattingNumber(scheduleStore?.voucherData?.deduction_nominal) }}
                {{ $t('reservation.voucher.deduction') }}
              </div>
              <div class="font-bold text-4xl" :class="`text-[${colors.fontPrimaryColor}]`">
                Rp. {{ formattingNumber(scheduleStore.totalTicketPriceNewAsmat) }}
              </div>  
            </div>
            
            <router-link
              :to="{ name: 'schedule' }"
              class="bg-[#FF2E00] rounded-[37px] font-semibold text-[30px] py-[14px] px-[22px]"
              :class="`text-[${colors.secondaryColor}]`"
            >
              {{ $t('reservation.card.change') }}
            </router-link>
        </div>
      </template>
   </div>

   <VoucherCard class="my-8" :phoneNo="phoneNo" v-if="features.isVoucher" />

    <!-- Ordering Information -->
    <div
      class="mt-[24px] rounded-[35px] w-full mb-[40px]" :class="`bg-[${colors.secondaryColor}]`"
    >

        <div class="ml-[34px] pt-[33.59px] border-1" :class="`border-[${colors.secondaryColor200}]`">
            <div class="font-medium text-[#000000] text-[36px]">
              {{ $t('reservation.form.reservationInformation') }}
            </div>
        </div>

        <!-- Input No Telephone -->
        <div class="pl-[40px] pb-[70px] pt-6 pr-8">
            <input
              inputmode="none"
              @keydown.prevent=""
              @click="onPointerChange" minlength="9" v-model="phoneNo" ref="input" type="text" id="name"
              class="w-full pointer-events-none outline-none border font-medium rounded-[11px] pl-[32px] pr-[55.06x] py-[30px] text-[36px]"
              :class="`border-[${colors.secondaryColor200}]`"
              :placeholder="$t('reservation.form.enterPhoneNo')">
        </div>
        <div class="">
            <div class="flex justify-center pb-[50px] ">
                <div
                  @click="keyboardClick('1', $refs.myButton)"
                  ref="myButton"
                  class="rounded-[12px] border-[2px] font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    1
                </div>
                <div
                  @click="keyboardClick('2')"
                  class="ml-[50px] rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    2
                </div>
                <div
                  @click="keyboardClick('3')"
                  class="ml-[50px] rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    3
                </div>
            </div>

            <div class="flex justify-center pb-[50px] ">
                <div
                  @click="keyboardClick('4')"
                  class="rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    4
                </div>
                <div
                  @click="keyboardClick('5')"
                  class="ml-[50px] rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    5
                </div>
                <div
                  @click="keyboardClick('6')"
                  class="ml-[50px] rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    6
                </div>
            </div>


            <div class="flex justify-center  pb-[50px] ">
                <div
                  @click="keyboardClick('7')"
                  class="rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    7
                </div>
                <div
                  @click="keyboardClick('8')"
                  class="ml-[50px] rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    8
                </div>
                <div
                  @click="keyboardClick('9')"
                  class="ml-[50px] rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    9
                </div>
            </div>

            <div class="flex justify-center items-center pb-[50px] ">
                <div class="rounded-[12px] font-bold  text-[48px] flex justify-center items-center w-[100px] h-[100px]">
                </div>
                <div
                  @click="keyboardClick('0')"
                  class="ml-[50px] rounded-[12px] border-[2px]  font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`">
                    0
                </div>
                <div
                  @touchstart="keyDownDeleteLetter"
                  @touchend="keyUpDeleteLetter"
                  @touchmove.prevent=""
                  class="ml-[50px] rounded-[12px] font-bold text-[48px] flex justify-center items-center w-[100px] h-[100px]"
                  :class="`border-[${colors.secondaryColor200}]`"
                >
                    <img class="pointer-events-none" src="../../../assets/images/reservation/clear.png">
                </div>
            </div>
        </div>


        <!-- Next -->
        <div v-if="phoneNo?.length >= 9" class="flex justify-center  pb-[30px] px-[23px]">
            <div
              @click="bookingTicket"
              class="flex justify-center py-[41px] w-full rounded-[26px]"
              :class="`bg-[${colors.accentSecondaryColor}]`"
            >
                <div
                  class="font-bold text-4xl"
                  :class="`text-[${colors.secondaryColor}]`"
                >
                  {{ $t('reservation.form.continue') }}
                </div>
                <img src="../../../assets/images/reservation/next.png " class="pl-[16.25px] ">
            </div>
        </div>
        <div v-else class="flex justify-center  pb-[30px] px-[23px]">
            <div
              class="flex justify-center py-[41px] w-full rounded-[26px]"
              :class="`bg-[${colors.secondaryColor200}]`"
            >
                <div
                  class="font-bold text-4xl"
                  :class="`text-[${colors.secondaryColor}]`"
                >{{ $t('reservation.form.continue') }}</div>
                <img src="../../../assets/images/reservation/next.png " class="pl-[16.25px] ">
            </div>
        </div>
    </div>
    <Teleport to='.appWrapper'>
      <OverlaySpinner bg="bg-[#00000060]" v-show="showSpinner"/>
    </Teleport>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>