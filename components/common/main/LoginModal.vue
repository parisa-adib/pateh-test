<template>
	<div
		v-if="visible"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
		ref="modalRef"
	>
		<div class="bg-white p-6 rounded shadow">
			<h2 class="text-xl mb-4 text-center">ورود</h2>
			<label class="text-sm text-[#474747]">شماره موبایل خود را وارد کنید</label>
			<input
				v-model="mobile"
				type="text"
				placeholder="شماره موبایل"
				class="border border-[#474747] rounded p-2 w-full my-4"
			/>
			<div class="grid grid-cols-2 gap-4">
				<button class="bg-slate-300 text-white px-4 py-2 rounded">
		      انصراف          
			</button>
			<button @click="login" class="bg-blue-500 text-white px-4 py-2 rounded">
				<i v-if="loading" class="pi pi-spin pi-spinner ml-1"></i>
            	<span v-if="!loading">ورود</span>
            	<span v-else class="text-xs">صبر کنید...</span>
			</button>
		</div>
		</div>
	</div>
</template>

<script setup>
import {ref} from "vue";
import {useAuthStore} from "~/stores/auth";

const visible = ref(true);
const mobile = ref("");
const authStore = useAuthStore();
const modalRef = ref(null);
const loading = ref(false)
const login = async () => {
loading.value = true;
	try {
		const response = await fetch(
			"https://api.pateh.com/ath/auth/login-or-register",
			{
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({mobile: mobile.value}),
			}
		);
		const data = await response.json();
		authStore.setToken(data.token);
		authStore.setUser(data.user);
		visible.value = false;
	} catch (error) {
		console.error("خطا در ورود:", error);
	}
};

const handleClickOutside = (event) => {
	if (modalRef.value && !modalRef.value.contains(event.target)) {
		emit("close");
	}
};


onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
