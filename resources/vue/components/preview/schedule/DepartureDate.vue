<script setup>
  import { ref, computed } from 'vue'; 
  import { storeToRefs } from 'pinia';
  import { formattingDate, formattingDateYMD } from '../../../utils';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useSelectDate, useMaxYears, useTodayTomorrowDate } from '../../../composeable/schedule';

  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';

  const scheduleStore = useScheduleStore();
  const { departureDate, date } = storeToRefs(scheduleStore);

  /* Select Date */
  const emit = defineEmits(['backToSelectTime', 'showSpinnerEvent', 'resetScrollEvent']); //This data is also used in today tomorrow date
  const {
    isShow,
    backToSelectTime,
    showSpinnerEvent,
    dateModal,
    dateChange,
  } = useSelectDate(emit);

  /* Max Date Booking Date */
  const { maxYears } = useMaxYears();

  /* Btn Date Today and Tomorrow */
  const {
    today,
    tomorrow,
    isToday,
    isTomorrow,
    selectToday,
    selectTomorrow
  } = useTodayTomorrowDate(emit);

</script>

<template>
  <div class="mt-[24px] rounded-[35px]  w-full h-[auto]" :class="`bg-[${colors.secondaryColor}]`">
      <div class="ml-[34px] py-[37px] leading-[41.58px] pr-[41.25px]">
          <div class=" font-medium text-[36px]" :class="`text-[${colors.fontPrimaryColor}]`">Kapan Berangkat ?</div>
          <div class="flex justify-end mt-[10px] relative">
              <button class="text-[45px] font-bold mb-[15px] absolute left-0" :class="`text-[${colors.fontPrimaryColor}]`">
                  {{ scheduleStore.date.toLocaleDateString() === today.toLocaleDateString() ? 'Hari ini' : formattingDate(date) }}
              </button>
              <button
                @click="dateModal"
                class="font-bold text-[30px]"
                :class="`text-[${colors.primaryColor}]`"
              >
                  UBAH
              </button>
          </div>
      </div>
  </div>
  <Teleport to='.appWrapper'>
    <Transition :duration="350" name="nested">
      <div v-show="isShow" class="w-full absolute h-full  flex justify-end items-center z-[100]">
        <div @click="dateModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
        <div class="inner flex z-[99]">
          <div @click="dateModal" class="bg-[#C66C6C] z-[100] cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
            <img src="./../../../assets/images/x.png" class="">
          </div>
          <div
            class="w-[755px] py-[49px] rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[1400px] pl-[38px] relative"
            :class="`bg-[${colors.secondaryColor}]`"
          >
            <div class="text-[36px] mb-[34px]">Pilih Jadwal Keberangkatan</div>
            <div class="flex mb-[50px]">
              <button
                class="px-[30px] h-[57px] text-[32px] rounded-[12px]  mr-[30px] border-2"
                :class="[{activeDateBtn: isToday}, `text-[${colors.fontPrimaryColor}] border-[${colors.fontSecondaryColor400}]`]  " @click="selectToday" >
                Hari ini
              </button>
              <button class="px-[30px] h-[57px] text-[32px] rounded-[12px] border-2"
              :class="[{activeDateBtn: isTomorrow}, `text-[${colors.fontPrimaryColor}] border-[${colors.fontSecondaryColor400}]`]" @click="selectTomorrow" >
                Hari Esok
              </button>
            </div>
            <div class="text-[40px] font-bold mb-[40px]">Berdasarkan Tanggal</div>
            <VueDatePicker
              v-model="scheduleStore.date"
              locale="id"
              :day-names="['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']"
              :min-date="new Date()"
              :max-date="maxYears"
              :enable-time-picker="false"
              inline auto-apply
              @update:model-value="dateChange"
            >
              <template #arrow-left>
                <img src="../../../assets/images/leftArrowDate.png">
              </template>
              <template #arrow-right>
                <img src="../../../assets/images/rightArrowDate.png">
              </template>
            </VueDatePicker>
          </div>  
        </div>
      </div>
    </Transition>
  </Teleport>

</template>

<style>
  .activeDateBtn {
    background: v-bind('colors.primaryColor');
    color: white !important;
    border: 0;
  }

  :root {
    --dp-menu-min-width: 100%;
    --dp-cell-size: 75px;
  }

  .dp__menu {
    border: 0;
  }

  .dp__main {
    justify-content: center;
  }

  .dp__month_year_row {
    justify-content: center;
    margin-bottom: 15px;
  }

  .dp__month_year_wrap {
    width: 230px;
  }

  .dp__calendar_header {
    justify-content: space-around;
  }

  .dp__calendar_header_separator {
    height: 0;
  }

  .dp__calendar_header_item {
    font-size: 30px;
    flex-grow: 0;
    width: 80px;
    height: auto;
    padding: 10px 0px 10px 0px;
  }

  .dp__calendar_item {
    flex-grow: 0;
  }

  .dp__calendar_row {
    justify-content: space-around;
  }

  .dp__cell_inner {
    padding: 0;
    border: 2px solid #B5B5B5;
    border-radius: 12px;
    margin: 0px 0px 20px 0px;
    font-size: 28px;
    font-weight: bold;
  }

  .dp__month_year_select {
    font-size: 32px;
    font-weight: bold;
  }
</style>