import { VsxIcon } from "vue-iconsax";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("vsxicon", VsxIcon);
});
