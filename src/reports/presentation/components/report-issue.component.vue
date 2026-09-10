<template>
  <form class="card form-card" @submit.prevent="submit">
    <div class="ps-field">
      <label>{{ $t('report.field.label') }}</label>
      <select v-model="field">
        <option value="hours">{{ $t('report.field.hours') }}</option>
        <option value="address">{{ $t('report.field.address') }}</option>
        <option value="name">{{ $t('report.field.name') }}</option>
      </select>
    </div>

    <div class="ps-field">
      <label>{{ $t('report.current') }}</label>
      <input v-model.trim="current" type="text" :placeholder="initialHours || ''" />
    </div>

    <div class="ps-field">
      <label>{{ $t('report.suggested') }}</label>
      <input v-model.trim="suggested" type="text" :placeholder="$t('report.placeholders.suggested')" />
    </div>

    <div class="ps-field">
      <label>{{ $t('report.comment') }}</label>
      <textarea v-model.trim="comment" rows="4" :placeholder="$t('report.placeholders.comment')"></textarea>
    </div>

    <div class="form-actions">
      <RouterLink class="btn btn--ghost" to="/map">{{ $t('common.cancel') }}</RouterLink>
      <button class="btn btn--primary" type="submit">{{ $t('report.submit') }}</button>
    </div>
  </form>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
  name: 'ReportIssue',
  components: { RouterLink },
  emits: ['submitted'],
  props: {
    id: { type: String, required: true },
    initialName: { type: String, default: '' },
    initialAddress: { type: String, default: '' },
    initialHours: { type: String, default: '' }
  },
  setup(props, { emit }) {
    const field = ref('hours');
    const current = ref(props.initialHours || '');
    const suggested = ref('');
    const comment = ref('');

    const submit = async () => {
      console.log('Report payload', {
        id: props.id,
        field: field.value,
        current: current.value,
        suggested: suggested.value,
        comment: comment.value
      });
      emit('submitted');
    };

    return { field, current, suggested, comment, submit };
  }
});
</script>

