<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore } from '@/store/Store';
import { useScheduleStore } from '@/store/ScheduleStore';
import { useRouter, useRoute } from 'vue-router';
import {
  useSelectPool,
  useSelectDepartureTime,
  useSelectDepartureTimeEvent,
} from '@/composeable/schedule.js';
import { Swiper, SwiperSlide, useSwiper, Virtual } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';


import { adsFullScreen } from '@/data/adsDummy.js';

const props = defineProps({
  durationMinute: {
    type: Number,
    default: 3,
  }
});

const scheduleStore = useScheduleStore();
const { ads } = storeToRefs(scheduleStore);

/* Show The Ads Handler */
const swiperRef = ref(null);
const swiperKey = ref(1);
const duration = ref(props.durationMinute * 60000);
const isAdsShow = ref(false);
let timeoutId;

const showAdsHandler = () => {
  timeoutId = setTimeout(() => {
    console.log('should show ads')
    isAdsShow.value = true;
    swiperRef.value.$el.swiper.autoplay.start();
  }, 60000)
};

const resetShowAdsHandler = () => {
  if (isAdsShow.value) {
    isAdsShow.value = false;
    swiperRef.value.$el.swiper.autoplay.stop();
    showAdsHandler();
  } else {
    clearTimeout(timeoutId);
    showAdsHandler();
  }
}

defineExpose({
  resetShowAdsHandler
})

/* Swiper */
const modules = [Autoplay];
const bannerTotal = 5;

const activeSlide = ref(0);
const progress = ref([]);
const myVideo = ref(null);

// const onActiveIndexChange = (swiper) => {
//   console.log('active index', swiper.activeIndex);
//   const activeIndex = swiper.realIndex;
//   activeSlide.value = activeIndex;
//   for (let i = 0; i < progress.value.length; i++ ) {
//     if (i > activeIndex) {
//       progress.value[i].value = 0;
//     } else {
//       progress.value[i].value = 100;
//     }
//   }
// }

const myVideoPause = (swiper, pointer) => {
  myVideo.value[0].pause();
}
const myVideoPlay = (swiper, pointer) => {
  myVideo.value[0].play();
}

const onTouchEnd = (swiper) => {
  if (adsFullScreen[activeSlide.value].type === 'video') {
    myVideoPlay()
    myVideo.value[0].currentTime = 0;
    console.log('should play and restart video')
  }
  console.log('on touch end');
  swiperRef.value.$el.swiper.autoplay.start();
}

const onTouchStart = () => {
  console.log('on touch starts');
  swiperRef.value.$el.swiper.autoplay.stop();
}

watch(ads, () => {
  console.log('ads trigger');
  swiperKey.value = swiperKey.value++
  swiperRef.value.$el.swiper.autoplay.stop();
  setTimeout(() => {
    swiperRef.value.$el.swiper.autoplay.start();
  }, 0)
});

// watch(activeSlide, () => {
//   if (adsFullScreen[activeSlide.value].type === 'video') {
//     const idAdsVideo = adsFullScreen[activeSlide.value].id;
//     const videoToPlay = myVideo.value.find(video => video.id)
//     console.log('id video', myVideo.value[0].id)
//     myVideo.value[0].play();
//   }
// });

const toEdge = (swiper) => {
  if (adsFullScreen[swiper.realIndex].type === 'video') {
    myVideo.value[0].currentTime = 0;
    console.log('should reset the video')
  }
}

const onAutoplayTimeLeft = (s, time, left) => {
  left ? progress.value.value = 100 - left * 100 : '' ;
}

/* swiper config */
const swiperConfig = computed(() => {
  const autoplayOn = {
    // delay: 2500,
    disableOnInteraction:false,
    waitForTransition: false,
    pauseOnMouseEnter: true
  }
  return {
    loop: scheduleStore.ads.length > 1 ? true : false,
    autoplay: scheduleStore.ads.length > 1 ? autoplayOn : false,
    activeIndexChange: (swiper) => scheduleStore.ads.length > 1 ? onActiveIndexChange(swiper) : () => {},
    autoPlayTimeLeft: (s, time, left) => scheduleStore.ads.length > 1 ? onAutoplayTimeLeft(s, time, left) : () => {}
  }
});


/* Ads On Click handler */
const store = useStore();
const route = useRoute();
const router = useRouter();

/* Select Pool */
const emit = defineEmits(['backToSelectTime', 'showSpinnerEvent', 'selectDepartureTimeEvent']);
const {
  selectPool,
} = useSelectPool(emit);

/* Select Departure Time */
const { selectDepartureTime } = useSelectDepartureTime(emit);

/* Select Departure Function */
const { selectDepartureTimeEvent } = useSelectDepartureTimeEvent();

const adsFullScreenOnClickHandler = async (ads) => {
  // resetShowAdsHandler();
  console.log(ads);
  return;
  store.routingFromAds = true;
  scheduleStore.date = new Date(ads.data.departure_date)
  await scheduleStore.getDeparture();
  await scheduleStore.getDestination({
    destination:  ads.data.departure_id,
  });
  
  await selectPool(ads.data.destination_id);

  if (ads.data.id_product) {
    console.log('select seat should triggered');
    selectDepartureTime(ads.data.id_product, ads.data.destination_id);
    selectDepartureTimeEvent(ads.data.id_product);
  }
  await router.push({ name: 'schedule' });
}



onMounted(() => {
  swiperRef.value.$el.swiper.autoplay.stop();
  showAdsHandler();
});

onUnmounted(() => {
  clearTimeout(timeoutId);
  
}); 


</script>

<template>
  <div
    class=" z-[100] absolute top-0 left-0"
    :class="[ isAdsShow ? 'w-full h-full' : 'w-0 h-0' ]"
  >

    <div class=" flex gap-4 w-full absolute top-0 left-0 z-10  px-10 py-8">
      
      <progress
        ref="progress"
        class=" w-full h-1 rounded-full"
        :class="[ scheduleStore.ads.length > 1 ? 'block' : 'hidden' ]"
        max="100"
        value="0"
      />
    </div>
    <swiper
      ref="swiperRef"
      :modules="modules"
      :loop="swiperConfig.loop"
      :autoplay="swiperConfig.autoplay"
      @autoplay-time-left="swiperConfig.autoPlayTimeLeft"
      @touch-start="onTouchStart"
      @touch-end="onTouchEnd"
    >
      <swiper-slide
        v-for="(ads, index) in scheduleStore.ads"
        :data-swiper-autoplay="parseInt(ads.duration) * 1000"
        :key="ads.id"
        v-slot="{}"
      >
        <img
          :src="ads.source"
          class=" mx-auto w-full h-full"
          loading="lazy"
          alt="banner"
          @click="adsFullScreenOnClickHandler(ads)"
        >
        <div
          class="swiper-lazy-preloader swiper-lazy-preloader-white"
        ></div>

        <!-- <video
          v-else
          muted="muted"
          class="w-full h-full"
          ref="myVideo"
          :id="`video_${index}`"
          :src="ads.img_url"
        >

        </video> -->
      </swiper-slide>
      
    </swiper>
  </div>
</template>


<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}

progress::-webkit-progress-value {
  background: white;
}

progress::-webkit-progress-bar {
  background: rgba(255, 255, 255, 0.226);
}
</style>