import { ref } from "vue";

const useKeyboard = (value, maxLength = 30) => {
  const inputEl = ref(null);
  const inputValue = ref(value)
  const isDeleteButtonPressed = ref(false);
  const intervalDuration = ref(230);
  const pointerPosition = ref(0);


  const keyboardClick = async (value, e) => {

    if (inputValue.value === null) {
      inputValue.value = value;
      pointerPosition.value += 1;
    } else if(inputValue?.value.length <= maxLength) {
      inputValue.value = inputValue.value.substring(0, pointerPosition.value) + value + inputValue.value.substring(pointerPosition.value);
      pointerPosition.value += 1 ;
    }
    setTimeout(() => {
      inputEl.value.focus();
      inputEl.value.setSelectionRange(pointerPosition.value, pointerPosition.value);
    })

  };
  
  const deleteLetter = async () => {
    if (inputValue.value !== null && pointerPosition.value !== 0) {
      // inputValue.value = inputValue.value.slice(0, -1)
      inputValue.value = inputValue.value.substring(0, pointerPosition.value - 1) + inputValue.value.substring(pointerPosition.value);
      pointerPosition.value -= 1;
      setTimeout(() => {
        inputEl.value.focus();
        inputEl.value.setSelectionRange(pointerPosition.value, pointerPosition.value);
      })
    };
  };
  const getIntervalDuration = () => {
    return intervalDuration.value - 100;
  };
  const keyDownDeleteLetter = () => {
    // input.value.focus();
    isDeleteButtonPressed.value = true;
    deleteLetter();

    let intervalId = setInterval(() => {
      if (isDeleteButtonPressed.value) {
        deleteLetter();
        intervalDuration.value -= 100;
        clearInterval(intervalId);
        intervalId = setInterval(keyDownDeleteLetter(), intervalDuration.value);
      } else {
        intervalDuration.value = 230;
        clearInterval(intervalId);
      }
    }, intervalDuration.value);
  };
  const keyUpDeleteLetter = () => {
    isDeleteButtonPressed.value = false;
    intervalDuration.value = 230;
  };

  return {
    inputEl,
    inputValue,
    isDeleteButtonPressed,
    intervalDuration,
    keyboardClick,
    deleteLetter,
    getIntervalDuration,
    keyUpDeleteLetter,
    keyDownDeleteLetter,
  };
}

export default useKeyboard;