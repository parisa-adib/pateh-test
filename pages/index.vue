<script setup>
/**
 * Index page for search tickets
 */

import Navbar from "~/components/global/Navbar.vue";
import FlightSearchForm from "~/components/common/main/FlightSearchForm.vue";
import FlightList from "~/components/common/main/FlightList.vue";

const searchedFlights = ref();
const handleShowFlightList = (flightData) => {
	searchedFlights.value = flightData.data
}
</script>
<template>
	<div>
		<Navbar />
		<div class="max-w-md lg:max-w-lg mx-auto mt-10">
			<FlightSearchForm @show-flight-list="handleShowFlightList"/>
			<FlightList :flights="searchedFlights" />
		</div>
	</div>
</template>
