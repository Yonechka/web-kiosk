<script setup>
import { ref, toRef, watch } from 'vue';

import useKeyBoard from '@/composeable/useKeyboard.js';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps({
  label: {
    type: String,
    default: 'Form'
  },
  minLength: {
    type: Number,
    default: 3
  },
  maxLength: {
    type: Number,
    default: 30
  },
  validation: {
    type: Object,
    default: {
      validate: (_) => true,
      message: null
    }
  },
  isShow: Boolean,
  value: String
});

const emits = defineEmits(['onChange', 'closeKeyboard']);

const isShow = toRef(props, 'isShow');

/* i18n */
const { t, locale } = useI18n();

/* Keyboard Function */
let {
  keyboardClick,
  keyUpDeleteLetter,
  keyDownDeleteLetter,
  inputEl,
  inputValue,
} = useKeyBoard(props.value, props.maxLength);


/* Pads Data */
const pads = [
  {
    type: 'number',
    value: '1',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'number',
    value: '2',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'number',
    value: '3',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'number',
    value: '4',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'number',
    value: '5',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'number',
    value: '6',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'number',
    value: '7',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'number',
    value: '8',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'number',
    value: '9',
    function: (value) => keyboardClick(value)
  },
  {
    type: 'blank',
    value: '',
    function: () => {},
  },
  {
    type: 'number',
    value: '0',
    function: (value) => keyboardClick(value),
  },
  {
    type: 'cta',
    value: 'Delete',
    function: (value) => { value },
  },
];



const dynamicClass = (type) => type === 'number' ? 'bg-slate-600 rounded-[20px] numpad text-[#1F2937] text-2xl font-bold' : '';
const onChangeHandler = () => {
  /* Empty Form Validation */
  if (inputValue.value === null || inputValue.value.split(' ').join('') === '') {
    toast.error(t('keyboard.validation.formCannotBeEmpty'), {
      position: toast.POSITION.TOP_CENTER,
      theme: 'colored',
      icon: false
    });
    return;
  } 
  
  /* Min Length Validation */
  if (inputValue.value.length < props.minLength) {
    toast.error(`${props.label} Minimal ${props.minLength} Angka!`, {
      position: toast.POSITION.TOP_CENTER,
      theme: 'colored',
      icon: false
    });
    return;
  }

  /* Custom Validation */
  if (!props.validation.validate(inputValue.value)) {
    toast.error(props.validation.message, {
      position: toast.POSITION.TOP_CENTER,
      theme: 'colored',
      icon: false
    });
    return;
  }

  emits('onChange', inputValue.value);
  emits('closeKeyboard');
}
</script>

<template>
  <Teleport to=".appWrapper">
    <div v-show="isShow" class=" w-full h-full bg-[#000000c7] absolute top-0 left-0 flex flex-col justify-end items-center z-[20]">
      <img
        @click="() => {
          inputValue = props.value;
          emits('closeKeyboard')
        }"
        src="@/assets/images/ic-close-modal.png"
        alt="ic-close-modal"
        class="mb-3"
      >
      <div class=" px-8 bg-[#D9D9D9] pt-8 rounded-t-2xl">
        <input
          @keydown.prevent=""
          v-model="inputValue"
          ref="inputEl"
          :data-phone-numb="inputValue"
          type="text"
          class=" w-[400px] mb-7 py-5 text-center text-xl border-[#71747D] border-[1px] outline-0 focus:outline-0 rounded-2xl pointer-events-none"
        >
        <div class=" w-fit p-5 grid grid-cols-3 gap-4 self-center mx-auto">
          <div
            v-for="(pad, index) in pads"
            :id="`pad_${index+1}`"
            :data-pad-value="pad.value"
            :class="[dynamicClass(pad.type)]"
            class="w-16 h-16 flex justify-center items-center cursor-pointer"
          >
            <div
              class=" w-full h-full flex justify-center items-center cursor-pointer"
              v-if="pad.type === 'number'"
              @click="pad.function(pad.value)"
            >
              {{ pad.value }}
            </div>
            <div
              v-if="pad.type === 'cta'"
              id="btnDeleteNum"
              src="@/assets/images/ic-delete.svg"
              alt="ic-delete"
              @touchmove.prevent=""
              @touchstart="keyDownDeleteLetter"
              @touchend="keyUpDeleteLetter"
              class=" w-full h-full flex justify-center items-center cursor-pointer"
            >
              <img
                src="@/assets/images/ic-delete.svg"
              >
            </div>
          </div>
          <button
            @click="onChangeHandler"
            class=" w-full col-span-3 rounded-[20px] py-[18px] text-white font-bold text-2xl text-center okBtn"
          >
            OK
          </button>
        </div>

        
      </div>
    </div>
  </Teleport>
  
</template>

<style scoped>
.numpad {
  background: linear-gradient(180deg, #FFFFFF 0%, #F2F2F2 100%);
  border: 1.5px solid #E5E7EB;
  box-shadow: 0px 4px 10px -2px #0000000D;
  box-shadow: 0px 2px 2px -1px #0000001A;
  box-shadow: 0px -8px 4px 0px #0000000D inset;
}

.okBtn {
  background: linear-gradient(180deg, #00990F 0%, #01710C 100%);
}

</style>