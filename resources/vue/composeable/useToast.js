const useToast = () => {
  const showToast = ref(false);
  const toastMessage = ref('Error Occured');

  return { showToast, toastMessage }
}