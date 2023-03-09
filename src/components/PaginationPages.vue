<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <a class="pagination__link" :id="page+'page'" @click.prevent="pageSwitching(page)"
    :class="{'pagination__link--current': classActive}">
    {{page}}
   </a>
</template>

<script>

export default {
  props: { page: Number, pageSwitching: Function, classActive: Boolean },
  data() {
    return {
      quantityPages: 0,
      pageId: 1,
      buttonDisabledNext: false,
      buttonDisabledPrevious: true,
    };
  },
};
</script>
