<template>
<label class="options__label" :for="id">
  <input class="options__radio  sr-only" type="radio"
      name="delivery" :value="id" :id="id" v-model="dataValue">
      <span class="options__value">
      {{title}} <b>{{price}}</b>
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
