<script setup>
import { onMounted, onActivated, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { cutString } from '@/utils';
import { useStore } from '@/store/Store';
import { useScheduleStore } from '@/store/ScheduleStore';
import {
  useMapModal,
  useSelectPool,
  useDestinationInitialData,
  useExpandPoolWrapper,
  useDestinationOnMountedEvent,
  useDestinationOnActivatedEvent
} from '@/composeable/schedule.js';

import CaretTop from '@/components/v2/ic/CaretTop.vue';
import IcSelectOutlet from '@/components/v2/ic/IcSelectOutlet.vue';

const scheduleStore = useScheduleStore();
const { destinationPools, groupedDestinationPools } = storeToRefs(scheduleStore);

/* Initial Data */
const {
  poolItemWrapper,
  poolHeightContainer,
  isDestinationWrapperExpanded,
  isMapShow
} = useDestinationInitialData();

/* Location Map */
const { location, mapModalShow, urlMaps, mapModalClose } = useMapModal();

/* Select Pool */
const emit = defineEmits(['backToSelectTime', 'showSpinnerEvent']);
const {
  openModalSelectDestination,
  selectPool,
  backToSelectTime,
  showSpinnerEvent,
} = useSelectPool(emit);

/* Expand Pool Element */
const { poolContainer, expandPool } = useExpandPoolWrapper();

/* On Mounted Event */
onMounted(() => {
  const { init } = useDestinationOnMountedEvent(); 
  init();
});

/* On Activated Event */
onActivated(() => {
  const { init } = useDestinationOnActivatedEvent(); 
  init();
});

watch(groupedDestinationPools, async () => {
  await nextTick();
  poolHeightContainer.value = [];
  isDestinationWrapperExpanded.value = [];
  poolItemWrapper.value = [];
  await nextTick();
  const { init } = useDestinationOnMountedEvent(); 
  init();
  if (groupedDestinationPools?.value?.length == 1) {
    setTimeout(() => {
      expandPool(0);
    }, 0);
  }
});
</script>

<template>
  <div class=" relative">
    <div class="overflow-y-hidden z-[98] absolute rounded-[35px] mt-[24px]">
      <div ref="wrapperDestinationPool"
        class="rounded-[35px]  w-[696px] h-[1530px] pb-[30px] overflow-y-auto"
        :class="`bg-[${colors.secondaryColor}]`"
      >
        <div class="px-[37px] pt-[37px] leading-[41.58px]">
            <div class="font-semibold text-2xl mb-6 text-[#1F2937]">
              {{ $t('schedule.destinationPool.selectDestination') }}
            </div>
            <div
              v-if="destinationPools.length > 0"
              v-for="(item, indexParent) in groupedDestinationPools"
              :key="item.destination_city"
              ref="poolContainer"
              :style="{height: `${poolHeightContainer[indexParent]}px`}"
              class="poolContainer overflow-hidden"
            >
              <div
                @click="expandPool(indexParent)"
                class="flex justify-between items-center  mb-[27px]"
                :id="`ctaWrapperDestination_${indexParent+1}`"
              >
                <h2
                  class="font-bold text-[32px]"
                  :class="[`text-[${colors.fontPrimaryColor}]`]"
                >
                  {{ cutString(item.destination_city, 13) }}
                </h2>
                <CaretTop
                  :class="{ animateArrow: !isDestinationWrapperExpanded[indexParent] }"
                  class="arrow"
                />
              </div>

              <div ref="poolItemWrapper" :key="item.destination_city"  class="w-full grid grid-cols-2 gap-[17px] mb-[30px]">
                <div 
                  v-for="(pool, index) in item.pools" :key="pool.destination_id"
                  class="h-[240px] border-[1px] rounded-2xl p-6 mb-[17px] flex flex-col justify-between relative"
                  :class="`border-[${colors.primaryColor}]`"
                >
                  <!-- Outlet & Address -->
                  <div class=" flex flex-col gap-2 h-full">
                    <!-- Outlet -->
                    <span class=" text-2xl font-semibold text-[#1F2937] line-clamp-2">
                      {{ pool.destination_pool }}
                    </span>

                    <!-- Address -->
                    <span class="text-[#71747D] line-clamp-2 leading-[22px]">
                      {{ pool.alamat}}
                    </span>
                  </div>

                  <!-- CTA -->
                  <div class=" w-full flex justify-between">
                    <button
                       @click="mapModalShow(pool.latitude, pool.longitude, { id: pool.destination_id, city: pool.destination_city, address: pool.alamat })"
                      class=" py-2 px-4 rounded-xl text-white leading-none"
                      :class="[`bg-[${colors?.primaryColor}]`]"
                    >
                      {{ $t('schedule.destinationPool.seeLocation') }}
                    </button>

                  
                    <IcSelectOutlet
                      :id="`btnSelectDestination_${indexParent+1}_${index+1}`"
                      :color="colors.primaryColor"
                      @click="selectPool(pool.destination_id)"
                    />
                  </div>

                  <!-- <div
                    @click="mapModalShow(pool.latitude, pool.longitude, { id: pool.destination_id, city: pool.destination_city, address: pool.alamat })"
                    class="text-[14px] font-semibold border-[1px] rounded-[11px] h-[28px] flex items-center px-[19.52px] absolute bottom-[19.38px] left-[20.63px]"
                    :class="`bg-[${colors.accentColor}] text-[${colors.fontPrimaryColor}]`"
                  >
                    {{ $t('schedule.destinationPool.seeLocation') }}
                  </div>
                  <img
                    :id="`btnSelectDestination_${indexParent+1}_${index+1}`"
                    :src="images.icSelectOutlet"
                    class="absolute bottom-[14.27px] right-[16.78px]"
                    @click="selectPool(pool.destination_id)"
                  /> -->
                </div>
              </div>
              <hr>
            </div>
        </div>
      </div> 
    </div>

    <div v-if="isMapShow" class="overflow-y-hidden w-full z-[99] absolute rounded-[35px] mt-[24px]">
      <div class="rounded-[35px]  w-full h-[1530px] pb-[30px] overflow-y-auto" :class="`bg-[${colors.secondaryColor}]`">
        <div class="px-[37px] pt-[37px] h-full">
          <div class="flex">
            <div class="mr-[20px] mt-[7px]">
              <img @click="mapModalClose" src="@/assets/images/left.png" class="w-[60px]">
            </div>
            <div>
              <div class="text-[30px] font-semibold">{{ location.city }}</div>
              <div class="text-[16px] font-medium" :class="`text-[${colors.fontSecondaryColor400}]`">
                {{ location.address }}
              </div>
            </div>
          </div>
          <div class="mt-[29px] h-[1277px]">
            <div class="overflow-hidden flex relative h-full w-full">
              <iframe
                style="margin-top: -200px;"
                id="iframeMaps"
                ref="mapsIframe"
                class="w-full h-full z-[90]"
                :src="urlMaps"></iframe>
              <div
                class="w-full h-[110px] bg-[white] z-[99] absolute bottom-[200px]"
                :class="`bg-[${colors.secondaryColor}]`"></div>
            </div>

            <button
              @click="selectPool(location.id)"
              class="flex items-center justify-center absolute bottom-[40px] w-[90%] py-[41px] rounded-[26px] font-bold text-4xl"
              :class="`bg-[${colors.accentSecondaryColor}] text-[${colors.secondaryColor}]`"
              >
              {{ $t('schedule.destinationPool.selectDestination') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.poolContainer {
  transition: height 0.5s ease-in-out;
}

.animateArrow {
  transition: 0.5s;
  transform: rotateX(-180deg);
}

.arrow {
  transition: 0.5s;
}
</style>