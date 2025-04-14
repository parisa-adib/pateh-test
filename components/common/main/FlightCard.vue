<script setup>
import moment from "moment-jalaali";
import {Icon} from "@iconify/vue";

const {$formatNumber} = useNuxtApp();
const convertToJalali = (date) => {
	return moment(date).format("jYYYY/jMM/jDD HH:mm");
};
const props = defineProps({flight: {type: Object, required: true}});
</script>
<template>
	<div class="rounded-md bg-white px-5 py-3 shadow-sm mx-auto w-full">
		<div class="pt-2">
			<span class="text-sm text-[#191919]">پرواز رفت</span>
		</div>
		<div
			class="badge-container flex justify-start gap-3 my-3"
			v-if="props.flight.badges"
		>
			<span
				class="rounded-lg px-2 py-1 text-[10px] bg-[#e8f5e9] text-[#4caf50]"
				v-if="props.flight.badges.is_cheapest == true"
				>ارزانترین</span
			>
			<span class="rounded-lg px-2 py-1 text-[10px] bg-[#e3f2fd] text-[#315f7a]"
				>غیرقابل استرداد</span
			>
		</div>
		<div class="" v-for="(item, index) in props.flight.depart" :key="index">
			<div class="card-details grid grid-cols-4 gap-4 my-5">
				<div
					class="flex flex-col items-center justify-center"
					v-if="item.airline_info"
				>
					<img
						:src="item.airline_info.image"
						alt="airline"
						class="rounded-full w-[70%]"
					/>
					<span class="text-sm text-[#191919] mt-2">{{
						item.airline_info.name_fa
					}}</span>
				</div>
				<div class="flex flex-col items-center justify-center text-center">
					<span class="text-sm text-[#191919] mt-2">{{
						convertToJalali(item.flight_datetime)
					}}</span>
					<span class="text-sm text-[#191919] mt-2">{{
						item.origin_airport.city_name_fa
					}}</span>
				</div>
				<div class="flex flex-col items-center justify-center">
					<Icon icon="mdi:arrow-left" class="text-blue-500" />
				</div>
				<div class="flex flex-col items-center justify-center">
					<span class="text-sm text-[#191919] mt-2 text-center">{{
						convertToJalali(item.arrival_datetime)
					}}</span>
					<span class="text-sm text-[#191919] mt-2">{{
						item.destination_airport.city_name_fa
					}}</span>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4 border-t border-t-blue-200 py-3">
				<span class="text-red-500 text-xs">{{
					item.available_seat_quantity !== 0
						? item.available_seat_quantity + " صندلی باقیمانده "
						: "تکمیل ظرفیت"
				}}</span>
				<span class="text-left text-xs">{{
					"قیمت: " + $formatNumber(props.flight.finance.adult.fare)
				}}</span>
			</div>
		</div>
	</div>
</template>
