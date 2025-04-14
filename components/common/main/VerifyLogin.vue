<script setup>
import VOtpInput from "vue3-otp-input";
const AUTHSTORE = useAuthStore()
const loading = ref(false);
const code = ref();
const emit = defineEmits(["success-login"])
const send = async () => {
  loading.value = true;
  try{
    const payload = {
    code: code.value,
    mobile: MAINSTORE.getMobile,
  };
  const response = await fetch("https://api.pateh.com/ath/auth/validate-otp", {
    method: "POST",
    body: payload,
  
  });
  if (response?.status == "success") {
    accessToken.value = response?.data?.access_token;

  console.log("با موفقیت وارد شدید!")
   
  }
  emit("success-login");

  loading.value = false;
  } catch(err){
    console.log(err)
  } finally {
    loading.value = false
  }
   

};


</script>
<template>
    <div class="mt-1 mx-7">
      <p class="text-base font-semibold text-[#191919]">کد تایید</p>
      <p class="text-xs font-semibold mt-6 text-[#474747]">
        کد ارسال شده به شماره
        <span>{{ MAINSTORE.getMobile }}</span>
        را وارد نمایید.
      </p>
      <div class="otp-box max-w-[65%] mx-auto mt-3">
        <v-otp-input
          v-model:value="code"
          input-classes="otp-input"
          :is-disabled="loading"
          :num-inputs="4"
          separator=""
          :should-auto-focus="true"
          input-type="letter-numeric"
          :conditionalClass="['one', 'two', 'three', 'four']"
          :placeholder="['', '', '', '']"
          @onComplete="send()"
        />
      </div>
      <!--otp-box-->
      <Button
        :loading="loading"
        loadingIcon="pi pi-spin pi-spinner"
        class="!bg-[#7CF4CB] !border-0 text-[#0C0602] !h-[35px] text-xs w-full mt-4 !border-0"
        @click="send()"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner ml-1"></i>
        <span v-if="!loading">تایید و ادامه</span>
        <span v-else class="text-xs">صبر کنید...</span>
      </Button>
      <div class="flex my-3">
        <!-- <span
          class="text-gray_dark text-xs mr-auto pl-4 cursor-pointer hover:text-primary"
          @click="emit('show-login')"
          >ویرایش شماره</span
        > -->
        <!-- <span
          v-if="minutes || seconds > 0"
          class="text-gray_dark text-xs ml-auto cursor-pointer"
        >
          ارسال دوباره کد
          <span class="min-w-[60px] inline-block"
            >{{ minutes }}:{{ seconds }}</span
          >
        </span> -->
        <!-- <span
          v-else
          class="text-gray_dark text-xs ml-auto cursor-pointer hover:text-primary"
          @click="resendCode()"
          >ارسال مجدد</span
        > -->
      </div>
    </div>
  </template>
  