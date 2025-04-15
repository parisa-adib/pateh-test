// stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    mobile: localStorage.getItem("mobile") || null, // Load mobile from localStorage
    token: localStorage.getItem("token") || null, // Load token from localStorage
	tokenExpiresAt: localStorage.getItem("token_expires_at") || null, // Load token expiration from localStorage
    logoutTimer: null, // Timer for automatic logout
  }),
  persist: true,
  getters: {
    isAuthenticated() {
      return this.token != null;
    },
    getMobile() {
      return this.mobile;
    },
  },
  actions: {
    setToken(payload,expiresAt) {
		this.token = payload;
		this.tokenExpiresAt = expiresAt;
  
		// Save token and expiration time to localStorage
		localStorage.setItem("token", payload);
		localStorage.setItem("token_expires_at", expiresAt);
  
		// Set up automatic logout
		this.setupLogoutTimer();
    },
    setMobile(payload) {
      this.mobile = payload;
      localStorage.setItem("mobile", payload); 
    },
    logout() {
      this.mobile = null;
      this.token = null;
	  this.tokenExpiresAt = null;

	 // Clear localStorage
      localStorage.removeItem("mobile"); 
      localStorage.removeItem("token"); 
	  localStorage.removeItem("token_expires_at");

	   // Clear the logout timer
	   if (this.logoutTimer) {
        clearTimeout(this.logoutTimer);
        this.logoutTimer = null;
      }
    },
	setupLogoutTimer() {
		if (this.tokenExpiresAt) {
		  const expiresIn = new Date(this.tokenExpiresAt).getTime() - Date.now();
  
		  if (expiresIn > 0) {
			// Clear any existing timer
			if (this.logoutTimer) {
			  clearTimeout(this.logoutTimer);
			}
  
			// Set a new timer to log out the user when the token expires
			this.logoutTimer = setTimeout(() => {
			  this.logout();
			  console.log("Token expired, user logged out automatically");
			}, expiresIn);
		  } else {
			// If the token is already expired, log out immediately
			this.logout();
		  }
		}
	  },
	//   initializeAuth() {
	// 	const token = localStorage.getItem("token");
	// 	const tokenExpiresAt = localStorage.getItem("token_expires_at");
	// 	const mobile = localStorage.getItem("mobile");
	  
	// 	if (token && tokenExpiresAt) {
	// 	  this.token = token;
	// 	  this.tokenExpiresAt = tokenExpiresAt;
	// 	  this.mobile = mobile;
	  
	// 	  // Set up the logout timer
	// 	  this.setupLogoutTimer();
	// 	}
	//   },
  },
});
