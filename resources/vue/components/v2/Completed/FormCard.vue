<script setup>
  import { ref, reactive, computed, watch, onUnmounted, onMounted } from 'vue';
  import { formattingDateYMD, formattingDateHuman } from '@/utils';
  import { useScheduleStore } from '@/store/ScheduleStore';
  import { storeToRefs } from 'pinia';
  import { useRouter, onBeforeRouteLeave } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import {
    useCompletedInitialData,
    useNameKeyboardType,
    useEmailKeyboardType,
    usePassengersKeyboardType,
    useCheckRegisteredUser,
    useFormValidate,
    usePrintTicket,
    useCustomerNameAsPassenger,
    useOnUnmountedHook
  } from '@/composeable/completed';
  import useScrollIndicator from '@/composeable/useScrollIndicator.js';
  
  import LetterKeyboard from '@/components/daytrans/completed/LetterKeyboard.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import Button from '@/components/v2/Common/Button.vue';
  import ShrinkCardOverlay from '@/components/v2/ShrinkCardOverlay.vue';
  import ModalDialogue from '@/components/v2/ModalDialogue.vue';


  const scheduleStore = useScheduleStore();
  const props = defineProps({ tripDetail: Object });
  const emits = defineEmits(['onClickFormCardShrink']);
  const {
    customerInfo,
  } = storeToRefs(scheduleStore);

  const router = useRouter();
  const { t, d, locale } = useI18n();

  /* Day Names */
  const dayNames = computed(() => {
    if (locale.value == 'id') return ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  });

  /* Shrink Card Handler */
  const { el, isScrollable } = useScrollIndicator();
  const onClickFormCardShrink = () => {
    emits('onClickFormCardShrink');
  }


  /* Initial Data */
  const { showSpinner } = useCompletedInitialData();

  /* Customer Field  */
  const {
    isNameField,
    name,
    showNameField,
    updateNameValue,
    closeNameKeyboard,
  } = useNameKeyboardType();

  /* Email Field */
  const {
    isEmailField,
    email,
    showEmailField,
    updateEmailValue,
    closeEmailKeyboard
  } = useEmailKeyboardType();

  /* Passenger Field */
  const { 
    /* Passenger Name */
    passengers, showPassangerField, updatePassengerValue, closePassangerKeyboard,

    /* Passenger Name Return */
    passengersReturn, showPassangerFieldReturn, updatePassengerValueReturn, closePassangerKeyboardReturn,

    /* Infant Form */
    reducedYears, showPassengerInfantNameField, updatePassengerInfantNameValue, closePassengerInfantNameKeyboard,
    showPassengerInfantBirthDateField, updatePassengerInfantBirthDateValue
   } = usePassengersKeyboardType(d);

  
  /* Check Registered User */
  const { checkRegisteredUser } = useCheckRegisteredUser();
  checkRegisteredUser();
  
  /* Form Validating */
  const { invalidSubmit, invalidForm, isFieldEmpty } = useFormValidate(t);

  /* Print Ticket */
  const { printTicket } = usePrintTicket(router, t);

  /* Customer Name As Passenger */
  const { customerNameAsPassenger } = useCustomerNameAsPassenger(t);

  /* CTA Props */
  const ctaProps = computed(() => {
    return {
      type: isFieldEmpty.value ? 'disabled' : 'primary',
      function: () => isFieldEmpty.value ? () => {} : isModalDialogueShow.value = true,
    }
  });

  /* Modal Dialogue */
  const isModalDialogueShow = ref(false);

  watch(locale, () => {
    if (
      (name.value == 'Masukkan Nama' || name.value == 'Enter Your Name') &&
      !!!store?.registeredCustomer
    ) {
      name.value = t('completed.customerNamePlaceHolder');
    }

    if (
      (email.value == 'Masukkan Email' || email.value == 'Enter Your Email') &&
      !!!store?.registeredCustomer
    ) {
      email.value = t('completed.customerEmailPlaceHolder');
    }

    passengers.forEach(passenger => {
      if (
        passenger.name == 'Nama Penumpang' ||
        passenger.name == 'Enter Passenger Name'
      ) {
        passenger.name = t('completed.passengerNamePlaceHolder')
      }
    });

    invalidForm.customerName.message = t('completed.invalidForm.customerName');
    invalidForm.passengersName.forEach(item => item.message = t('completed.invalidForm.passengerName'));
    invalidForm.infantsName.forEach(item => item.message = t('completed.invalidForm.infantName'));
    invalidForm.infantsBirthDate.forEach(item => item.message = t('completed.invalidForm.infantBirthDate'));
  });

  onMounted(() => {
    name.value = scheduleStore.registeredCustomer?.name ?? t('completed.customerNamePlaceHolder');
    email.value = scheduleStore.registeredCustomer?.email ?? t('completed.customerEmailPlaceHolder');
    passengers.forEach(passenger => {
      passenger.name = scheduleStore?.registeredCustomer?.name ?? t('completed.passengerNamePlaceHolder');
    });

    if (scheduleStore.isRoundedTrip) {
      passengersReturn.forEach(passenger => {
        passenger.name = scheduleStore?.registeredCustomer?.name ?? t('completed.passengerNamePlaceHolder');
      });
    }

    
  });

  onUnmounted(() => {
    const { resetGlobalState } = useOnUnmountedHook();
    resetGlobalState();
  });
</script>

<template>
  <div ref="el" class="overflow-y-hidden rounded-[35px] flex-grow relative">
    <!-- <Transition>
      <ShrinkCardOverlay @click="onClickFormCardShrink" v-show="isScrollable" />
    </Transition> -->
    <div class="rounded-[35px] w-full h-full overflow-y-auto p-8 flex flex-col gap-[32px] relative pb-[124px]" :class="`bg-[${colors.secondaryColor}]`">
      <div class="border-1" :class="`border-[${colors.secondaryColor200}]`">
          <div class="font-semibold text-2xl" :class="`text-[${colors.fontPrimaryColor}]`">
            {{ $t('completed.fillForm') }}
          </div>
      </div>

      <!-- Input No Telephone -->
      <div>
          <label class="font-medium text-xl" :class="`text-[${colors.fontPrimaryColor}]`">
            {{ $t('completed.phoneNo') }}
          </label>
          <input
            readonly
            type="text"
            v-model="customerInfo.PhoneNo"
            id="phoneNumb"
            :data-phone-numb="customerInfo.phoneNo"
            class="w-full outline-0 border mt-3 font-medium rounded-2xl text-[20px] p-5 border-[#71747D] text-[#71747D] leading-[23px]"
            placeholder="0851315564"
          >
      </div>

      <!-- Input Name -->
      <div>
          <label class="font-medium text-xl text[#000000]">
            {{ $t('completed.customerName') }}
          </label>
          <div class="flex justify-between flex-col relative">
              <div class="relative w-full" @click="showNameField">
                  <div
                    type="email"
                    id="name"
                    class="w-full border overflow-hidden rounded-2xl text-[20px] border-[#71747D] p-5 leading-[23px]"
                  >
                    <div
                      :class="[name == $t('completed.customerNamePlaceHolder') ? 'text-[#71747D]' : 'text-[#1F2937]']"
                      class="overflow-hidden w-[95%]"
                      id="customerName"
                      :data-customer-name="name"
                    >
                      {{ name }}
                    </div>
                  </div>
                  <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                      <img src="@/assets/images/completed/right.png">
                  </span>
              </div>
              <div class="flex items-center mt-[10px]">
                <input
                  @keydown.prevent=""
                  :disabled="name == t('completed.customerNamePlaceHolder')"
                  type="checkbox"
                  id="customerNameAsPassenger"
                  class="mr-[10px] h-[28px] w-[28px]" 
                  v-model="customerNameAsPassenger"
                >
                <label class=" text-base text-[#71747D] font-medium mt-[3px]" for="customerNameAsPassenger">
                  {{ $t('completed.customerIsPassenger') }}
                </label>
              </div>
              <span
                id="invalidCustomerName"
                :data-is-invalid="invalidForm.customerName.isInvalid"
                class="text-[red] text-[21px] font-semibold absolute bottom-[-30px]"
                v-if="invalidSubmit && invalidForm.customerName.isInvalid"
              >
                {{ invalidForm.customerName.message }}
              </span>
          </div>
      </div>

      <!-- Input Email Pemesanan -->
      <div>
          <label class="font-medium text-xl text[#000000]">{{ $t('completed.customerEmail') }}</label>
          <div class="flex justify-between items-center mt-[10px] relative">
              <div class="relative w-full" @click="showEmailField">
                  <div
                    class="w-full border overflow-hidden rounded-2xl text-[20px] border-[#71747D] p-5 leading-[23px]"
                    :class="`border-[${colors.secondaryColor200}]`"
                  >
                    <div
                      id="email"
                      :data-email="email"
                      :class="[email ==  t('completed.customerEmailPlaceHolder') ? 'text-[#71747D]' : 'text-[#1F2937]']"
                      class="w-[95%] overflow-hidden"
                    >
                      {{ email }}
                    </div>
                  </div>
                  <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                      <img src="@/assets/images/completed/right.png">
                  </span>
              </div>
              <!-- <span class="text-[red] text-[21px] font-semibold absolute bottom-[-30px]" v-if="invalidSubmit && invalidForm.customerEmail.isInvalid">
                {{ invalidForm.customerEmail.message }}
              </span> -->
          </div>
      </div>

      <hr>

      <!-- Passengers -->
      <div>
          <div class="font-semibold text-[24px] pb-[20px] leading-9">
            {{ scheduleStore.isRoundedTrip ? $t('completed.passengersRoundTrip') : $t('completed.passengers') }}
          </div>
          <div class=" flex flex-col w-full gap-8">
            <div v-for="(passenger, index) in passengers" class="w-full" :key="passenger.ticket">
              <label
                class="font-medium text-xl text-[#1F2937]"
              >
                {{ $t('completed.seat') }} {{ passenger.seat_no }}
              </label>
              <div class="relative mt-3" @click="showPassangerField(index)">
                <div
                  class="w-full overflow-hidden border font-medium rounded-2xl p-5 border-[#71747D] text-xl leading-[23px]"
                >
                  <div
                    :id="`passenger_name_${index+1}`"
                    :data-passenger-seat="passenger.seat_no"
                    :data-passenger-name="passenger.name"
                    :class="[passenger.name ==  t('completed.passengerNamePlaceHolder') ? 'text-[#71747D]' : 'text-[#1F2937]']"
                    class="w-[95%] overflow-hidden"
                  >
                    {{ passenger.name }}
                  </div>
                </div>
                <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                    <img src="@/assets/images/completed/right.png" alt="" class="">
                </span>
                <span
                  class="text-[red] text-[21px] font-semibold"
                  :id="`passengerNameInvalid_${index+1}`"
                  :data-is-invalid="invalidForm.passengersName[index].isInvalid"
                  v-if="invalidSubmit && invalidForm.passengersName[index].isInvalid"
                >
                  {{ invalidForm.passengersName[index].message }}
                </span>
              </div>
              <div v-if="false" class="flex items-center mt-[10px] mb-[25px]">
                <input type="checkbox" class="mr-[10px] w-[28px] h-[28px]" v-model="passenger.isInfant">
                <div
                  class=" text-base text-[#71747D] font-medium mt-[3px]"
                  :class="`text-[${colors.fontSecondaryColor300}]`"
                >
                  {{ $t('completed.imWithInfant') }}
                </div>
              </div>

              <!-- Infant Form -->
              <div class="mb-[70px] flex flex-col gap-8" v-if="passenger.isInfant">
                <!-- Infant Name -->
                <div>
                  <label class="font-medium text-xl" :class="`text-[${colors.fontPrimaryColor}]`">
                    {{ $t('completed.childName') }}
                  </label>
                  <div class="flex flex-col relative">
                    <div class="relative mt-3" @click="showPassengerInfantNameField(index)">
                      <div
                        type="email"
                        id="infantName"
                        class="w-full overflow-hidden border font-medium rounded-2xl p-5 border-[#71747D] text-xl leading-[23px]"
                        :class="`border-[${colors.secondaryColor200}] placeholder-[${colors.fontPrimaryColor}]`"
                      >
                        <div
                          :class="[passenger.infant.name == $t('completed.infantNamePlaceHolder') ? `text-[${colors.fontSecondaryColor300}]` : `text-[${colors.fontPrimaryColor}]`]"
                          class="w-[95%] overflow-hidden"
                        >
                          {{ passenger.infant.name }}
                        </div>
                      </div>
                      <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                          <img src="../../../assets/images/completed/right.png" alt="" class="">
                      </span>
                    </div>
                    <span
                      class="text-[red] text-[21px] font-semibold"
                      v-if="invalidSubmit && invalidForm.infantsName[index].isInvalid"
                    >
                        {{ invalidForm.infantsName[index].message }}
                    </span>
                  </div>
                </div>
                <!-- Infant Birth Date -->
                <div>
                  <label class="font-medium text-xl" :class="`text-[${colors.fontPrimaryColor}]`">
                    {{ $t('completed.enterDate') }}
                  </label>
                  <div class="flex justify-between items-center mt-[10px] relative">
                    <div class="relative w-full" @click="showPassengerInfantBirthDateField(index)">
                      <div
                        v-show="passenger.infant.isShowBirthDate"
                        class="absolute left-[-10px] bottom-[90px] border-[2px] rounded-[14px] pt-[15px]"
                        :class="`bg-[${colors.secondaryColor}]`"
                      >
                        <VueDatePicker
                          inline auto-apply
                          :locale="$i18n.locale"
                          :day-names="dayNames"
                          :min-date="reducedYears"
                          :max-date="new Date()"
                          :enable-time-picker="false"
                          @update:model-value="updatePassengerInfantBirthDateValue(index, $event)"
                        />
                      </div>
                      <div
                        :class="[
                          `placeholder-[${colors.fontPrimaryColor}] border-[${colors.secondaryColor200}]`,
                          passenger.infant.birthDateFormatted == $t('completed.infantBirthDatePlaceHolder') ? `text-[${colors.fontSecondaryColor300}]` : `text-[${colors.fontPrimaryColor}]`]"
                        id="infantName"
                        class="w-full border overflow-hidden rounded-2xl text-[20px] border-[#71747D] p-5 leading-[23px]"
                      >
                        {{ passenger.infant.birthDateFormatted }}
                      </div>
                      <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                          <img src="../../../assets/images/completed/right.png" alt="" class="">
                      </span>
                    </div>
                    <span class="text-[red] text-[21px] font-semibold absolute bottom-0" v-if="invalidSubmit && invalidForm.infantsBirthDate[index].isInvalid">
                      {{ invalidForm.infantsBirthDate[index].message }}
                    </span>
                  </div>
                </div>
              </div>
              <!-- End of Infant Form -->

              


            </div>
          </div>
      </div>

      <!-- Passangers Return -->
      <template v-if="scheduleStore.isRoundedTrip">
        <hr>

        <!-- Passengers -->
        <div>
            <div class="font-semibold text-[24px] pb-[20px] leading-9">
              {{ $t('completed.passengersRoundTripReturn') }}
            </div>
            <div class=" flex flex-col w-full gap-8">
              <div v-for="(passenger, index) in passengersReturn" :key="passenger.ticket" class=" w-full">
                <label
                  class="font-medium text-xl text-[#1F2937]"
                >
                  {{ $t('completed.seat') }} {{ passenger.seat_no }}
                </label>
                <div class="relative mt-3" @click="showPassangerFieldReturn(index)">
                  <div
                    class="w-full overflow-hidden border font-medium rounded-2xl p-5 border-[#71747D] text-xl leading-[23px]"
                  >
                    <div
                      :id="`passenger_name_${index+1}`"
                      :data-passenger-seat="passenger.seat_no"
                      :data-passenger-name="passenger.name"
                      :class="[passenger.name ==  t('completed.passengerNamePlaceHolder') ? 'text-[#71747D]' : 'text-[#1F2937]']"
                      class="w-[95%] overflow-hidden"
                    >
                      {{ passenger.name }}
                    </div>
                  </div>
                  <span class="absolute right-[27.71px] top-[50%] transform translate-y-[-50%]">
                      <img src="@/assets/images/completed/right.png" alt="" class="">
                  </span>
                  <span
                    class="text-[red] text-[21px] font-semibold"
                    :id="`passengerNameInvalid_${index+1}`"
                    :data-is-invalid="invalidForm.passengersName[index].isInvalid"
                    v-if="invalidSubmit && invalidForm.passengersName[index].isInvalid"
                  >
                    {{ invalidForm.passengersName[index].message }}
                  </span>
                </div>


              </div>
            </div>
        </div>
      </template>
    </div>

    

    <!-- Next -->
    <div class=" w-full bg-white p-8 sticky bottom-0">
      <Button
        id="btnPrintTicket"
        :type="ctaProps.type"
        @click="ctaProps.function"
      >
        {{ $t('completed.printTicket') }}
      </Button>
    </div>
  </div>


  <LetterKeyboard
    :placeholderValue="$t('completed.customerNamePlaceHolder')"
    :value="name == $t('completed.customerNamePlaceHolder') ? null : name"
    :validation="{ type: 'name', validate: true }"
    :isShow="isNameField"
    :disable-special-char="true"
    id="letterKeyboard_customerName"
    @updatingValue="updateNameValue"
    @closeKeyboard="closeNameKeyboard"
  />
  <LetterKeyboard
    :value="email == $t('completed.customerEmailPlaceHolder') ? null : email"
    :placeholderValue="$t('completed.customerEmailPlaceHolder')"
    :validation="{ type: 'email', validate: true }"
    :isShow="isEmailField"
    id="letterKeyboard_customerEmail"
    @updatingValue="updateEmailValue"
    @closeKeyboard="closeEmailKeyboard"
  />

  <!-- Passenger -->
  <LetterKeyboard
    v-for="(passenger, index) in passengers" :key="passenger.seat_no"
    :validation="{ type: 'name', validate: true }"
    :value="passenger.name == $t('completed.passengerNamePlaceHolder') ? null : passenger.name"
    :isShow="passenger.isShow"
    :placeholderValue="$t('completed.passengerNamePlaceHolder')"
    :disable-special-char="true"
    :id="`letterKeyboard_passenger_${passenger.seat_no}`"
    @updatingValue="updatePassengerValue(index, $event)"
    @closeKeyboard="closePassangerKeyboard(index)"
  />

  <!-- Passenger Return -->
  <LetterKeyboard
    v-if="scheduleStore.isRoundedTrip"
    v-for="(passenger, index) in passengersReturn" :key="passenger.seat_no"
    :validation="{ type: 'name', validate: true }"
    :value="passenger.name == $t('completed.passengerNamePlaceHolder') ? null : passenger.name"
    :isShow="passenger.isShow"
    :placeholderValue="$t('completed.passengerNamePlaceHolder')"
    :disable-special-char="true"
    :id="`letterKeyboard_passenger_return_${passenger.seat_no}`"
    @updatingValue="updatePassengerValueReturn(index, $event)"
    @closeKeyboard="closePassangerKeyboardRetuupdatePassengerValueReturn(index)"
  />

  <!-- <LetterKeyboard
    v-for="(passenger, index) in passengers" :key="passenger.seat_no"
    :validation="{ type: 'name', validate: true }"
    :value="passenger.infant.name == $t('completed.infantNamePlaceHolder') ? null : passenger.infant.name"
    :isShow="passenger.infant.isShowName" @updatingValue="updatePassengerInfantNameValue(index, $event)"
    @closeKeyboard="closePassengerInfantNameKeyboard(index)"
    :placeholderValue="$t('completed.childName')"
  /> -->

  <!-- Modal Dialogue -->
  <Teleport to=".appWrapper">
    <Transition>
      <ModalDialogue
        v-if="isModalDialogueShow"
        @onClickCancel="isModalDialogueShow = false"
        @onClickConfirm="() => {
          isModalDialogueShow = false;
          printTicket();
        }"
      >
        <template #header>
          Konfirmasi Cetak Tiket
        </template>
        <template #content>
          <div class=" w-full flex flex-col gap-2">
            <span>Apakah Anda yakin ingin mencetak tiket sekarang?</span>
            <span class=" text-[#DC2626]">Pastikan semua informasi sudah benar sebelum melanjutkan.</span>
          </div>
        </template>

        <template #confirmCta>
          Cetak Tiket
        </template>
      </ModalDialogue>
    </Transition>
  </Teleport>
</template>