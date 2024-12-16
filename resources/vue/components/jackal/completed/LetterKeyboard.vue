<script setup>
  import { ref, toRef, watch } from 'vue';
  import { toast } from 'vue3-toastify';
  import { useI18n } from 'vue-i18n';
  import 'vue3-toastify/dist/index.css';

  const props = defineProps({
    value: String,
    isShow: Boolean,
    placeholderValue: String,
    validation: {
      type: Object,
      default: {
        validate: false,
        type: null
      }
    },
  });

  const { t, locale } = useI18n();
  const isShow = toRef(props, 'isShow');
  const updatedValue = ref(props.value);


  watch(() => props.value, () => {
    updatedValue.value = props.value;
  });

  /* Emitting Update Value */
  const validationTemplate = {
    email: [
      {
        // regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        regex: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
        message: t('keyboard.validation.email'),
        isPassed: false
      }
    ],
    name: [
      {
        regex: /^.{3,}$/,
        message: t('keyboard.validation.nameMin'),
        isPassed: false
      },
      {
        regex: /^[a-zA-Z\s]+$/,
        message: t('keyboard.validation.nameNotValid'),
        isPassed: false
      },
    ],
    
  };

  /* Watch Language */
  watch(locale, () => {
    validationTemplate.email[0].message = t('keyboard.validation.email');
    validationTemplate.name[0].message = t('keyboard.validation.nameMin');
    validationTemplate.name[1].message = t('keyboard.validation.nameNotValid');
  });

  const emit = defineEmits(['updatingValue', 'closeKeyboard']);
  const validation = () => {
    if (props.validation.validate) {
      validationTemplate[props.validation.type].forEach(item => {
        item.isPassed = item.regex.test(updatedValue.value)
      })
      return validationTemplate[props.validation.type].every(item => item.regex.test(updatedValue.value))
    }
    return true;
  };
  const updatingValue = () => {
    const validate = validation();
    if (validate) {
      if (updatedValue.value === null) {
        toast.error(t('keyboard.validation.formCannotBeEmpty'), {
          position: toast.POSITION.TOP_CENTER,
          theme: 'colored',
          icon: false
        });
        return;
      } else {
        const trimmed = updatedValue.value.split(' ').join('');
        if (trimmed === '') {
          toast.error(t('keyboard.validation.formCannotBeEmpty'), {
            position: toast.POSITION.TOP_CENTER,
            theme: 'colored',
            icon: false
          });
          return;
        }
        if (trimmed.length < 3) {
          toast.error(t('keyboard.validation.nameMin'), {
            position: toast.POSITION.TOP_CENTER,
            theme: 'colored',
            icon: false
          });
          return;
        }
        emit('updatingValue', updatedValue.value);
      }  
    } else {
      const message = validationTemplate[props.validation.type].find(item => item.isPassed === false).message
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        icon: false
      });
    }
  }; 
  const closeKeyboard = () => {
    emit('closeKeyboard');
    updatedValue.value = props.value;
  };
  
  /* Keyboard Function */
  const input = ref(null);
  const isDeleteButtonPressed = ref(false);
  const intervalDuration = ref(230);
  const pointerPosition = ref(0);

  const onPointerChange = () => {
    pointerPosition.value = input.value.selectionStart;
  }

  const keyboardClick = (value) => {
    input.value.focus();
    if (updatedValue.value === null) {
      updatedValue.value = value
    }else if(updatedValue.value.length < 32) {
      updatedValue.value += value;
    }

    // if (updatedValue.value === null) {
    //   updatedValue.value = value;
    //   pointerPosition.value += 1;
    // } else if(updatedValue?.value.length < 32) {
    //   updatedValue.value = updatedValue.value.substring(0, pointerPosition.value) + value + updatedValue.value.substring(pointerPosition.value);
    //   pointerPosition.value += 1 ;
    // }
    // setTimeout(() => {
    //   input.value.focus();
    //   input.value.setSelectionRange(pointerPosition.value, pointerPosition.value);
    // })
  };
  const deleteLetter = () => {
    input.value.focus();
    if (updatedValue.value !== null) updatedValue.value = updatedValue.value.slice(0, -1);

    // if (updatedValue.value !== null && pointerPosition.value !== 0) {
    //   updatedValue.value = updatedValue.value.substring(0, pointerPosition.value - 1) + updatedValue.value.substring(pointerPosition.value);
    //   pointerPosition.value -= 1;
    //   setTimeout(() => {
    //     input.value.focus();
    //     input.value.setSelectionRange(pointerPosition.value, pointerPosition.value);
    //   })
    // };
  };

  const keyDownDeleteLetter = () => {
    input.value.focus();
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

</script>

<template>
<Teleport to=".appWrapper">
    <div v-show="isShow" class="w-full h-full absolute top-0  flex items-end z-[99]">
        <div class="w-full h-full absolute top-0 left-0 bg-[#00000088] z-[90]"></div>
        <div @click="closeKeyboard" class="bg-[#C66C6C] flex justify-center items-center cursor-pointer absolute z-[91] top-[1100px] left-[480px] rounded-full w-[98px] h-[98px]">
            <img src="./../../../assets/images/x.png" class="">
        </div>
        <div class="mx-auto w-[856px] lg:w-[856px] z-[100]">
        <div class="mt-[40px]">
            <input
              inputmode="none"
              ref="input" type="text"
              class="w-[856px] pointer-events-none outline-none rounded-t-[11px] border-[#858585] rounded-b-[8px] flex border-[1px] pl-8 py-[20px] text-[#000] text-[30px] font-medium"
              :placeholder="props.placeholderValue" v-model="updatedValue"
            >
            <div class="bg-[#D9D9D9] mt-[30px] rounded-t-[28px]">
                <div class="pb-[15px] pt-6">
                    <!-- Number -->
                    <div v-if="props.validation.type != 'name'" class="px-[30px] flex justify-between gap-[13px]">
                        <div @click="keyboardClick('1')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal text-[#000000]">1</div>
                        </div>
                        <div @click="keyboardClick('2')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center  rounded-[10.947px] text-[52.544px] font-normal">2</div>
                        </div>
                        <div @click="keyboardClick('3')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center  rounded-[10.947px] text-[52.544px] font-normal">3</div>
                        </div>
                        <div @click="keyboardClick('4')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">4</div>
                        </div>
                        <div @click="keyboardClick('5')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">5</div>
                        </div>
                        <div @click="keyboardClick('6')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">6</div>
                        </div>
                        <div @click="keyboardClick('7')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">7</div>
                        </div>
                        <div @click="keyboardClick('8')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px]">8</div>
                        </div>
                        <div @click="keyboardClick('9')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">9</div>
                        </div>
                        <div @click="keyboardClick('0')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">0</div>
                        </div>
                    </div>

                    <!-- Letter -->
                    <div class="px-[30px] mt-[36.86px] flex justify-between gap-[13px]">
                        <div @click="keyboardClick('Q')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">Q</div>
                        </div>
                        <div @click="keyboardClick('W')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">W</div>
                        </div>
                        <div @click="keyboardClick('E')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">E</div>
                        </div>
                        <div @click="keyboardClick('R')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">R</div>
                        </div>
                        <div @click="keyboardClick('T')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">T</div>
                        </div>
                        <div @click="keyboardClick('Y')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">Y</div>
                        </div>
                        <div @click="keyboardClick('U')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">U</div>
                        </div>
                        <div @click="keyboardClick('I')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">I</div>
                        </div>
                        <div @click="keyboardClick('O')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">O</div>
                        </div>
                        <div @click="keyboardClick('P')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">P</div>
                        </div>
                    </div>
                    <div class="px-[70.55px] mt-[25px] flex justify-between gap-[13px]">
                        <div @click="keyboardClick('A')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">A</div>
                        </div>
                        <div @click="keyboardClick('S')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">S</div>
                        </div>
                        <div @click="keyboardClick('D')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">D</div>
                        </div>
                        <div @click="keyboardClick('F')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">F</div>
                        </div>
                        <div @click="keyboardClick('G')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">G</div>
                        </div>
                        <div @click="keyboardClick('H')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px]">H</div>
                        </div>
                        <div @click="keyboardClick('J')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">J</div>
                        </div>
                        <div @click="keyboardClick('K')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-norma">K</div>
                        </div>
                        <div @click="keyboardClick('L')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center  rounded-[10.947px] text-[52.544px] font-normal">L</div>
                        </div>
                    </div>

                    <div class="px-[70.55px]  mt-[25px] flex justify-between gap-[13px]">
                        <div @click="keyboardClick('Z')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">Z</div>
                        </div>
                        <div @click="keyboardClick('X')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">X</div>
                        </div>
                        <div @click="keyboardClick('C')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">C</div>
                        </div>
                        <div @click="keyboardClick('V')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">V</div>
                        </div>
                        <div @click="keyboardClick('B')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">B</div>
                        </div>
                        <div @click="keyboardClick('N')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">N</div>
                        </div>
                        <div @click="keyboardClick('M')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">M</div>
                        </div>
                        <div
                          @touchstart="keyDownDeleteLetter"
                          @touchend="keyUpDeleteLetter"
                          @touchmove.prevent=""
                          class="bg-[#fff] flex items-center justify-center  w-[106px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30"
                        >
                            <img class=" pointer-events-none" src="../../../assets/images/completed/clear.png">
                        </div>
                    </div>

                    <div class="px-[30px] mt-[25px] flex justify-center gap-[13px]">
                        <div @click="keyboardClick('-')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class="text-center h-full pt-[4px] rounded-[10.947px] text-[50px] font-normal">-</div>
                        </div>
                        <div @click="keyboardClick('_')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[50px] font-normal">_</div>
                        </div>
                        <div @click="keyboardClick('@')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[50px] font-normal">@</div>
                        </div>
                        <div @click="keyboardClick(' ')" class="bg-[#fff] w-[280px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">Space</div>
                        </div>
                        <div @click="keyboardClick('.')" class="bg-[#fff] w-[67.869px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] text-[52.544px] font-normal">.</div>
                        </div>
                        <div @click="updatingValue" class="bg-[#fff] flex items-center justify-center  w-[106px] rounded-[10.947px] border-[1px] border-[#858585] border-b-[2.189333200454712px] shadow ring-offset-black ring-opacity-30">
                            <div class=" text-center rounded-[10.947px] px-[16.5px] text-[52.544px] font-normal">OK</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
</Teleport>
</template>