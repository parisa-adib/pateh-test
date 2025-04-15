<script setup>
import {ref} from "vue";
import {useAuthStore} from "~/stores/auth";
import LoginModal from "~/components/common/main/LoginModal.vue";
import VsIcon from "~/components/global/VsIcon.vue";

const { $toast } = useNuxtApp();

const authStore = useAuthStore();
const showLoginModal = ref(false);
const showProfileDropdown = ref(false);

// Dark mode toggle logic
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  const html = document.documentElement;

  if (isDarkMode.value) {
    html.classList.add("dark"); // Enable dark mode
    localStorage.setItem("theme", "dark"); // Save preference
  } else {
    html.classList.remove("dark"); // Disable dark mode
    localStorage.setItem("theme", "light"); // Save preference
  }
};

// Load theme preference on page load
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  }
});

const logout = () => {
	authStore.logout();
	showProfileDropdown.value = false;
	$toast.success("با موفقیت خارج شدید");
};
</script>
<template>
	<nav class="flex items-center justify-between p-4 bg-white shadow-md dark:bg-gray-700">
		<div class="">
			<NuxtLink to="/">
				<img src="/images/Powered-pateh_web.webp" alt="Logo" class="h-10 w-auto" />
			</NuxtLink>
		</div>
		<div class="flex items-center gap-2 space-x-4">
			<button
        @click="toggleDarkMode"
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label="Toggle Dark Mode"
      >
        <span v-if="isDarkMode" class="text-yellow-400">☀️</span>
        <span v-else class="text-gray-800">🌙</span>
      </button>
			<button
				v-if="!authStore.token"
				@click="showLoginModal = true"
				class="text-blue-600 hover:text-blue-800"
				aria-label="ورود"
			>
			<VsIcon
   			  iconName="Login"
   			   type="linear"
   			    color="#3b82f6"
   			    size="24"
   			  />
			</button>
			<div v-else class="relative">
        <button
          @click="showProfileDropdown = !showProfileDropdown"
          class="text-gray-600 hover:text-gray-800 flex items-center"
          aria-label="پروفایل"
        >
          <VsIcon iconName="Profile" type="bold" color="#EB6F24" size="24" />
        </button>
        <div
          v-if="showProfileDropdown"
          class="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-700 dark:border-gray-600"
        >
          <div class="p-4 text-gray-800 flex justify-between items-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">شماره موبایل:</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ authStore.mobile || "نامشخص" }}</p>
          </div>
          <button
            @click="logout"
            class="w-full p-4 text-left text-red-600 flex justify-end"
          >
            <VsIcon iconName="Logout" type="linear" color="#ef4444" size="20" class="inline-block mr-2" />
                    </button>
        </div>
      </div>
		</div>

		<!-- پاپ‌آپ ورود -->
		<div v-if="showLoginModal" class="z-[11111]">
			<LoginModal @close="showLoginModal = false" />
		</div>
	</nav>
</template>


