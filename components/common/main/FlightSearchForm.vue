<script setup>
import {useForm, useField} from "vee-validate";
import * as yup from "yup";
import moment from "moment-jalaali";
import SelectBox from "./SelectBox.vue";
import {useAuthStore} from "~/stores/auth";
import LoginModal from "~/components/common/main/LoginModal.vue";
import {useFlightStore} from "~/stores/flight";
import VsIcon from "~/components/global/VsIcon.vue";

const { $toast } = useNuxtApp();
const flightStore = useFlightStore();

const emit = defineEmits(["show-flight-list"]);

const today = moment().format("YYYY-MM-DD");
const cities = ref([]);
const authStore = useAuthStore();
const loading = ref(false);
const showLoginModal = ref(false);
const flightType = ref("domestic");
const schema = yup.object({
	origin: yup.string().required("لطفاً مبدا را انتخاب کنید"),
	destination: yup.string().required("لطفاً مقصد را انتخاب کنید"),
	departureDate: yup.string().required("لطفاً تاریخ پرواز را انتخاب کنید"),
	passengers: yup
		.number()
		.min(1, "حداقل یک مسافر")
		.required("لطفاً تعداد مسافر را وارد کنید")
		.typeError("لطفاً تعداد مسافر را وارد کنید")
	,
});

const {handleSubmit, errors,resetForm} = useForm({validationSchema: schema});

const {value: origin} = useField("origin");
const {value: destination} = useField("destination");
const {value: passengers , setValue:setPassengerValue} = useField("passengers");
const {value: departureDate} = useField("departureDate");
setPassengerValue(1)
onMounted(() => {
	getCities();
});
const getCities = async () => {
	const baseUrl =
		flightType.value === "domestic"
			? "https://api.pateh.com/region/api/region/flight-domestic/search"
			: "https://api.pateh.com/region/api/region/flight-international/search";

	try {
		const response = await fetch(baseUrl);
		const result = await response.json();
		if (response?.status === 200) {
			cities.value = result.data.map((item) => ({
				id: item.id,
				label: item.city.name_fa,
				label_en: item.city.name_en,
				code: item.code,
				city: item.city,
			}));
		}
	} catch (err) {
		console.error("خطا در دریافت داده‌ها:", err);
	}
};

const searchCities = async (query) => {
	const baseUrl =
		flightType.value === "domestic"
			? "https://api.pateh.com/region/api/region/flight-domestic/search"
			: "https://api.pateh.com/region/api/region/flight-international/search";

	try {
		const response = await fetch(
			`${baseUrl}?search=${encodeURIComponent(query)}`
		);
		const data = await response.json();
		return data.data.map((city) => ({
			id: city.id,
			label: city.city.name_fa,
			label_en: city.city.name_en,
			code: city.code,
		}));
	} catch (error) {
		console.error("خطا در دریافت داده‌ها:", error);
		return [];
	}
};

const onSubmit = handleSubmit(async (values) => {
	loading.value = true;
	const queryParams = {
		ignore_paginate: true,
		ignore_duplicate: true,
		"origins[]": values.origin,
		"destinations[]": values.destination,
		"departure_dates[]": moment(values.departureDate, "YYYY-MM-DD").format(
			"jYYYY/jMM/jDD"
		),
		returning_date: "",
		adults_len: values.passengers,
		childs_len: 0,
		infants_len: 0,
	};

	await flightStore.searchFlights(queryParams);
	loading.value = false;
	
});


const checkError = () => {
	const isAuth = authStore.isAuthenticated
	if (!isAuth){
		showLoginModal.value = true;
		$toast.warning("لطفا ابتدا وارد حساب کاربری خود شوید!");
		return;
	}
	else{
		const errorValues = errors.value;
  if (Object.keys(errorValues).length > 0) {
	$toast.warning("لطفا فیلدهای الزامی را پر کنید!");
	return false;
  } else {
    onSubmit();
	return true;
  }
	}
 
};


watch(
	() => flightType.value,
	(newValue) => {
		resetForm();
		getCities();
		flightStore.setFlightType(newValue);
		flightStore.clearFlights(); 
	}
);
</script>

<template>
	<div v-if="showLoginModal">
		<LoginModal @close="showLoginModal = false" />
	</div>
	<div class="grid grid-cols-2 gap-4 space-x-4 mb-4">
		<button
			:class="
				flightType === 'domestic' ? 'bg-[#EB6F24] text-white' : 'bg-gray-200'
			"
			class="p-2 !rounded-md flex flex-col justify-center items-center"
			@click="flightType = 'domestic'"
		>
		<VsIcon
     iconName="Airplane"
      type="bold"
       color="#fff"
       size="24"
     />

			<span class="mt-1 text-sm">پرواز داخلی</span>
		</button>
		<button
			:class="
				flightType === 'international'
					? 'bg-[#EB6F24] text-white'
					: 'bg-gray-200'
			"
			class="p-2 !rounded-md flex flex-col justify-center items-center"
			@click="flightType = 'international'"
		>
		<VsIcon
     iconName="GlobalSearch"
      type="bold"
       color="#fff"
       size="24"
     />
			<span class="mt-1 text-sm">پرواز خارجی</span>
		</button>
	</div>
	<form @submit.prevent="checkError()" class="p-4 space-y-4">
		<div>
			<label for="origin" class="block mb-1 text-sm text-[#191919] dark:text-gray-200">مبدا</label>
			<SelectBox
				v-model:model-value="origin"
				:options="cities"
				:onSearch="searchCities"
				placeholder="شهر مورد نظر را انتخاب کنید"
			/>
			<span v-if="errors.origin" class="text-red-500 text-xs pr-1">{{ errors.origin }}</span>
		</div>

		<div>
			<label for="destination" class="block mb-1 text-sm text-[#191919] dark:text-gray-200"
				>مقصد</label
			>

			<SelectBox
				v-model:model-value="destination"
				:options="cities"
				:onSearch="searchCities"
				placeholder="شهر مورد نظر را انتخاب کنید"
			/>
			<span v-if="errors.destination" class="text-red-500 text-xs pr-1">{{ errors.destination }}</span>
		</div>

		<div>
			<label for="departureDate" class="block mb-2 text-sm text-[#191919] dark:text-gray-200"
				>تاریخ پرواز</label
			>

			<ClientOnly>
				<PersianDatePicker
					class="w-full rounded"
					v-model="departureDate"
					:min="today"
					format="YYYY-MM-DD"
					display-format="jYYYY/jMM/jDD"
					locale="fa"
				/>
				<span v-if="errors.departureDate" class="text-red-500 text-xs pr-1">{{
					errors.departureDate
				}}</span>
			</ClientOnly>
		</div>

		<div>
			<label for="passengers" class="block mb-1 text-sm text-[#191919] dark:text-gray-200"
				>تعداد مسافر</label
			>
			<input
				v-model="passengers"
				name="passengers"
				type="number"
				min="1"
				class="w-full border p-1 rounded border-[#ccc] dark:bg-gray-700 dark:text-white dark:border-[#4a5568]"
			/>
			<span v-if="errors.passengers" class="text-red-500 text-xs pr-1">{{ errors.passengers }}</span>
		</div>

		<button
			type="submit"
					class="w-full bg-blue-500 text-white p-2 rounded"
		>
			<i v-if="loading" class="pi pi-spin pi-spinner ml-1"></i>
			<span v-if="!loading">جستجو</span>
			<span v-else class="text-xs">منتظر بمانید...</span>
		</button>
	</form>
</template>
