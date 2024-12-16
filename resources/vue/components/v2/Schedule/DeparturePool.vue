<script setup>
  import SelectOutlet from '@/components/v2/schedule/SelectOutlet.vue';
  import { watch, ref, reactive, onMounted, computed } from 'vue';
  import { useScheduleStore } from '@/store/ScheduleStore';
  import { useStore } from '@/store/Store';
  import { storeToRefs } from 'pinia';

  // import Colors from '../../../config/colors';

  const isShow = ref(false);
  const scheduleStore = useScheduleStore();
  const { selectedDeparturePool, groupedDeparturePools } = storeToRefs(scheduleStore);

  const emit = defineEmits(['backToSelectTime']);
  const backToSelectTime = () => emit('backToSelectTime'); 
  const showSpinnerEvent = (value) => emit('showSpinnerEvent', value); 
  
  const openModal = () => isShow.value = !isShow.value;
  const selectPool = async (pool) => {
    openModal();
    backToSelectTime();
    scheduleStore.departurePools.forEach((item) => {
      item.isSelected = false;
      if (item.pool_code === pool.pool_code) item.isSelected = true;
    });
    showSpinnerEvent(true);
    await scheduleStore.getDestination({ destination: pool.pool_code });
    await scheduleStore.getSchedule({
      destination_id: scheduleStore.destinationPools[0].destination_id,
      departure_date: scheduleStore.departureDate,
      departure_id: pool.pool_code,
    });
    showSpinnerEvent(false);
  }
</script>

<template>
  <SelectOutlet
    id="departureOutletName"
    :outletName="selectedDeparturePool?.pool_name"
    @onClickChangeBtn="isShow = true"
    :isChangable="features?.isChangeDeparturePool"
  />
  <!-- Select Pool Modal -->
  <Teleport to='.appWrapper'>
    <Transition :duration="350" name="nested">
      <div v-show="isShow" class="w-full h-full absolute top-0 flex justify-end items-center z-[100]">
        <div @click="openModal" class="w-full h-full absolute top-0 left-0 bg-[#0000006e] z-[90]"></div>
        <div class="flex inner z-[99]">
            <div @click="openModal" class="bg-[#C66C6C] flex justify-center items-center cursor-pointer absolute ml-[-140px] self-center rounded-full w-[98px] h-[98px]">
                <img src="./../../../assets/images/x.png" class="">
            </div>
              
            <div class="w-[755px] py-[49px] rounded-l-[30px] overflow-y-auto overflow-x-hidden h-[1400px] pl-[38px] relative"
            :class="`bg-[${colors.secondaryColor}]`">
              <div class="text-[36px]" :class="`text-[${colors.fontPrimaryColor}]`">
                {{ $t('schedule.departurePool') }}
              </div>
              <div v-for="(item, indexParent) in groupedDeparturePools" :key="item.city" class="mb-[70px]">
              <div class="flex mt-[34px]">
                  <img src="./../../../assets/images/city.svg" class="mr-[30px]">
                  <div class="text-[40px] font-semibold pr-[466px]" :class="`text-[${colors.fontPrimaryColor}]`">{{item.city}}</div>
              </div>
              <div 
                v-for="(pool, index) in item.pools" :key="pool.pool_code" 
                class="flex cursor-pointer justify-start mt-[34px] ml-[70px] pr-10"
                @click="selectPool(pool)">
                  <img src="./../../../assets/images/Vector.jpg" class="w-[36px] h-[45px]  mt-[18px]">
                  <div class="text-[32px] font-semibold ml-[29px]" :class="`text-[${colors.fontPrimaryColor}]`">{{ pool.pool_name }} <br>
                      
                      <span class="text-[26px] line-clamp-1" :class="`text-[${colors.fontSecondaryColor300}]`">
                        {{ pool.pool_address }}
                      </span>
                  </div>
                  <img v-if="selectedDeparturePool.pool_code === pool.pool_code" src="./../../../assets/images/check.svg" class="ml-auto">
              </div>
              </div>
            </div>
        </div>
      </div>
    </Transition>
    
  </Teleport>
</template>