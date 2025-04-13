<template>
    <div class="select-box">
      <div @click="toggleDropdown" class="select-box-header">
        <span>{{ selectedOption ? selectedOption.label : 'انتخاب کنید' }}</span>
        <span class="arrow text-[#EB6F24]">{{ isOpen ? '▲' : '▼' }}</span>
      </div>
      <input
        v-if="isOpen"
        type="text"
        v-model="searchTerm"
        placeholder="جستجو..."
        class="search-input"
      />
      <div v-if="isOpen" class="options">
        <div
          v-for="option in filteredOptions"
          :key="option.id"
          class="option"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const options = ref([
    { label: "تهران", id: "THR" },
    { label: "مشهد", id: "MHD" }
  ]);
  const emit = defineEmits(["update"])
  const selectedOption = ref(null);
  const isOpen = ref(false);
  const searchTerm = ref('');
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  const filteredOptions = computed(() => {
    return options.value.filter(option =>
      option.label.includes(searchTerm.value)
    );
  });
  
  const selectOption = (option) => {
    selectedOption.value = option;
    emit("update",  selectedOption.value)
    searchTerm.value = '';
    isOpen.value = false;
  };
  </script>
  
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
    background: #fff !important;
    border-radius: 5px;
    font-size: 13px;
  }
  
  .search-input {
    width: 90%;
    padding: 5px;
    border: 1px solid #ccc;
   
  }
  
  .options {
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    position: absolute;
    width: 100%;
    background: white;
    z-index: 10;
  }
  
  .option {
    padding: 10px;
    cursor: pointer;
  }
  
  .option:hover {
    background-color: #f0f0f0;
  }
  </style>
  