import { defineStore } from "pinia";
import departureCodes from "../config/departureCodes";
import Features from "../config/features";

const clientId = document.querySelector('[name=clientId]').content;
const website = document.querySelector('[name=website]').content;
const departureCodeLS = localStorage.getItem('departureCode');

export const useStore = defineStore('Store', {
  state: () => {
    return {
      token: localStorage.getItem('access_token') || null,
      routingFromAds: false, // to check routing is from ads or no (routing to schedule page)
      isInsurance: false,
      departureCode: null, //General Departure Code
      departureCodeFromLS: departureCodes[clientId][departureCodeLS], //Departure Code with localStorage as identifier. Use for boarding Page
      isReset: false,
      isRouteToIdle: false, //state for button home when clicked on payment route
      clientId,
      features: Features[clientId] ?? null,
      website,
      selectedNavbar: 'reservation'
    }
  },
  actions: {
    getToken() {
      return localStorage.getItem('access_token')
    }
  }
});