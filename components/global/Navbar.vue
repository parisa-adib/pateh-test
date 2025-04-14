<template>
	<nav class="flex items-center justify-between p-4 bg-white shadow-md">
		<!-- سمت راست: لوگو -->
		<div class="text-xl font-bold text-gray-800">
			<NuxtLink to="/">لوگو</NuxtLink>
		</div>

		<!-- سمت چپ: دکمه ورود یا خروج -->
		<div>
			<button
				v-if="!authStore.token"
				@click="showLoginModal = true"
				class="text-blue-600 hover:text-blue-800"
				aria-label="ورود"
			>
				ورود
				<!-- <Icon name="mdi:login" size="24" /> -->
			</button>
			<button
				v-else
				@click="logout"
				class="text-red-600 hover:text-red-800"
				aria-label="خروج"
			>
				خروج
				<!-- <Icon name="mdi:logout" size="24" /> -->
			</button>
		</div>

		<!-- پاپ‌آپ ورود -->
		<div v-if="showLoginModal" class="z-[11111]">
			<LoginModal @close="showLoginModal = false" />
		</div>
	</nav>
</template>

<script setup>
import {ref} from "vue";
import {useAuthStore} from "~/stores/auth";
import LoginModal from "~/components/common/main/LoginModal.vue";
import {Icon} from "@iconify/vue";

const authStore = useAuthStore();
const showLoginModal = ref(false);

const logout = () => {
	authStore.logout();
};
</script>
