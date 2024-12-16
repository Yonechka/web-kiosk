<script setup>
  import { ref, computed, watch } from 'vue'; 
  import { storeToRefs } from 'pinia';
  import { formattingDate, formattingDateYMD } from '@/utils';
  import { useScheduleStore } from '@/store/ScheduleStore';
  import { useSelectDate, useMaxYears, useTodayTomorrowDate } from '@/composeable/schedule';
  import { useI18n } from 'vue-i18n';
  
  import Modal from '@/components/v2/Modal.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';

  const scheduleStore = useScheduleStore();

  /* Props */
  const props = defineProps({
    returnDate: {
      type: Boolean,
      default: false
    },
    minDate: {
      type: Date,
      default: new Date()
    },
    date: Date || null,
  });

  /* I18n */
  const { locale, t } = useI18n({ useScope: 'global' });
  const dayNames = computed(() => {
    return locale?.value == 'id' ? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  });

  /* Select Date */
  const emit = defineEmits(['backToSelectTime', 'showSpinnerEvent', 'resetScrollEvent']); //This data is also used in today tomorrow date
  const {
    isShow,
    backToSelectTime,
    dateModal,
    dateChange,
  } = useSelectDate(emit, props.returnDate);

  /* Max Date Booking Date */
  const { maxYears } = useMaxYears();

  defineExpose({ dateModal })

  /* Btn Date Today and Tomorrow */
  const {
    today,
    tomorrow,
    isToday,
    isTomorrow,
    selectToday,
    selectTomorrow
  } = useTodayTomorrowDate(emit, props.returnDate);

  // const initialRender = ref(true);
  /* Rounded Trip Trigger & Departure Date trigger */

  watch([() => scheduleStore.isRoundedTrip, () => scheduleStore.date], ([isRoundedTrip], [prevIsRoundedTrip]) => {
    console.log(isRoundedTrip, prevIsRoundedTrip)
    /* Case When Departure Date Changed, with isRoundedTrip state already true */
    if ((isRoundedTrip && prevIsRoundedTrip) && props.returnDate) {
      if (props.date && (scheduleStore.date < props.date)) {
        /* If departure date return greater than departure date, set departure date return with previous date return */
        dateChange(props.date);
      } else {
        /* Otherwise Set Departure date to null and reset state that related to departure return to null */
        scheduleStore.dateReturn = null
      }
      
    } else {
      backToSelectTime();
      scheduleStore.dateReturn = null
    }
  })

</script>

<template>
  <div class=" w-full bg-white px-8 py-7 text-[#1F2937] rounded-[35px] relative mt-8" :class="`bg-[${colors.secondaryColor}]`">
      <div class="leading-[41.58px]">
          <div class=" font-medium text-[24px] leading-[36px] text-[#71747D] mb-1">
            {{ props.returnDate ? $t('schedule.dates.whenToGoReturn') : $t('schedule.dates.whenToGo') }}
          </div>
          <div class=" text-[32px] font-bold leading-[48px] text-[#1F2937] bg-tranparent">
              <div
                v-if="props.date"
                class=" bg-transparent text-[#1F2937]"
                :data-date="formattingDateYMD(props.date)"
                :data_date-formatted="$d(props.date, 'short')">
                  {{
                    props.date.toLocaleDateString() === today.toLocaleDateString() ?
                    $t('schedule.dates.today') :
                    $d(props.date, 'short')
                  }}
              </div>

              <div
                v-else
                class=" bg-transparent text-[#555555] font-medium text-[32px]"
              >
                {{ $t('schedule.dates.selectReturnDate') }}
              </div>
              
          </div>
          
          <div v-if="!props.returnDate && features.isRoundedTrip" class=" absolute top-7 right-7 flex gap-2 items-center">
            <span class=" text-[#71747D] text-xl">
              {{ $t('schedule.dates.roundedTrip') }}
            </span>
            <label class="switch">
              <input type="checkbox" v-model="scheduleStore.isRoundedTrip">
              <span class="slider round"></span>
            </label>
          </div>

          <button
            @click="dateModal"
            class="absolute text-[18px] font-semibold bottom-[32px] right-[32px] cursor-pointer bg-transparent"
            :class="`text-[${colors.primaryColor}]`"
            id="btnChangeDate"
          >
              {{ $t('schedule.changeDate') }}
          </button>
      </div>

      <Teleport to='.appWrapper'>
        <Transition :duration="350" name="nested">
            
          <Modal v-show="isShow" @onClickModal="dateModal">
            <div class="text-[36px] mb-[34px]">
              {{ props.returnDate ? $t('schedule.dates.selectDepartureDateReturn') : $t('schedule.dates.selectDepartureDate') }}
            </div>
            <div v-show="!props.returnDate" class="flex mb-[50px]">
              <button
                class="px-[30px] h-[57px] text-[32px] rounded-[12px]  mr-[30px] border-2"
                :class="[{activeDateBtn: isToday}, `text-[${colors.fontPrimaryColor}] border-[${colors.fontSecondaryColor400}]`]  " @click="selectToday" >
                {{ $t('schedule.dates.today') }}
              </button>
              <button class="px-[30px] h-[57px] text-[32px] rounded-[12px] border-2"
              :class="[{activeDateBtn: isTomorrow}, `text-[${colors.fontPrimaryColor}] border-[${colors.fontSecondaryColor400}]`]" @click="selectTomorrow" >
                {{ $t('schedule.dates.tomorrow') }}
              </button>
            </div>
            <div class="text-[40px] font-bold mb-[40px]">
              {{ $t('schedule.dates.byDate') }}
            </div>
            <VueDatePicker
              :model-value="props.date"
              :day-names="dayNames"
              :locale="$i18n.locale"
              :min-date="props.minDate"
              :max-date="maxYears"
              :enable-time-picker="false"
              inline auto-apply
              @update:model-value="dateChange"
            >
              <template #arrow-left>
                <img src="@/assets/images/leftArrowDate.png">
              </template>
              <template #arrow-right>
                <img src="@/assets/images/rightArrowDate.png">
              </template>
              <!-- <template #day="{day, date}">
                {{ day }}
              </template> -->
            </VueDatePicker>
          </Modal>  
        </Transition>
      </Teleport>
  </div>
  

</template>

<style scoped>
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 7px;
    bottom: 7px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #16A34A;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #16A34A;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 20px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  :root {
    --dp-menu-min-width: 100%;
    --dp-cell-size: 75px;
    --dp-primary-color: red !important;
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