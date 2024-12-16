<script setup>
  import { watch, ref, reactive, onMounted, computed, toRefs, toRef } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useScheduleStore } from '@/store/ScheduleStore';
  import { formattingNumber, dmyStringToDate } from '@/utils';
  import {
    useInitialData,
    useSelectDepartureTimeEvent,
    useResetScroll,
    useTodayTomorrowDate,
    useDepartureTimeModal,
    useSelectSeats,
    useBackToSelectTime
  } from '@/composeable/schedule';
  import { useRouter } from 'vue-router';

  import OverlaySpinner from '@/components/daytrans/OverlaySpinner.vue';
  import ErrorState from '@/components/daytrans/schedule/ErrorState.vue';
  import Modal from '@/components/v2/Modal.vue';
  import IcDeparturePrice from '@/components/v2/ic/IcDeparturePrice.vue';
  import DepartureTimeCard from '@/components/v2/Schedule/DepartureTimeCard.vue';
  import IcExpand from '@/components/v2/ic/IcExpand.vue';
  import ModalDialogue from '@/components/v2/ModalDialogue.vue';


  /* Router */
  const router = useRouter();

  /* Schedule Store */
  const scheduleStore = useScheduleStore();

  /* Initial Data */
  const { isSeatsShow, isSeatsReturnShow, showSpinner, isSelectPoolError, isDepTimeShow } = useInitialData();

  /* Select Departure Function */
  const { selectDepartureTimeEvent } = useSelectDepartureTimeEvent();

  /* Select Departure Return Function */
  const { selectDepartureTimeEvent: selectDepartureTimeEventReturn } = useSelectDepartureTimeEvent(true);


  /* Reset Scroll */
  const props = defineProps({ resetScroll: Number });
  const isResetScroll = toRef(props, 'resetScroll');
  const { wrapperDepartureTime } = useResetScroll(isResetScroll);

  /* Roundtrip Continue */
  const { toReservation } = useSelectSeats(router);
  const subTotalTicket = computed(() => {
    return scheduleStore.subTotalTicketNewAsmat + scheduleStore.subTotalTicketNewAsmatReturn;
  });

  /* On Retry Select Destination */
  const onRetrySelectDestinationPool = async () => {
    try {
      isSelectScheduleError.value = false;
      isSelectPoolError.value = false;
      showSpinner.value = true;
      await scheduleStore.getSchedule({
        destination_id: scheduleStore.selectedDestinationPool.destination_id,
        departure_date: scheduleStore.departureDate,
        departure_id: departureCode
      });
      showSpinner.value = false
      
    } catch (error) {
      showSpinner.value = false
      isSelectPoolError.value = true;
    }
  }

  /* Roundtrip Dynamic Style */
  const dynamicStyle = computed(() => {
    return scheduleStore.isRoundedTrip && (scheduleStore.selectedSeats.length > 0 && scheduleStore.selectedSeatsReturn.length > 0) ?
    'h-fit' :
    'h-[1028px]';
  });

  /* Select Departure Return Handler */
  const emits = defineEmits(['modalDepartureDateHandler'])
  const onClickSelectDepartureReturn = () => {
    emits('modalDepartureDateHandler')
  }

  /* Modal Dialogue Confirm */
  const isModalDialogueShow = ref(false);


  const { backToSelectTime } = useBackToSelectTime();
</script>

<template>
    <div class="overflow-hidden rounded-[35px] mt-[24px] relative">
      <div
        ref="wrapperDepartureTime"
        class="rounded-[35px] w-full flex flex-col overflow-hidden pb-[50px] p-8 gap-8 bg-white"
        :class="[ dynamicStyle ]"
      >
        <template v-if="scheduleStore.dateReturn || !scheduleStore.isRoundedTrip">
          <DepartureTimeCard
            @selectDepartureTimeEvent="selectDepartureTimeEvent"
            @onClickChangeSeat="() => {
              isDepTimeShow = false;
              isSeatsShow = true;
            }"
            @backToSelectTime="backToSelectTime()"
            :selectedSeats="scheduleStore.selectedSeats"
            :departureTimes="scheduleStore.departureTime"
            :selectedDepartureTime="scheduleStore.selectedDepartureTime?.departure_time"
            :subtotalPrice="scheduleStore.subTotalTicketNewAsmat"
            :isSeatSelected="scheduleStore.selectedSeats.length > 0"
            :showScheduleCards="scheduleStore.selectedSeats.length <= 0"
            :expandCard="scheduleStore.selectedSeats.length <= 0"
          >
            <template #overlaySpinner>
              <ErrorState bg="bg-[white]" :textColor="colors.fontPrimaryColor" v-show="isSelectPoolError" @retryOnClick="onRetrySelectDestinationPool"></ErrorState>
              <OverlaySpinner :spinnerColor="colors.primaryColor" v-show="showSpinner" />
            </template>  

          </DepartureTimeCard>
          
          <DepartureTimeCard
            v-show="scheduleStore.isRoundedTrip"
            @selectDepartureTimeEvent="selectDepartureTimeEventReturn"
            @onClickChangeSeat="() => {
              isDepTimeShow = false;
              isSeatsReturnShow = true
            }"
            @backToSelectTime="backToSelectTime(true)"
            :departureReturn="true"
            :selectedSeats="scheduleStore.selectedSeatsReturn"
            :departureTimes="scheduleStore.departureTimeReturn"
            :selectedDepartureTime="scheduleStore.selectedDepartureTimeReturn?.departure_time"
            :subtotalPrice="scheduleStore.subTotalTicketNewAsmatReturn"
            :isSeatSelected="scheduleStore.selectedSeatsReturn.length > 0"
            :showScheduleCards="scheduleStore.selectedSeats.length > 0 && scheduleStore.selectedSeatsReturn.length <= 0"
            :expandCard="scheduleStore.selectedSeatsReturn.length <= 0 && scheduleStore.selectedSeats.length > 0"
          >
            <template #overlaySpinner>
              <ErrorState bg="bg-[white]" :textColor="colors.fontPrimaryColor" v-show="isSelectPoolError" @retryOnClick="onRetrySelectDestinationPool"></ErrorState>
              <OverlaySpinner :spinnerColor="colors.primaryColor" v-show="showSpinner" />
            </template>  
          </DepartureTimeCard>
        </template>

        <template v-else>
          <div class=" w-full h-full justify-center text-center flex flex-col items-center py-12 gap-8">
            <img src="@/assets/images/empty-date-illustration.png" class=" grayscale" alt="empty-date-illustration">
            <div class=" text-xl font-medium text-[#555555]">
              {{ $t('schedule.times.pleaseSelectReturnDate') }}
            </div>

            <button
              @click="onClickSelectDepartureReturn"
              class=" w-fit py-3 px-5 text-white font-semibold rounded-xl"
              :class="[ `bg-[${colors.primaryColor}]` ]"
            >
              {{ $t('schedule.times.btnSelectReturnDate') }}
            </button>
          </div>
        </template>


        <div v-show="scheduleStore.selectedSeats.length > 0 && scheduleStore.selectedSeatsReturn.length > 0" class=" mt-8">       
          <div class=" mb-8">
            <span class=" text-xl font-medium text-[#71747D]">
              Total Harga
            </span>
            <div class=" font-semibold text-[32px] text-[#1F2937]">
              Rp. {{ formattingNumber(subTotalTicket) }} 
            </div>
          </div>

          <div @click="isModalDialogueShow = true" class=" bg-[#00990F] w-full py-[14px] text-white text-2xl font-semibold text-center rounded-2xl">
            {{ $t('schedule.times.fillPhoneNumb') }}
          </div>
        </div>
  
      </div>

      <Teleport to=".appWrapper">
        <Transition>
          <ModalDialogue
            v-if="isModalDialogueShow"
            @onClickCancel="isModalDialogueShow = false"
            @onClickConfirm="() => {
              isModalDialogueShow = false;
              toReservation();
            }"
          >
            <template #header>
              Konfirmasi Pilihan Anda
            </template>

            <template #content>
              <div class="w-full flex flex-col gap-4">
                <div>
                  Anda telah memilih waktu keberangkatan dan kepulangan sebagai berikut:
                </div>

                <!-- Departure -->
                <div>
                  <div>
                    Waktu Keberangkatan:
                  </div>
                  <div class=" text-xl text-[#1F2937] font-medium">
                    {{ $d(dmyStringToDate(scheduleStore?.selectedDepartureTime?.departure_date), 'short') }}, 
                    {{ scheduleStore.selectedDepartureTime?.departure_time }} WIB
                  </div>
                </div>


                <!-- Departure Return -->
                <div>
                  <div>
                    Waktu Pulang:
                  </div>
                  <div class=" text-xl text-[#1F2937] font-medium">
                    {{ $d(dmyStringToDate(scheduleStore?.selectedDepartureTimeReturn?.departure_date), 'short') }}, 
                    {{ scheduleStore.selectedDepartureTimeReturn?.departure_time }} WIB
                  </div>
                </div>
              </div>
            </template>

            <template #confirmCta>
              Lanjut ke Isi No. Telp
            </template>
          </ModalDialogue>
        </Transition>
      </Teleport>
    </div>
</template>

