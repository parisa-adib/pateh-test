<script setup>
/**
 * Index page for search tickets
 */

import FlightSearchForm from "~/components/common/main/FlightSearchForm.vue";
import Navbar from "~/components/global/Navbar.vue";
</script>
<template>
	<div>
		<Navbar />
		<div class="max-w-md mx-auto mt-10">
			<FlightSearchForm />
		</div>
	</div>
</template>
