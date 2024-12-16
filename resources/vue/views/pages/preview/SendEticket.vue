<script setup>
  import { ref } from 'vue';
  import { useScheduleStore } from '../../../store/ScheduleStore';
  import { useRouter } from 'vue-router';
  import { useSendTicket } from '../../../composeable/sendticket.js';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';

  import LetterKeyboard from '../../../components/jackal/completed/LetterKeyboard.vue';
  import OverlaySpinner from '../../../components/jackal/OverlaySpinner.vue';
  
  const scheduleStore = useScheduleStore();
  const router = useRouter();
  
  const { keyboardModal, updateValue, sendEticket, isShow, value, showSpinner } = useSendTicket(toast);


</script>
<template>
    <Teleport to=".appWrapper">
        <OverlaySpinner bg="bg-[#00000060]" v-show="showSpinner"/>
        <div
          class="w-full absolute h-[1920px] pt-[73px]"
          :class="`bg-[${colors.primaryColor}]`"
        >
            <img src="../../../assets/images/logo-white-text.png" class="mx-auto w-[239px]"> <br>
            <div
              class="text-[96px] font-bold text-center pb-[60px]"
              :class="`text-[${colors.fontSecondaryColor}]`"
            >
              Kirim E-tiket
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
                          :class="[`border-[${colors.secondaryColor200}] bg-[${colors.secondaryColor}]`, value == 'Masukkan Email' ? `text-[${colors.fontSecondaryColor300}]` : `text-[${colors.fontPrimaryColor}]`]"
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
                      v-if="value != 'Masukkan Email'"
                      @click="sendEticket"
                      class="flex justify-center py-[37px] items-center w-full rounded-[26px]"
                      :class="`bg-[${colors.accentColor}]`"
                    >
                        <div class="font-bold text-4xl" :class="`text-[${colors.fontSecondaryColor}]`">Selanjutnya</div>
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
                          Selanjutnya
                        </div>
                        <img src="../../../assets/images/next.png " class="ml-[10px] ">
                    </div>
                </div>
            </div>
            <div class="mt-[296px] pr-[700px]">
                <div class="flex items-center py-[30px] w-full rounded-r-[100px] bg-[#F18C33]">
                    <img src="../../../assets/images/leftArrowWhite.png " class="pl-[30px]">
                    <div
                      @click="$router.back()"
                      class="font-semibold pl-[20px] text-[48px]"
                      :class="`text-[${colors.fontSecondaryColor}]`"
                    >
                      Kembali
                    </div>
                </div>
            </div>
        </div>
        <LetterKeyboard
          placeholderValue="Masukkan Email"
          :value="value == 'Masukkan Email' ? null : value"
          :validation="{ type: 'email', validate: true }"
          :isShow="isShow"
          @updatingValue="updateValue"
          @closeKeyboard="keyboardModal"
        />
    </Teleport>
</template>