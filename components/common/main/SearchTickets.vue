<script setup>
import DatePicker from "@/components/common/date-picker/DatePicker"
import SelectBox from "./SelectBox.vue";
import { useField,useForm } from "#imports";
const loading = ref(false);
const departureDate = ref("");
const returnDate = ref("");
const origin = ref("");
const destination = ref("")
const handledepartureDateChange = (date) => {
    if(date !== undefined){
           departureDate.value = date;
    }
}
const handleReturnDateChange = (date) => {
    if(date !== undefined){
           returnDate.value = date;
    }
}
const handleSelectedOrigin = (data) => {
  origin.value = data.id
}
const handleSelectedDestination = (data) => {
  destination.value = data.id
}
</script>
<template>
    <div class="mx-5 rounded-md !bg-slate-300 grid grid-cols-1 lg:grid-cols-6 md:grid-cols-2 gap-4 p-5 ">
    <div class="flex flex-col justify-start items-start overflow-hidden">
    <span :for="id" class="text-md text-right !pb-3">مبدا</span>
    <SelectBox @update="handleSelectedOrigin"/>
    </div>
    <div class="flex flex-col justify-start items-start overflow-hidden">
    <span :for="id" class="text-md text-right !pb-3">مقصد</span>
    <SelectBox @update="handleSelectedDestination"/>
    </div>
    <div class="flex flex-col justify-start items-start overflow-hidden">
    <span :for="departureDate" class="text-md text-right !pb-3">تاریخ رفت</span>
      <DatePicker @update-date="handledepartureDateChange" locale="fa" display-format:="jYYYY/jMM/jDD" format="YYYY-MM-DD" id="departureDate" />
    </div>
    <div class="flex flex-col justify-start items-start overflow-hidden">
    <span :for="returnDate" class="text-md text-right !pb-3">تاریخ برگشت</span>
      <DatePicker @update-date="handleReturnDateChange" locale="fa" display-format:="jYYYY/jMM/jDD" format="YYYY-MM-DD" id="returnDate" />
    </div>
    <div class="flex flex-col justify-start items-start overflow-hidden">
    <span :for="returnDate" class="text-md text-right !pb-3">تعداد مسافر</span>
    <input
        type="text"
        v-model="searchTerm"
        class="search-input rounded p-1"
      />
    </div>
</div>
</template>
