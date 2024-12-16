<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
  value: Array
});
const emits = defineEmits(['onChange']);

const dataLocal = ref(props.value);
const onChangeHandler = (index) => {
  dataLocal.value.forEach(item => {
    item.isSelected = false;
  })
  dataLocal.value[index].isSelected = true;
  emits('onChange', index)
}
</script>

<template>
  <div>
    <div class=" text-[#1F2937] font-medium text-xl mb-3">
      <slot name="label"></slot>
    </div>
  
    <div class=" w-full flex gap-[14px]">
      <div
        
        v-for="(item, index) in dataLocal"
        @click="onChangeHandler(index)"
        class="w-full border border-[#71747D] rounded-2xl p-5 flex items-center gap-[15px] text-[#555555]"
      >
        <img v-show="item.isSelected" src="@/assets/images/icCheckboxSelected.svg" alt="icCheckBoxSelected">
        <img v-show="!item.isSelected" src="@/assets/images/icCheckboxUnselected.svg" alt="icCheckBoxUnSelected">
        {{ item.label }}
        
      </div>
    </div>
  </div>
</template>