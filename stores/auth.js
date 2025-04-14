import {defineStore} from "pinia";

export const useAuthStore = defineStore('auth', {
	state: () => ({
	  token: null,
	  mobile: null,
	  user: null,
	  isRegister: null,
	}),
	getters: {
	  isAuthenticated() {
		return this.token != null;
	  },
	  getMobile() {
		return this.mobile;
	  },
	  getUser() {
		return this.user;
	  },
	  getIsRegister() {
		return this.isRegister;
	  },
	
	},
	actions: {
	  setToken(payload) {
		this.token = payload;
	  },
	  setMobile(payload) {
		this.mobile = payload;
	  },
	  setUser(payload) {
		this.user = payload;
	  },
	  setIsRegister(payload) {
		this.isRegister = payload;
	  },
	
	  logout() {
		this.token = null;
		this.mobile = null;
		this.user = null;
		this.isRegister = null;
		useRouter().push('/');
	  },
	},
	// persist: {
	//   storage: import.meta.client ? localStorage : undefined,
	//   pick: ['token', 'mobile', 'user', 'isRegister'],
	// },
  });
  
