<script setup>
import {ref} from "vue";
import VOtpInput from "vue3-otp-input";
import {useAuthStore} from "~/stores/auth";
import VsIcon from "~/components/global/VsIcon.vue";
import {useForm, useField} from "vee-validate";
import * as yup from "yup";

const { $toast } = useNuxtApp(); 
const emit = defineEmits("close");
const visible = ref(true);
const showOtp = ref(false);
const authStore = useAuthStore();
const loading = ref(false);

const schema = yup.object({
	mobile: yup.string().required("لطفاً شماره موبایل را وارد کنید").max(11, "شماره موبایل باید 11 رقم باشد").min(11, "شماره موبایل باید 11 رقم باشد"),
		
});

const {errors} = useForm({validationSchema: schema});

const {value: mobile} = useField("mobile");
const {value: otp} = useField("otp");

const sendMobile = async () => {
	loading.value = true;
	try{
		const {data, error} = await useFetch("/api/auth/login", {
		method: "POST",
		body: {mobile: mobile.value},
	});
	if (error.value) {
		$toast.error(error.value.data.message);
		loading.value = false;
		return;
	}

	if (data.value.success) {
		$toast.success("کد تایید ارسال شد!"); 
		showOtp.value = true;
		loading.value = false;
	}
	} catch (err) {
		console.error("Unexpected error:", err);
	} finally {
		loading.value = false;
	}
	
};

const verifyOtp = async (values) => {
  loading.value = true;
  try {
    const { data, error } = await useFetch("/api/auth/verify", {
      method: "POST",
      body: { mobile: mobile.value, otp: Number(otp.value) },
    });

    if (error.value) {
 		$toast.error(error.value.data.message);
      loading.value = false;
      return;
    }

    const { token, mobile: userMobile, token_expires_at } = data.value.data;

    // Save token, mobile, and expiration time in the store
    authStore.setToken(token, token_expires_at);
    authStore.setMobile(userMobile);

	$toast.success("خوش آمدید!"); 
    closeModal();
  } catch (err) {
    console.error("Unexpected error:", err);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
	visible.value = false;
	emit("close");
};

const checkError = () => {
	const errorValues = errors.value;
  if (Object.keys(errorValues).length > 0) {
	$toast.warning("لطفا فیلدهای الزامی را پر کنید!");
	return false;
  } else {
    sendMobile();
	return true;

	}
 
};
</script>
<template>
	<div
		v-if="visible"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[11111]"
	>
		<div class="bg-white dark:bg-gray-600 p-6 rounded shadow w-80 relative">
			<button
				@click="closeModal"
				class="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
			>
							<VsIcon
     iconName="CloseCircle"
	   type="linear"
	   color="#3b82f6"
	   size="24"
          />
			</button>
			<h2 class="text-xl text-black dark:text-white mb-4">ورود</h2>
			<div v-if="showOtp == false">
				<input
					v-model="mobile"
					type="text"
					placeholder="شماره موبایل"
					class="border p-2 w-full dark:bg-gray-700 dark:text-white dark:border-gray-700 rounded mb-2"
				/>
				<span v-if="errors.mobile" class="text-red-500 dark:text-red-200 text-xs pr-1">{{ errors.mobile }}</span>
				<button
					@click="checkError"
					class="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2"
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
				<i v-if="loading" class="pi pi-spin pi-spinner ml-1"></i>
			<span v-if="!loading">تایید کد</span>
			<span v-else class="text-xs">منتظر بمانید...</span>
					
				</button>
			</div>
		</div>
	</div>
</template>
