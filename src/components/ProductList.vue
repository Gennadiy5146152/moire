<template>
  <div>
    <fieldset class="form__block">
            <label class="form__label form__label--select" for="category">
              Показывать товаров на странице по:
              <select class="form__select" type="text" name="category" v-model="currentGoods">
                <option value="9">9</option>
                <option value="12">12</option>
                <option value="27">27</option>
              </select>
            </label>
          </fieldset>
<ul class="catalog__list">
          <li class="catalog__item" v-for="product in this.$store.state.productsData"
          :key="product.id">
          <ProductItem :product="product"></ProductItem>
          </li>
        </ul>
        <PaginationMainPage></PaginationMainPage>
      </div>
</template>

<script>
import { mapActions } from 'vuex';
import PaginationMainPage from './PaginationMainPage.vue';
import ProductItem from './ProductItem.vue';

export default {
  data() {
    return {
      colorCurrent: null,
      urlCurrent: null,
      currentGoods: '9',
    };
  },
  name: 'App',
  methods: {
    ...mapActions(['loadProducts', 'loadlistMaterialData', 'loadlistSeasonslData', 'loadlistProductCategories', 'loadColors']),
    async mounted() {
      this.loadProducts();
      this.loadColors();
      this.loadlistMaterialData();
      this.loadlistSeasonslData();
      this.loadlistProductCategories();
    },
    mutationQuantityGoods() {
      this.$store.commit('updateQuantityGoods', this.currentGoods);
    },
  },
  created() {
    this.mounted();
  },
  components: { PaginationMainPage, ProductItem },
  watch: {
    currentGoods() {
      this.mutationQuantityGoods();
      this.loadProducts();
    },
  },
};
</script>
