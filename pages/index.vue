<script setup>
/**
 * Index page for search tickets
 */

import Navbar from "~/components/layout/Navbar.vue";
import FlightSearchForm from "~/components/common/main/FlightSearchForm.vue";
import FlightList from "~/components/common/main/FlightList.vue";

</script>
<template>
	<div>
		<Navbar />
		<div class="max-w-md lg:max-w-lg mx-auto mt-10">
			<FlightSearchForm />
			<FlightList />
		</div>
	</div>
</template>
