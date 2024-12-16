<script setup>
  import { ref, watch } from 'vue';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useRouter } from 'vue-router';
  import { useSendTicket } from '../../../composeable/sendticket.js';
  import { toast } from 'vue3-toastify';
  import { useI18n } from 'vue-i18n';
  import 'vue3-toastify/dist/index.css';

  import LetterKeyboard from '../../../components/jackal/completed/LetterKeyboard.vue';
  import OverlaySpinner from '../../../components/jackal/OverlaySpinner.vue';
  import LanguageSelector from '@/components/LanguageSelector.vue';
  
  const scheduleStore = useScheduleStore();
  const router = useRouter();

  /* i18N */
  const { t, locale } = useI18n({ useScope: 'global' });
  
  const { keyboardModal, updateValue, sendEticket, isShow, value, showSpinner } = useSendTicket(toast, t);
  watch(locale, () => {
    if (value.value == 'Enter Email' || value.value == 'Masukkan Email') value.value = t('sendEticket.inputPlaceHolder')
  });

</script>
<template>
    <Teleport to=".appWrapper">
        <OverlaySpinner bg="bg-[#00000060]" v-show="showSpinner"/>
        <LanguageSelector dynamicClass="rounded-[30px] py-6 px-8 text-[32px] absolute top-[80px] right-[80px] z-10" />
        <div
          class="w-full absolute h-[1920px] pt-[180px]"
          :class="`bg-[${colors.primaryColor}]`"
        >
            <img src="../../../assets/images/logo-white-text.png" class="mx-auto w-[239px]"> <br>
            <div
              class="text-[96px] font-bold text-center pb-[60px]"
              :class="`text-[${colors.fontSecondaryColor}]`"
            >
              {{ $t('sendEticket.sendEticket') }}
            </div>
            <div class="flex justify-center items-center">
                <div
                  class="justify-center h-[408px] w-[408px] flex rounded-full items-center"
                  :class="`bg-[${colors.primaryColor80}]`"
                >
                    <img src="../../../assets/images/sendEticket.png">
                </div>
            </div>
            <div class="px-[195px] mt-[80px]">
                <label class="font-semibold text-[40px]" :class="`text-[${colors.fontSecondaryColor}]`">Email</label>
                <div class="flex justify-between items-center pt-[10px]">
                    <div class="relative w-full">
                        <div
                          @click="keyboardModal"
                          type="email"
                          id="name"
                          :class="[`border-[${colors.secondaryColor200}] bg-[${colors.secondaryColor}]`, value == t('sendEticket.inputPlaceHolder') ? `text-[${colors.fontSecondaryColor300}]` : `text-[${colors.fontPrimaryColor}]`]"
                          class="w-full font-medium rounded-[11px] px-[32px]  py-[20px] text-[30px]"
                        >
                            {{ value }}
                        </div>
                        <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                          <img src="../../../assets/images/right.png" alt="" class="">
                        </span>
                    </div>
                </div>

                <div class="flex justify-center mt-[50px]">
                    <div
                      v-if="value != $t('sendEticket.inputPlaceHolder')"
                      @click="sendEticket"
                      class="flex justify-center py-[37px] items-center w-full rounded-[26px]"
                      :class="`bg-[${colors.accentColor}]`"
                    >
                        <div class="font-bold text-4xl" :class="`text-[${colors.fontSecondaryColor}]`">
                          {{ $t('sendEticket.send') }}
                        </div>
                        <img src="../../../assets/images/next.png " class="ml-[10px] ">
                    </div>
                    <div
                      v-else
                      class="flex justify-center py-[37px] items-center w-full rounded-[26px]"
                      :class="`bg-[${colors.secondaryColor200}]`"
                    >
                        <div
                          class="font-bold text-4xl"
                          :class="`text-[${colors.fontSecondaryColor}]`"
                        >
                          {{ $t('sendEticket.send') }}
                        </div>
                        <img src="../../../assets/images/next.png " class="ml-[10px] ">
                    </div>
                </div>
            </div>
            <div class="mt-[220px] pr-[700px]">
                <div class="flex items-center py-[30px] w-full rounded-r-[100px] bg-[#F18C33]">
                    <img src="../../../assets/images/leftArrowWhite.png " class="pl-[30px]">
                    <div
                      @click="$router.back()"
                      class="font-semibold pl-[20px] text-[48px]"
                      :class="`text-[${colors.fontSecondaryColor}]`"
                    >
                      {{ $t('sendEticket.back') }}
                    </div>
                </div>
            </div>
        </div>
        <LetterKeyboard
          :placeholderValue="$t('sendEticket.inputPlaceHolder')"
          :value="value == $t('sendEticket.inputPlaceHolder') ? null : value"
          :validation="{ type: 'email', validate: true }"
          :isShow="isShow"
          @updatingValue="updateValue"
          @closeKeyboard="keyboardModal"
        />
    </Teleport>
</template>