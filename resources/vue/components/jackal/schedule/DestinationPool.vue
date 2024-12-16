<script setup>
  import { watch, ref, reactive, onMounted, computed, toRefs, toRef, onActivated } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useStore } from '../../../store/Store';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import {
    useMapModal,
    useSelectPool,
    useDestinationInitialData,
    useExpandPoolWrapper,
    useDestinationOnMountedEvent,
    useDestinationOnActivatedEvent
  } from '../../../composeable/schedule.js';
  
  const store = useStore();
  const scheduleStore = useScheduleStore();
  const { destinationPools, groupedDestinationPools, selectedDestinationPool } = storeToRefs(scheduleStore);

  /* Initial Data */
  const {
    showSelectDestinationModal,
    isMapShow,
    poolItemWrapper,
    poolHeightContainer,
    isDestinationWrapperExpanded
  } = useDestinationInitialData();

  /* Location Map */
  const { urlMaps, location, mapModalShow, mapModalClose } = useMapModal();

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

</script>

<template>
  <div
    v-show="!showSelectDestinationModal"
    class="mt-[24px] rounded-[35px]  w-full h-[168px] relative"
    :class="`bg-[${colors.secondaryColor}]`"
  >
    <div class="ml-[34px] pt-[37px] leading-[41.58px] pr-[41.25px]">
        <div class="font-medium text-[36px]" :class="`text-[${colors.fontPrimaryColor}]`">
          {{ $t('schedule.destinationPool.whereToGo') }}
        </div>
        <div class="flex pt-[31px] -mt-[25px] justify-end relative">
            <div class="text-[50px] font-bold whitespace-nowrap absolute left-0" :class="`text-[${colors.fontPrimaryColor}]`">
                <div v-if="selectedDestinationPool?.destination_pool.length > 12">
                   {{ selectedDestinationPool?.destination_pool.slice(0, 12) + "..." }}
                </div>
                <div v-else>
                  {{ selectedDestinationPool?.destination_pool }}
                </div>
            </div>
            <div
              class="font-bold text-[30px]" :class="`text-[${colors.primaryColor}]`"
              @click="openModalSelectDestination"
            >
              {{ $t('schedule.change') }}
            </div>
        </div>
    </div>
  </div>

  <div v-show="showSelectDestinationModal"  class="overflow-y-hidden z-[98] absolute rounded-[35px] mt-[24px]">
    <div ref="wrapperDestinationPool"
      class="rounded-[35px]  w-[645px] h-[1530px] pb-[30px] overflow-y-auto"
      :class="`bg-[${colors.secondaryColor}]`"
    >
      <div class="px-[37px] pt-[37px] leading-[41.58px]">
          <div class="font-medium text-[36px]" :class="`text-[${colors.fontPrimaryColor}]`">
            {{ $t('schedule.destinationPool.selectDestination') }}
          </div>
          <div
            v-for="(item, indexParent) in groupedDestinationPools"
            :key="item.destination_city"
            ref="poolContainer"
            :style="{height: `${poolHeightContainer[indexParent]}px`}"
            class="poolContainer mt-[22px] mb-[30px] overflow-hidden"
          >
            <div
              @click="expandPool(indexParent)"
              class="flex justify-between items-center mb-[27px]"
              :id="`destinationWrapperCta_${indexParent+1}`"
            >
              <h2 class="font-bold text-[50px] line-clamp-1">{{ item.destination_city }}</h2>
              <img :class="{ animateArrow: !isDestinationWrapperExpanded[indexParent] }" class="arrow" src="../../../assets/images/blue-top-arrow.png" />
            </div>

            <div ref="poolItemWrapper" class="w-full flex flex-wrap justify-between mb-[30px]">
              <div 
                v-for="pool in item.pools" :key="pool.destination_id"
                class="w-[277px] h-[329px] border-[1px] rounded-[18px] p-[23.5px] mb-[17px] relative"
                :class="`border-[${colors.primaryColor}]`"
              >
                <div class="font-semibold text-[30px] leading-[32.25px] mb-[23px]">{{ pool.destination_pool }}</div>
                <div
                  v-if="pool.alamat_cabang_lengkap_tujuan.length > 45"
                  class="font-medium text-[16px] leading-[24px]"
                  :class="`text-[${colors.fontSecondaryColor400}]`"
                >
                  {{ pool.alamat_cabang_lengkap_tujuan.slice(0, 45) + '...' }}
                </div>

                <div v-else
                  class="font-medium text-[16px] leading-[24px]"
                  :class="`text-[${colors.fontSecondaryColor400}]`"
                >
                  {{ pool.alamat_cabang_lengkap_tujuan }}
                </div>

                <div
                  @click="mapModalShow(pool.latitude, pool.longitude, { id: pool.destination_id, city: pool.destination_city, address: pool.alamat_cabang_lengkap_tujuan })"
                  class="text-[14px] border-[1px] rounded-[11px] h-[28px] flex items-center px-[19.52px] absolute bottom-[19.38px] left-[20.63px]"
                  :class="`border-[${colors.accentColor}] text-[${colors.accentColor}]`"
                >
                  {{ $t('schedule.destinationPool.seeLocation') }}
                </div>
                <img
                  src="../../../assets/images/blue-arrow-right-circle.png"
                  class="absolute bottom-[14.27px] right-[16.78px]"
                  @click="selectPool(pool.destination_id)"
                />
              </div>
            </div>
            <hr>
          </div>
      </div>
    </div>
  </div>

  <div v-if="isMapShow" class="overflow-y-hidden z-[99] absolute rounded-[35px] mt-[24px]">
    <div class="rounded-[35px]  w-[645px] h-[1530px] pb-[30px] overflow-y-auto" :class="`bg-[${colors.fontSecondaryColor}]`">
      <div class="px-[37px] pt-[37px] h-full">
        <div class="flex">
          <div class="mr-[20px] mt-[7px]">
            <img @click="mapModalClose" src="../../../assets/images/left.png" class="w-[60px]">
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
            class="flex items-center justify-center absolute bottom-[40px] w-[90%]
              py-[41px] rounded-[26px] font-bold text-4xl"
            :class="`bg-[${colors.accentColor}] text-[${colors.fontSecondaryColor}]`"
          >
            {{ $t('schedule.destinationPool.selectDestination') }}
          </button>
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

  .nested-enter-active .inner,
  .nested-leave-active .inner {
    transition: all 0.3s ease-in-out;
  }

  .nested-enter-from .inner,
  .nested-leave-to .inner {
    transform: translateX(30px);
    opacity: 0;
  }

</style>