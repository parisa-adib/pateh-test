<script setup>
import {useForm, useField} from "vee-validate";
import * as yup from "yup";
import moment from "moment-jalaali";
import SelectBox from "./SelectBox.vue";
import {useAuthStore} from "~/stores/auth";
import LoginModal from "~/components/common/main/LoginModal.vue";
import {useFlightStore} from "~/stores/flight";

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
		.required("لطفاً تعداد مسافر را وارد کنید"),
});

const {handleSubmit, errors} = useForm({validationSchema: schema});

const {value: origin} = useField("origin");
const {value: destination} = useField("destination");
const {value: passengers} = useField("passengers");
const {value: departureDate} = useField("departureDate");

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
	// if (!authStore.isAuth) return;

	const isValid = await checkError();
	if (!isValid) return;

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
	// if (flightType.value === "domestic") {
	// 	await flightStore.searchFlights(queryParams);
	// 	loading.value = false;
	// } else if (flightType.value === "international") {
	// 	await searchInternationalFlights(queryParams);
	// 	loading.value = false;
	// }
});
const checkError = async () => {
	const errorValues = errors.value;
	if (Object.keys(errorValues).length > 0) {
		return false;
	}
	return true;
};

watch(
	() => flightType.value,
	(newValue) => {
		getCities();
	}
);
</script>

<template>
	<div v-if="showLoginModal" class="z-[11111]">
		<LoginModal @close="showLoginModal = false" />
	</div>
	<div class="flex space-x-4 mb-4">
		<button
			:class="
				flightType === 'domestic' ? 'bg-blue-500 text-white' : 'bg-gray-200'
			"
			@click="flightType = 'domestic'"
		>
			پرواز داخلی
		</button>
		<button
			:class="
				flightType === 'international'
					? 'bg-blue-500 text-white'
					: 'bg-gray-200'
			"
			@click="flightType = 'international'"
		>
			پرواز خارجی
		</button>
	</div>
	<form @submit.prevent="onSubmit" class="p-4 space-y-4">
		<div>
			<label for="origin" class="block mb-1 text-sm text-[#191919]">مبدا</label>
			<SelectBox
				v-model:model-value="origin"
				:options="cities"
				:onSearch="searchCities"
				placeholder="شهر مورد نظر را انتخاب کنید"
			/>
			<span class="text-red-500 text-xs pr-1">{{ errors.origin }}</span>
		</div>

		<div>
			<label for="destination" class="block mb-1 text-sm text-[#191919]"
				>مقصد</label
			>

			<SelectBox
				v-model:model-value="destination"
				:options="cities"
				:onSearch="searchCities"
				placeholder="شهر مورد نظر را انتخاب کنید"
			/>
			<span class="text-red-500 text-xs pr-1">{{ errors.destination }}</span>
		</div>

		<div>
			<label for="departureDate" class="block mb-2 text-sm text-[#191919]"
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
				<span class="text-red-500 text-xs pr-1">{{
					errors.departureDate
				}}</span>
			</ClientOnly>
		</div>

		<div>
			<label for="passengers" class="block mb-1 text-sm text-[#191919]"
				>تعداد مسافر</label
			>
			<input
				v-model="passengers"
				name="passengers"
				type="number"
				min="1"
				class="w-full border p-1 rounded border-[#ccc]"
			/>
			<span class="text-red-500 text-xs pr-1">{{ errors.passengers }}</span>
		</div>

		<button
			type="submit"
			@click="onSubmit"
			class="w-full bg-blue-500 text-white p-2 rounded"
		>
			<i v-if="loading" class="pi pi-spin pi-spinner ml-1"></i>
			<span v-if="!loading">جستجو</span>
			<span v-else class="text-xs">صبر کنید...</span>
		</button>
	</form>
</template>
