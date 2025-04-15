<script setup>
import {ref, computed, watch, onMounted, onBeforeUnmount} from "vue";

/**
 * @typedef {Object} Option
 * @property {string} id - شناسه یکتا
 * @property {string} label - عنوان نمایشی
 */

/**
 * @typedef {Object} Props
 * @property {Option[]} options - لیست اولیه گزینه‌ها
 * @property {string} modelValue - مقدار انتخاب‌شده
 * @property {string} placeholder - متن پیش‌فرض
 * @property {function(string): Promise<Option[]>} onSearch - تابع جستجو در API
 */

 const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
  placeholder: {
    type: String,
    default: "انتخاب کنید",
  },
  onSearch: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedOption = ref(null);
const isOpen = ref(false);
const searchTerm = ref("");
const isLoading = ref(false);
const internalOptions = ref([...props.options]);
const selectBoxRef = ref(null);

// Toggle the dropdown visibility
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Filter options based on search term
const filteredOptions = computed(() => {
  if (!searchTerm.value) {
    return internalOptions.value;
  }
  return internalOptions.value.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Handle selection of an option
const selectOption = (option) => {
  selectedOption.value = option;
  emit("update:modelValue", option.code);
  searchTerm.value = "";
  isOpen.value = false;
};

// Watch for changes in options prop
watch(() => props.options, (newVal) => {
  if (newVal) {
    internalOptions.value = [...newVal];
  }
});
// Watch for changes in modelValue to update selectedOption
watch(
  () => props.modelValue,
  (newVal) => {
    selectedOption.value = internalOptions.value.find(
      (opt) => opt.code === newVal
    ) || null;
  },
  { immediate: true }
);

// Search when searchTerm changes
watch(searchTerm, async (newTerm) => {
  if (!newTerm) {
    internalOptions.value = [...props.options];
    return;
  }
  isLoading.value = true;
  try {
    const results = await props.onSearch(newTerm);
    internalOptions.value = results;
  } catch (error) {
    console.error("خطا در جستجو:", error);
    internalOptions.value = [];
  } finally {
    isLoading.value = false;
  }
});

// Close dropdown when clicked outside
const handleClickOutside = (event) => {
  if (selectBoxRef.value && !selectBoxRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
	<div class="select-box" ref="selectBoxRef">
	  <div @click="toggleDropdown" class="select-box-header">
		<span>{{ selectedOption ? selectedOption.label : placeholder }}</span>
		<span class="arrow text-[#EB6F24]">{{ isOpen ? "▲" : "▼" }}</span>
	  </div>
	  <div v-if="isOpen" class="dropdown">
		<input
		  type="text"
		  v-model="searchTerm"
		  placeholder="جستجو..."
		  class="search-input mx-auto overflow-hidden w-full"
		/>
		<div v-if="isLoading" class="loading">در حال بارگذاری...</div>
		<div v-else-if="filteredOptions.length === 0" class="no-options">
		  موردی یافت نشد
		</div>
		<div v-else class="options">
		  <div
			v-for="option in filteredOptions"
			:key="option.id"
			class="option"
			@click="selectOption(option)"
		  >
			<span class="fa">{{ option.label }}</span>
			<span class="en">{{ option.label_en }}</span>
		  </div>
		</div>
	  </div>
	</div>
  </template>

<style scoped>
.select-box {
	position: relative;
	width: 100%;
}

.select-box-header {
	padding: 6px;
	border: 1px solid #ccc;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border-radius: 5px;
	font-size: 13px;
}
.dark .select-box-header {
	background: #2d3748;
	color: #fff;
	border-color: #4a5568;
}
.dropdown {
	position: absolute;
	width: 100%;
	background: white;
	border: 1px solid #ccc;
	z-index: 10;
}

.dark .dropdown {
	background: #2d3748;
	border-color: #4a5568;
}
.search-input {
	padding: 5px;
	border: 1px solid #ccc;
}
.dark .search-input {
	background: #2d3748;
	color: #fff;
	border-color: #4a5568;
}
.options {
	max-height: 150px;
	overflow-y: auto;
}

.option {
	display: flex;
	justify-content: space-between;
	padding: 10px;
	cursor: pointer;
}

.option:hover {
	background-color: #f0f0f0;
}
.dark .option:hover {
	background-color: #4a5568;
	color: #fff;
}
.loading,
.no-options {
	padding: 10px;
	text-align: center;
	color: #888;
}
.fa {
	direction: rtl;
	text-align: right;
	flex: 1;
}

.en {
	direction: ltr;
	text-align: left;
	flex: 1;
	color: #888;
	font-size: 12px;
}
</style>
