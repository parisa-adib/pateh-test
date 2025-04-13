import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker';
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(Vue3PersianDatetimePicker, {
        name: 'PersianDatePicker',
        props: {
            format: 'jYYYY/jMM/jDD HH:mm',
            displayFormat: 'jYYYY/jMM/jDD HH:mm',
            editable: false,
            inputClass: 'form-control persian-datepicker',
            altFormat: 'YYYY/MM/DD',
            color: '#EB6F24',
            autoSubmit: true,
            simple: false,
            appendTo: 'body',
        },
    });
});