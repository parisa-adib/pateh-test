<script setup>
/**
 * Persian date selection component with the ability to connect to forms.
 *
 * @component
 * @prop {String} id - Unique id for the field.
 * @prop {String} format - Date storage format (default: 'YYYY-MM-DD').
 * @prop {String} displayFormat - The format for displaying the date to the user (default: 'jYYYY/jMM/jDD').
 * @prop {String} locale - Local language (default: 'fa').
 * @emits update-date - Date value update event.
 */

import { defineProps, defineEmits,defineModel } from 'vue'
import moment from 'moment-jalaali';
const props = defineProps({
  id: String,
  format: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  displayFormat: {
    type: String,
    default: 'jYYYY/jMM/jDD'
  },
  locale: {
    type: String,
    default: 'fa'
  },

})
const date = ref()
const emit = defineEmits(['update-date'])

const today = moment().format(props.format);
const minDate = ref(today);

watch(date,(newValue) => {
    emit('update-date',newValue)
},{immediate:true})
</script>

    <template>
  <div>
    
        <PersianDatePicker
        class="mt-5"
        v-model="date"
        :id="id"
        :format="format"
        :display-format="displayFormat"
        :locale="locale"
         :min="minDate"
          />
  
  </div>

</template>
