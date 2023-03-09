<template>
<label class="options__label" :for="title">
    <input class="options__radio sr-only" type="radio"
      name="pay" :value="id" :id="title" v-model="dataValue">
    <span class="options__value">
        {{title}}
    </span>
</label>
</template>

<script>

export default {
  props: ['id', 'title', 'price', 'value'],
  computed: {
    dataValue: {
      // eslint-disable-next-line vue/return-in-computed-property
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
