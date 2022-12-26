<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
<div class="content__catalog">
      <aside class="filter">
        <form class="filter__form form" action="#" method="get">
          <fieldset class="form__block">
            <legend class="form__legend">Цена</legend>
            <label class="form__label form__label--price" for="form__input">
              <input class="form__input" type="text" name="min-price" v-model="minPrice"
               placeholder="0">
              <span class="form__value">От</span>
            </label>
            <label class="form__label form__label--price" for="form__input">
              <input class="form__input" type="text" name="max-price" v-model="maxPrice"
              placeholder="0">
              <span class="form__value">До</span>
            </label>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Категория</legend>
            <label class="form__label form__label--select" for="category">
              <select class="form__select" type="text" name="category" v-model="categories">
                <option value="">Все товары</option>
                <option
                v-for="category in this.productCategories()"
                 :key="category.id" :value="category.title">
                 {{category.title}}
                </option>
              </select>
            </label>
          </fieldset>

          <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in this.colors()" :key="color.id">
            <label class="colors__label" :for="color.id">
              <input class="colors__radio sr-only" type="radio" :value="color"
               v-model="currentColor" checked="" :id="color.id">
              <span class="colors__value" v-bind:style="{'background-color': color.code}">
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Материал</legend>
            <ul class="check-list">
              <li class="check-list__item"
               v-for="material in this.listMaterialData()"
               :key="material.id">
                <label class="check-list__label" :for="material.id">
                  <input class="check-list__check sr-only" type="checkbox"
                   :value="material.title" v-model="material.checked"
                   :id="material.id" @click="click()">
                  <span class="check-list__desc">
                    {{material.title}}
                    <span>({{getAmountMaterials(material.id)}})</span>
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Коллекция</legend>
            <ul class="check-list">
              <li class="check-list__item" v-for="season in this.listSeasonsData()"
              :key="season.id">
                <label class="check-list__label" :for="season.title">
                  <input class="check-list__check sr-only" type="checkbox" name="collection"
                  :value="season.title" v-model="season.checked"
                  :id="season.title" @click="click()">
                  <span class="check-list__desc">
                    {{season.title}}
                    <span>({{getAmountSeasons(season.id)}})</span>
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>
          <button class="filter__submit button button--primery" type="submit"
           @click.prevent="filtraition()">
            Применить
          </button>
          {{this.materials}}
          <button class="filter__reset button button--second" type="button"
          @click.prevent="resetFiltering()" v-show="this.minPrice != null || this.maxPrice != null
          ||  this.materialsClick == true || this.categories != '' || this.currentColor !=''">
            Сбросить
          </button>
        </form>
      </aside>
      <ProductList></ProductList>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ProductList from './ProductList.vue';
import router from '../router';

export default {
  data() {
    return {
      minPrice: null,
      maxPrice: null,
      materials: null,
      materialsClick: false,
      categories: '',
      currentColor: '',
      colorsIds: [],
    };
  },
  methods: {
    ...mapActions(['loadProducts', 'loadlistMaterialData', 'loadlistSeasonslData', 'loadColors']),
    ...mapState(['productsDataParams', 'productCategories', 'listMaterialData', 'listSeasonsData', 'productCategories', 'colors']),
    filtraition() {
      const filterMaterial = this.listMaterialData().filter((elem) => elem.checked === true)
        .map((element) => element.id);
      const filterSeason = this.listSeasonsData().filter((elem) => elem.checked === true)
        .map((element) => element.id);
      const filterCategory = this.productCategories()
        .filter((elem) => elem.title === this.categories)
        .map((element) => element.id)[0];
      this.$store.commit('updateMinPrice', this.minPrice);
      this.$store.commit('updateMaxPrice', this.maxPrice);
      this.$store.commit('updateMaterials', filterMaterial);
      this.$store.commit('updateSeasons', filterSeason);
      this.$store.commit('updateCategories', filterCategory);
      this.$store.commit('updateColorsIds', this.colorsIds);
      this.loadProducts();
      this.minPrice = null;
      this.maxPrice = null;
      this.colorsIds = null;
      this.loadlistMaterialData();
      this.loadlistSeasonslData();
      this.filterMaterial = [];
      this.filterSeason = [];
      this.filterCategory = null;
      // this.categories = '';
    },
    resetFiltering() {
      this.minPrice = null;
      this.maxPrice = null;
      this.colorsIds = [];
      this.filterMaterial = [];
      this.filterSeason = [];
      this.filterCategory = null;
      this.currentColor = Object.keys(this.currentColor).length === 0;
      console.log(this.colorsIds);
      this.$store.commit('updateMinPrice', this.minPrice);
      this.$store.commit('updateMaxPrice', this.maxPrice);
      this.$store.commit('updateMaxPrice', this.maxPrice);
      this.$store.commit('updateMaterials', this.filterMaterial);
      this.$store.commit('updateSeasons', this.filterSeason);
      this.$store.commit('updateCategories', this.filterCategory);
      this.$store.commit('updateColorsIds', this.colorsIds);
      this.loadProducts();
      this.categories = '';
      this.materialsClick = false;
      if (this.$route.params.id !== undefined) {
        router.push({ name: 'main' });
      }
    },
    getAmountMaterials(material) {
      return this.productsDataParams().map((elems) => elems.materials
        .filter((elem) => elem.id === material)).filter((element) => element.length !== 0).length;
    },
    getAmountSeasons(season) {
      return this.productsDataParams().map((elems) => elems.seasons
        .filter((elem) => elem.id === season)).filter((element) => element.length !== 0).length;
    },
    pushColorsIds() {
      this.colorsIds.push(this.currentColor.id);
      // console.log(this.seasons);
    },
    click() {
      this.materialsClick = true;
    },
  },
  components: { ProductList },
  watch: {
    currentColor() {
      this.pushColorsIds();
    },
    listMaterialData() {
      this.materialsClick = true;
    },
  },
};
</script>
