<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const props = defineProps({
  menus: Array
});


const dynamicClass = (routeName) => route.name === routeName ? 'active' : '';

</script>

<template>
  <div class=" w-full pl-6 mt-[140px]">
    <div
      v-for="menu in props.menus"
      @click="menu.function"
      :key="menu.label"
      class=" w-full rounded-l-[26px] h-[100px] flex justify-center items-center text-[#71747D] text-2xl font-bold bg-white"
      :class="[dynamicClass(menu.route)]"
    >
      {{ $t(menu.label) }}
    </div>
  </div>
</template>


<style scoped>
  .active {
    background: v-bind('colors.primaryColor');
    color: white;
  }
</style>