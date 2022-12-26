<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
<BaseFormField :title="title" :error="error">
  <input class="form__input" type="text" :name="title"
    :placeholder="placeholder" v-model="dataValue">
</BaseFormField>
</template>

<script>
import formFieldMixins from '@/mixins/formFieldMixins';

export default {
  mixins: [formFieldMixins],
};
</script>
