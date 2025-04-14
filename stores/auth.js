// stores/auth.js
import {defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		mobile: null,
		token: null,
		isAuth: false,
	}),
	actions: {
		setMobile(mobile) {
			this.mobile = mobile;
		},
		setToken(token) {
			this.token = token;
		},
		setIsAuth() {
			this.isAuth = true;
		},
		logout() {
			this.mobile = null;
			this.token = null;
			this.isAuth = false;
		},
	},
});
