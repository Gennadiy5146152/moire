<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <BaseFormField :title="title" :error="error">
      <textarea class="form__input form__input--area" v-model="dataValue"
      name="comments" :placeholder="placeholder"></textarea>
  </BaseFormField>
  </template>

<script>
import formFieldMixins from '@/mixins/formFieldMixins';

export default {
  mixins: [formFieldMixins],
};
</script>
