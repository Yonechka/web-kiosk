import { defineStore } from "pinia";
import ApiCall from '@/services/ApiCall';
import { useStore } from "./Store";

export const useMemberStore = defineStore('memberStore', {
  state: () => {
    return {
      memberTypes: {
        data: null,
        error: null
      },
      memberDetail: {
        data: null,
        error: null
      },
      memberRegister: {
        data: null,
        error: null
      }
    }
  },
  getters: {
    token: () => {
      const store = useStore();
      return store.token
    }
  },
  actions: {
    async getMemberDetail(params) {
      try {
        const result = await ApiCall({ action: 'memberDetail', token: this.token, params });
        console.log('memberDetailResult', result);

        if (result.status != 'OK') {
          this.memberDetail.error = result?.message;
          return false;
        }

        if (!result?.data.name) {
          this.memberDetail.error = 'Nomor HP tidak terdaftar'
          return false;
        }

        this.memberDetail.data = result?.data;
        return true;
      } catch (error) {
        this.memberDetail.error = error?.msg;
        return false;
      }
      
    },

    async getMemberTypes() {
      try {
        const result = await ApiCall({ action: 'memberType', token: this.token });

        if (result.status != 'OK') {
          this.memberTypes.error = result?.message;
          return false;
        }

        this.memberTypes.data = result?.data;
        return true;
      } catch (error) {
        this.memberTypes.error = error?.msg ?? 'error occured';
        return false;
      }
    },

    async postMemberRegister({ params }) {
      try {
        const result = await ApiCall({ action: 'memberRegister', token: this.token, params });

        if (result.status != 'OK') {
          this.memberRegister.error = result?.data?.message;
          return false;
        }

        this.memberRegister.data = result?.data;
        return true;
      } catch (error) {
        this.memberRegister.error = error?.msg ?? 'error occured';
        return false;
      }
    }
  }
});