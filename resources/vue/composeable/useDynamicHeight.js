import { ref, computed } from "vue";

const useDynamicHeight = ({ baseHeight = 0, expandedHeight = 0 }) => {
  const isElementExpanded = ref(true);
  
  const onClickHandler = () => isElementExpanded.value = !isElementExpanded.value;

  const dynamicHeight =  computed(() => {
    
    if (typeof expandedHeight === 'number') {
      return isElementExpanded.value ? expandedHeight : baseHeight
    }
    
    return isElementExpanded.value ?
      expandedHeight.reduce((prev, el) => prev + el.value, 0) + baseHeight + 50 :
      baseHeight
  });

  return { dynamicHeight, isElementExpanded, onClickHandler }
}

export default useDynamicHeight;