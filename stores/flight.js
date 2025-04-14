import { defineStore } from 'pinia';

export const useFlightStore = defineStore('flight', {
  state: () => ({
    flights: [],
    loading: false,
    error: null,
  }),
  actions: {
    async searchFlights(params) {
      this.loading = true;
      this.error = null;
      try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`https://api.pateh.com/gateway/api/bridge/flight/search-foreign?${queryString}`);
        const result = await response.json();
        if (result.success) {
          this.flights = result.data;
        } else {
          this.error = 'خطا در دریافت نتایج پرواز';
        }
      } catch (err) {
        this.error = 'خطا در ارتباط با سرور';
      } finally {
        this.loading = false;
      }
    },
  },
});
