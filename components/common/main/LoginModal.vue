<script setup>
import {ref} from "vue";
import VOtpInput from "vue3-otp-input";
import {useAuthStore} from "~/stores/auth";
import axios from "axios";
import {Icon} from "@iconify/vue";

const emit = defineEmits("close");
const visible = ref(true);
const mobile = ref("");
const otp = ref("");
const showOtp = ref(false);
const authStore = useAuthStore();
const loading = ref(false);

const sendMobile = async () => {
	loading.value = true;
	const {data, error} = await useFetch("/api/auth/login", {
		method: "POST",
		body: {mobile: mobile.value},
	});
	if (error.value) {
		// مدیریت خطا
		loading.value = false;

		return;
	}

	if (data.value.success) {
		showOtp.value = true;
		loading.value = false;
	}
};

const verifyOtp = async () => {
	loading.value = true;
	const response = await axios.post(
		"https://api.pateh.com/ath/auth/validate-otp",
		{mobile: mobile.value, otp: Number(otp.value)}
	);

	authStore.setToken(response.data.data.token);
	authStore.setMobile(response.data.data.mobile);
	authStore.setIsAuth;
	loading.value = false;
	closeModal();
};

const closeModal = () => {
	visible.value = false;
	emit("close");
};
</script>
<template>
	<div
		v-if="visible"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
	>
		<div class="bg-white p-6 rounded shadow w-80 relative">
			<button
				@click="closeModal"
				class="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
			>
				<Icon icon="mdi:close" class="text-blue-500" />
			</button>
			<h2 class="text-xl mb-4">ورود</h2>
			<div v-if="showOtp == false">
				<input
					v-model="mobile"
					type="text"
					placeholder="شماره موبایل"
					class="border p-2 w-full mb-4"
				/>
				<button
					@click="sendMobile"
					class="bg-blue-500 text-white px-4 py-2 rounded w-full"
				>
					ارسال کد تایید
				</button>
			</div>
			<div v-else class="otp-box mx-auto mt-3">
				<v-otp-input
					v-model:value="otp"
					input-classes="otp-input"
					:is-disabled="loading"
					:num-inputs="6"
					separator="-"
					:should-auto-focus="true"
					input-type="letter-numeric"
					:conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
					:placeholder="['', '', '', '', '', '']"
					@onComplete="verifyOtp()"
				/>
				<button
					@click="verifyOtp"
					class="bg-[#EB6F24] text-white px-4 py-2 rounded w-full mt-3"
				>
					تایید کد
				</button>
			</div>
		</div>
	</div>
</template>
