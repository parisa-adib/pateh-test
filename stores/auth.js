import {defineStore} from "pinia";
import {ref} from "vue";

export const useAuthStore = defineStore("auth", () => {
	const user = ref(null);
	const token = ref(null);

	const setUser = (userData) => {
		user.value = userData;
	};

	const setToken = (jwt) => {
		token.value = jwt;
		localStorage.setItem("token", jwt);
	};

	const logout = () => {
		user.value = null;
		token.value = null;
		localStorage.removeItem("token");
	};

	return {user, token, setUser, setToken, logout};
});
