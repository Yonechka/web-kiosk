<script setup>
  const props = defineProps({
    outletName: {
      type: String,
    },
    isChangable: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: 'outletName'
    },
    label: {
      type: String,
      default: 'schedule.departurePool'
    }
  });

  const emits = defineEmits(['onClickChangeBtn']);

  const changeBtnHandler = () => {
    emits('onClickChangeBtn');
  }
</script>

<template>
  <div class=" w-full bg-white px-8 py-7 text-[#1F2937] rounded-[35px] relative">
    <div class=" font-medium text-2xl leading-9 text-[#71747D] mb-1">
      {{ $t(props.label) }}
    </div>
    <div v-if="props.outletName" class=" text-[32px] font-bold text-[#1F2937]">
      <div :id="props.id" v-if="props.outletName.length > 15">
        {{ props.outletName.slice(0, 13) + "..." }}
      </div>
      <div :id="props.id" v-else>
        {{ props.outletName }}
      </div>
    </div>
    <div
      v-if="props.isChangable"
      @click="changeBtnHandler"
      class="absolute text-[18px] font-semibold bottom-[32px] right-[32px] cursor-pointer"
      :class="`text-[${colors.primaryColor}]`"
    >
      {{ $t('schedule.changeLocation') }}
    </div>
  </div>
</template>