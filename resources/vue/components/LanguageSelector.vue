<script setup>
import { ref, onMounted, computed } from 'vue';
import { gsap } from "gsap";
import { useI18n } from 'vue-i18n';

const props = defineProps({
  dynamicClass: {
    type: String,
    default: ''
  },
})

let ctx;
let tl;
let tlCta;
let tweenCtaId;
let tweenCtaEn;

const { t, locale } = useI18n({ useScope: 'global' });
const isModalShow = ref(false);

const dynamicIc = computed(() => {
  return locale.value == 'id' ? '/images/ic_indonesia_flag.svg' : '/images/ic_uk_flag.svg';
});

const dynamicLabel = computed(() => {
  return locale.value == 'id' ? 'Bahasa Indonesia' : 'English';
});


const onClickSelector = () => {
  tl.reversed(!tl.reversed());
}

const changeLanguage = (language) => {
  locale.value = language;
  tl.reversed(!tl.reversed());

  language == 'id' ? tweenCtaId.reversed(!tweenCtaId.reversed()) : tweenCtaEn.reversed(!tweenCtaEn.reversed());
}

onMounted(() => {

  gsap.set('.overlayBG', { opacity: 0 });
  gsap.set('.languageSelector', { opacity: 0, y: 1000 });
  gsap.set('.modalLanguage', { autoAlpha: 0 });
  gsap.set('.icCheklistId', { x: 230, opacity: 0 });
  gsap.set('.icCheklistEn', { x: 230, opacity: 0 });

  tweenCtaId = gsap.timeline({ onComplete: () => tweenCtaId.reversed(!tweenCtaId.reversed()) });
  tweenCtaId.to('.ctaId', { borderColor: 'red', duration: 0.4 }).reverse();
  tweenCtaId.to('.icCheklistId', { x: 180, duration: 0.2, opacity: 1 }, '<').reverse();

  tweenCtaEn = gsap.timeline({ onComplete: () => tweenCtaEn.reversed(!tweenCtaEn.reversed()) });
  tweenCtaEn.to('.ctaEn', { borderColor: 'red', duration: 0.4 }).reverse();
  tweenCtaEn.to('.icCheklistEn', { x: 78, duration: 0.2, opacity: 1 }, '<').reverse();

  tl = gsap.timeline();
  tl.to('.modalLanguage', { autoAlpha: 1 });
  tl.to('.overlayBG', { opacity: 1, duration: 0.6 }, '<').reverse();
  tl.to('.languageSelector', { opacity: 1, duration: 0.6, y: 0, ease: 'back.out' }, '<').reverse();
    
});

</script>

<template>
  <div
    @click="onClickSelector"
    class="items-center  bg-white border-[1px] border-[#02061750] flex"
    :class="props.dynamicClass"
  >
    <img
      :src="dynamicIc"
      alt="ic_flag"
      class="ic_flag w-8 h-8 rounded-full mr-4"
    >
    {{ dynamicLabel }}
  </div>

  <Teleport to='#app'>
    <div class="modalLanguage w-full h-[1920px] fixed top-0 left-0 z-[100] flex justify-center items-center">
        <!-- Overlay -->
        <div @click="onClickSelector" class="overlayBG w-full h-full bg-[#00000038] absolute left-0 top-0"></div>

        <!-- Modal -->
        <div class="languageSelector w-[760px] h-[306px] bg-white rounded-[32px] relative z-10 p-[40px]">
          <div class=" text-2xl font-semibold flex items-center justify-center pb-5">
            <img src="/images/ic_select_language.svg" alt="ic_select_language" class=" mr-3">
            {{ $t('selectLanguage') }}
          </div>

          <hr class="pb-6 opacity-[0.5]">

          <div class="flex gap-3">
            <!-- ID Button -->
            <div
              @click="changeLanguage('id')"
              class="ctaId w-full text-xl font-bold py-[26px] border-[1px] border-[#EEEEEE] flex flex-col justify-center items-center rounded-[30px]"

            >
              <img
                src="/images/ic_indonesia_flag.svg"
                alt="ic_indonesia_flag"
                class="ic_flag rounded-full w-16 h-16 mb-4"
              >
              <div class="flex items-center relative">
                Bahasa Indonesia <img src="/images/ic_checklist_green.svg" class="ml-2 absolute icCheklistId" alt="ic_checklist_green">
              </div>
              
            </div>

            <!-- EN Button -->
            <div @click="changeLanguage('en')" class="ctaEn w-full text-xl font-bold py-[26px]  border-[1px] border-[#EEEEEE] flex flex-col justify-center items-center rounded-[30px]">
              <img
                src="/images/ic_uk_flag.svg"
                alt="ic_indonesia_flag"
                class="ic_flag rounded-full w-16 h-16 mb-4"
              >
              <div class="flex text-center relative">
                English <img src="/images/ic_checklist_green.svg" class="icCheklistEn absolute" alt="ic_checklist_green ">
              </div>
            </div>
          </div>
        </div>
    </div>
  </Teleport>
</template>

<style>
</style>