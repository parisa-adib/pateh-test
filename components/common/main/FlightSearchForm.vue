<template>
	<LoginModal v-if="showLoginModal" />
	<form @submit.prevent="handleSubmit(onSubmit)" class="p-4 space-y-4">
		<!-- فیلد مبدا -->
		<div>
			<label for="origin" class="block mb-1">مبدا</label>
			<Field name="origin" v-slot="{field}">
				<SelectBox
					v-bind="field"
					:options="cities"
					:onSearch="searchCities"
					placeholder="شهر مورد نظر را انتخاب کنید"
				/>
			</Field>
			<ErrorMessage name="origin" class="text-red-500 text-sm" />
		</div>

		<!-- فیلد مقصد -->
		<div>
			<label for="destination" class="block mb-1">مقصد</label>
			<Field name="destination" v-slot="{field}">
				<SelectBox
					v-bind="field"
					:options="cities"
					:onSearch="searchCities"
					placeholder="شهر مورد نظر را انتخاب کنید"
				/>
			</Field>
			<ErrorMessage name="destination" class="text-red-500 text-sm" />
		</div>

		<!-- فیلد تاریخ پرواز -->
		<div>
			<label for="departureDate" class="block mb-1">تاریخ پرواز</label>
			<Field name="departureDate" v-slot="{field}">
				<ClientOnly>
					<!-- <DatePicker
						v-bind="field"
						:min="today"
						format="YYYY-MM-DD"
						display-format="jYYYY-jMM-jDD"
						placeholder="تاریخ را انتخاب کنید"
						class="w-full border p-2 rounded"
					/> -->
					<PersianDatePicker
						class="w-full p-2 rounded"
						v-bind="field"
						:min="today"
						format="YYYY-MM-DD"
						display-format="jYYYY-jMM-jDD"
						locale="locale"
					/>
				</ClientOnly>
			</Field>
			<ErrorMessage name="departureDate" class="text-red-500 text-sm" />
		</div>

		<!-- فیلد تعداد مسافر -->
		<div>
			<label for="passengers" class="block mb-1">تعداد مسافر</label>
			<Field
				name="passengers"
				as="input"
				type="number"
				min="1"
				class="w-full border p-2 rounded"
			/>
			<ErrorMessage name="passengers" class="text-red-500 text-sm" />
		</div>

		<!-- دکمه جستجو -->
		<button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">
			جستجو
		</button>
	</form>
</template>

<script setup>
import {useForm, Field, ErrorMessage} from "vee-validate";
import * as yup from "yup";
import moment from "moment-jalaali";
import SelectBox from "./SelectBox.vue";
import {useAuthStore} from "~/stores/auth";
import LoginModal from "~/components/common/main/LoginModal.vue";

const today = moment().format("YYYY-MM-DD");
const cities = ref([]);
const authStore = useAuthStore();
const showLoginModal = ref(false);
const schema = yup.object({
	origin: yup.string().required("لطفاً مبدا را انتخاب کنید"),
	destination: yup.string().required("لطفاً مقصد را انتخاب کنید"),
	departureDate: yup.string().required("لطفاً تاریخ پرواز را انتخاب کنید"),
	passengers: yup
		.number()
		.min(1, "حداقل یک مسافر")
		.required("لطفاً تعداد مسافر را وارد کنید"),
});

const {handleSubmit} = useForm({
	validationSchema: schema,
});
onMounted(() => {
	getCities();
});
const getCities = async () => {
	try {
		const response = await fetch(
			"https://api.pateh.com/region/api/region/flight-domestic/search"
		);
		const result = await response.json();
		if (response?.status == 200) {
			console.log(result);
			return (cities.value = result.data.map((item) => ({
				id: item.id,
				label: item.city.name_fa,
				label_en: item.city.name_en,
				code: item.code,
				city: item.city,
			})));
		}
	} catch (err) {
		console.error("خطا در دریافت داده‌ها:", err);
	}
};
const searchCities = async (query) => {
	try {
		const response = await fetch(
			`https://api.pateh.com/region/api/region/flight-domestic/search?search=${encodeURIComponent(
				query
			)}`
		);
		const data = await response.json();
		return data.map((city) => ({id: city.id, label: city.name}));
	} catch (error) {
		console.error("خطا در دریافت داده‌ها:", error);
		return [];
	}
};

const onSubmit = (values) => {
	if (!authStore.token) {
		showLoginModal.value = true;
		return;
	}
	const params = new URLSearchParams(values).toString();
	fetch(
		`https://api.pateh.com/gateway/api/bridge/flight/search-foreign?${params}`
	)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("خطا در دریافت اطلاعات:", error);
		});
};
</script>
