import { ref, computed } from "vue";
import { useMemberStore } from "@/store/MemberStore";

const useCheckMember = (router) => {
  const memberStore = useMemberStore();

  const phoneNumb = ref(null);
  const isKeyboardShow = ref(false);

  const placeHolderForm = 'No Telepon 08xxxx';
  const dynamicClassInput = computed(() => {
    return phoneNumb.value ? 'text-xl text-[#1F2937] font-medium' : 'text-[#71747D] text-xl';
  });
  

  const updatePhoneNumbField = (newValue) => {
    phoneNumb.value = newValue;
    isKeyboardShow.value = false;
  }
  const onClickSubmitHandler = async () => {
    if (!phoneNumb.value || phoneNumb.value == '') return;

    const result = await memberStore.getMemberDetail({ phoneNumb: phoneNumb.value });

    if (result) router.push({ name: 'memberDetail' });
  }

  return {
    phoneNumb,
    isKeyboardShow,
    placeHolderForm,
    dynamicClassInput,
    updatePhoneNumbField,
    onClickSubmitHandler
  }
};

export default useCheckMember;