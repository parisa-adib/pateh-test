<script setup>
import {computed, ref, watch} from "vue";
import FlightCard from "./FlightCard.vue";
import {useFlightStore} from "~/stores/flight";
import VsIcon from "~/components/global/VsIcon.vue";

const flightStore = useFlightStore();
const selectedTimeSlot = ref("");
const selectedCabinType = ref("");

const filteredFlights = computed(() => {
	return flightStore.flights.filter((flight) => {
		const departSegment = flight.depart?.[0];
		if (!departSegment) return false;

		// Cabin type filter
		if (
			selectedCabinType.value &&
			departSegment.cabin_type !== selectedCabinType.value
		) {
			return false;
		}

		// Flight time filter
		if (selectedTimeSlot.value) {
			const flightTime = new Date(departSegment.flight_datetime);
			const hour = flightTime.getHours();
			const minute = flightTime.getMinutes();

			const timeInMinutes = hour * 60 + minute;

			const timeSlots = {
				midnight: [0, 299], // 00:00 - 04:59
				morning: [300, 719], // 05:00 - 11:59
				afternoon: [720, 1079], // 12:00 - 17:59
				evening: [1080, 1439], // 18:00 - 23:59
			};

			const [start, end] = timeSlots[selectedTimeSlot.value];
			if (timeInMinutes < start || timeInMinutes > end) {
				return false;
			}
		}

		return true;
	});
});

const removefilters = () => {
	selectedTimeSlot.value = "";
	selectedCabinType.value = "";
};
</script>

<template>
	<div class="mt-2 p-4">
		<!-- Filter controls-->
	<div class="grid grid-cols-5 gap-2 mb-5">
		<div class="col-span-2 flex flex-col items-start justify-center">
			
			<label class="text-sm text-gray-700 dark:text-gray-200 mb-1">زمان پرواز</label>
			<select
				v-model="selectedTimeSlot"
				class="border border-[#ccc] rounded p-[2px] text-sm w-full dark:bg-gray-700 dark:text-white dark:border-gray-700"
		
			>
				<option value="midnight">بامداد (00:00 - 04:59)</option>
				<option value="morning">صبح (05:00 - 11:59)</option>
				<option value="afternoon">بعد از ظهر (12:00 - 17:59)</option>
				<option value="evening">شب (18:00 - 23:59)</option>
			</select>
		</div>

		<!-- Cabin type filter -->
		<div class="col-span-2 flex flex-col items-start justify-center">
			<label class="text-sm text-gray-700 mb-1 dark:text-gray-200">کلاس پرواز</label>
			<select
				v-model="selectedCabinType"
				class="border border-[#ccc] rounded p-[2px] text-sm w-full dark:bg-gray-700 dark:text-white dark:border-gray-700"
			>
				<option value="ECONOMY">ECONOMY</option>
				<option value="BUSINESS">BUSINESS</option>
			</select>
		</div>
		<div class="col-span-1 flex items-end justify-center">
			<button
			class="p-2 !rounded-md flex justify-center items-center bg-[#EB6F24] text-white"
			@click="removefilters"
		>
		<VsIcon
     iconName="Trash"
      type="bold"
       color="#fff"
       size="15"
     />
			<span class="mt-1 text-xs mr-1">حذف </span>
		</button>
		</div>
	</div>
		<!-- Flights list -->
		<div v-if="filteredFlights.length > 0" class="space-y-4">
			<div
				v-for="flight in filteredFlights"
				:key="flight.id"
				class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
			>
				<FlightCard :flight="flight" />
			</div>
		</div>

		<!-- Empty message -->
		<div v-else class="text-center text-gray-500 mt-8">
			<p>پروازی برای نمایش یافت نشد.</p>
		</div>
	</div>
</template>
