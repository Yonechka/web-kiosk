<script setup>
  import { watch, ref, reactive, onMounted, computed } from 'vue';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useStore } from '../../../store/Store';
  import { storeToRefs } from 'pinia';

  // import Colors from '../../../config/colors';

  const isShow = ref(false);
  const scheduleStore = useScheduleStore();
  const { selectedDeparturePool, groupedDeparturePools } = storeToRefs(scheduleStore);

  const emit = defineEmits(['backToSelectTime', 'showSpinnerEvent']);
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
      departure_id: pool.pool_code,
      departure_date: scheduleStore.departureDate
    });
    showSpinnerEvent(false);
  }
</script>


<template>
 <div class="mt-[67px] rounded-[35px] w-full h-[auto] md:grid-cols-6 " :class="`bg-[${colors.secondaryColor}]`">
    <div class="ml-[34px] py-[37px] leading-[41.58px] pr-[41.25px]">
        <div class=" font-medium text-[36px]  " :class="`text-[${colors.fontPrimaryColor}]`">
          {{ $t('schedule.departurePool') }}
        </div>
        <div v-if="scheduleStore.departurePools.length > 0" class="flex justify-between relative mt-1">
            <div class="text-[50px] font-bold " :class="`text-[${colors.fontPrimaryColor}]`">
              <div v-if="selectedDeparturePool?.pool_name.length > 18">
                {{ selectedDeparturePool?.pool_name.slice(0, 12) + "..." }}
              </div>
              <div v-else>
                {{ selectedDeparturePool?.pool_name }}
              </div>
            </div>
            <div
              v-if="features.isChangeDeparturePool"
              class="font-bold text-[30px]" :class="`text-[${colors.primaryColor}]`"
              @click="openModal"
            >
                {{ $t('schedule.change') }}
            </div>
        </div>
        <div v-else class="flex h-full justify-center text-[28px] mt-[17px] text-[red] items-center">
          {{ $t('schedule.onError') }}
        </div>
    </div>
  </div>

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

<style scoped>


  /* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>