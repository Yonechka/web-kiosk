import { ref, onMounted, onUpdated } from 'vue';
import { useResizeObserver } from '@vueuse/core';

const useScrollIndicator = () => {
  const el = ref(null);
  const elHeight = ref(0);
  const isScrollable = ref(false);
  useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { height } = entry.contentRect;
    if (elHeight.value > height) {
      isScrollable.value = true;
    } else {
      isScrollable.value = false;
    }
    console.log(elHeight.value, height)
  });

  onUpdated(() => {
    elHeight.value = el.value.scrollHeight;
  });

  return { el, isScrollable };
}

export default useScrollIndicator;