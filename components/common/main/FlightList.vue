<template>
    <div class="mt-6">
      <!-- کنترل‌های مرتب‌سازی -->
      <div class="flex flex-wrap items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <label for="sortField" class="text-sm text-gray-700">مرتب‌سازی بر اساس:</label>
          <select v-model="sortField" id="sortField" class="border rounded px-2 py-1 text-sm">
            <option value="airline">ایرلاین</option>
            <option value="date">تاریخ</option>
            <option value="price">قیمت</option>
          </select>
        </div>
        <div class="flex items-center space-x-2">
          <label for="sortOrder" class="text-sm text-gray-700">ترتیب:</label>
          <select v-model="sortOrder" id="sortOrder" class="border rounded px-2 py-1 text-sm">
            <option value="asc">صعودی</option>
            <option value="desc">نزولی</option>
          </select>
        </div>
      </div>
  
      <!-- لیست پروازها -->
      <div v-if="sortedFlights.length > 0" class="space-y-4">
        <div
          v-for="flight in sortedFlights"
          :key="flight.id"
          class="p-4 border rounded shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-lg font-semibold text-gray-800">{{ flight.airline }}</p>
            <p class="text-sm text-gray-600">
              {{ flight.origin }} → {{ flight.destination }}
            </p>
            <p class="text-sm text-gray-600">
              تاریخ: {{ formatDate(flight.date) }}
            </p>
          </div>
          <div class="mt-2 sm:mt-0 text-right">
            <p class="text-xl font-bold text-green-600">{{ flight.price.toLocaleString() }} تومان</p>
          </div>
        </div>
      </div>
  
      <!-- پیام عدم وجود داده -->
      <div v-else class="text-center text-gray-500 mt-8">
        <p>پروازی برای نمایش یافت نشد.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref, watch } from 'vue';
//   import { useI18n } from 'vue-i18n';
  
  const props = defineProps({
    flights: {
      type: Array,
      default: () => [],
    },
  });
  
  const sortField = ref('date');
  const sortOrder = ref('asc');
  
  const sortedFlights = computed(() => {
    return [...props.flights].sort((a, b) => {
      let fieldA = a[sortField.value];
      let fieldB = b[sortField.value];
  
      // در صورت نیاز، تبدیل مقادیر به فرمت مناسب برای مقایسه
      if (sortField.value === 'date') {
        fieldA = new Date(fieldA);
        fieldB = new Date(fieldB);
      } else if (sortField.value === 'price') {
        fieldA = Number(fieldA);
        fieldB = Number(fieldB);
      } else {
        fieldA = fieldA.toString().toLowerCase();
        fieldB = fieldB.toString().toLowerCase();
      }
  
      if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  });
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR');
  };
  </script>
  