<script setup>
import {
  useKeyboard,
  useReservationInitialData
} from '@/composeable/reservation';


/* Initial Data */
const {
  phoneNo,
} = useReservationInitialData();

/* Keyboard Function */
let {
  keyboardClick,
  keyUpDeleteLetter,
  keyDownDeleteLetter,
  input
} = useKeyboard();

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

defineExpose({
  phoneNo
});

const dynamicClass = (type) => type === 'number' ? 'bg-slate-600 rounded-[20px] numpad text-[#1F2937] text-2xl font-bold' : '';
</script>

<template>
  <input
    @keydown.prevent=""
    v-model="phoneNo"
    ref="input"
    :data-phone-numb="phoneNo"
    type="text"
    class=" w-full py-5 text-center text-xl border-[#71747D] border-[1px] outline-0 focus:outline-0 rounded-2xl pointer-events-none"
  >
  <div class=" p-5 grid grid-cols-3 gap-4 self-center">
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
  </div>
</template>

<style scoped>
.numpad {
  background: linear-gradient(180deg, #FFFFFF 0%, #F2F2F2 100%);
  border: 1.5px solid #E5E7EB;
  box-shadow: 0px 4px 10px -2px #0000000D;
  box-shadow: 0px 2px 2px -1px #0000001A;
  box-shadow: 0px -8px 4px 0px #0000000D inset;
}
</style>