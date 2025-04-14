<script setup>
import {computed, ref, watch} from "vue";
import FlightCard from "./FlightCard.vue";
import {useFlightStore} from "~/stores/flight";
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
</script>

<template>
	<div class="mt-6 p-4">
		<!--Filter controls-->
		<div class="flex items-center space-x-2">
			<label class="text-sm text-gray-700">زمان پرواز:</label>
			<select
				v-model="selectedTimeSlot"
				class="border rounded px-2 py-1 text-sm"
			>
				<option value="midnight">بامداد (00:00 - 04:59)</option>
				<option value="morning">صبح (05:00 - 11:59)</option>
				<option value="afternoon">بعد از ظهر (12:00 - 17:59)</option>
				<option value="evening">شب (18:00 - 23:59)</option>
			</select>
		</div>

		<!-- Cabin type filter -->
		<div class="flex items-center space-x-2">
			<label class="text-sm text-gray-700">کلاس پرواز:</label>
			<select
				v-model="selectedCabinType"
				class="border rounded px-2 py-1 text-sm"
			>
				<option value="ECONOMY">اکونومی</option>
				<option value="BUSINESS">بیزینس</option>
			</select>
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
