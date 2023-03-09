<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div>
<ul class="catalog__pagination pagination">
          <li class="pagination__item">
            <a class="pagination__link pagination__link--arrow"
            aria-label="Предыдущая страница"
            @click.prevent="pageSwitchingArrowPrevious()"
            :class="{'pagination__link--disabled': buttonDisabledPrevious}">
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-left"></use>
              </svg>
            </a>
          </li>
          <li class="pagination__item" v-for="(page,index) in this.productList()" :key="index">
           <PaginationPages :page="page" :pageSwitching="pageSwitching"
            ></PaginationPages>
          </li>
          <li class="pagination__item">
            <a class="pagination__link pagination__link--arrow" href="#"
            aria-label="Следующая страница"  @click.prevent="pageSwitchingArrowNext()"
            :class="{'pagination__link--disabled': buttonDisabledNext}">
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </a>
          </li>
        </ul>

      </div>
</template>

<script>
// import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import PaginationPages from './PaginationPages.vue';

export default {
  data() {
    return {
      quantityPages: 0,
      pageId: 1,
      buttonDisabledNext: false,
      buttonDisabledPrevious: true,
    };
  },
  computed: {
    ...mapGetters(['updateProductsDataGetters']),
  },
  methods: {
    productList() {
      this.quantityPages = Math.ceil(this.$store.state.productsDataLengthParams
                / this.$store.state.quantityGoods);
      return this.quantityPages;
    },
    ...mapActions(['loadProducts']),
    pageSwitching(page) {
      this.buttonDisabledPrevious = true;
      this.$store.commit('updatePageGoods', page);
      this.loadProducts();
      if (this.$store.state.pageGoods === 1) {
        this.buttonDisabledPrevious = true;
      } else {
        this.buttonDisabledPrevious = false;
      }
      if (this.$store.state.pageGoods === this.quantityPages) {
        this.buttonDisabledNext = true;
      } else {
        this.buttonDisabledNext = false;
      }
      this.clearPagination();
    },
    clearPagination() {
      if (document.querySelector('.pagination__link--current')) {
        document.querySelector('.pagination__link--current').classList.remove('pagination__link--current');
      }
      document.getElementById(`${this.$store.state.pageGoods}page`).classList.add('pagination__link--current');
    },
    pageSwitchingArrowNext() {
      this.buttonDisabledPrevious = false;
      if (this.$store.state.pageGoods - this.quantityPages === -1) {
        this.buttonDisabledNext = true;
        // return;
      }
      this.$store.commit('updatePageGoods', this.$store.state.pageGoods + 1);
      this.loadProducts();
      this.clearPagination();
    },
    pageSwitchingArrowPrevious() {
      this.buttonDisabledNext = false;
      if (this.$store.state.pageGoods <= 2) {
        this.buttonDisabledPrevious = true;
        // return;
      }
      this.$store.commit('updatePageGoods', this.$store.state.pageGoods - 1);
      this.loadProducts();
      this.clearPagination();
    },
  },
  components: { PaginationPages },
  mounted() {
    this.clearPagination();
  },
};
</script>
