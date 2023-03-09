import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
// import API_BASE_URL from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    loadProducts(context) {
      axios.get('https://vue-moire.skillbox.cc/api/products', {
        params: {
          minPrice: this.state.minPrice,
          maxPrice: this.state.maxPrice,
          materialIds: this.state.materials,
          seasonIds: this.state.seasons,
          categoryId: this.state.categories,
          colorIds: this.state.colorIds,
        },
      })
        .then((response) => {
          const productsDataLengthParams = response.data.items;
          context.commit('updateProductsDataLengthParams', productsDataLengthParams);
        });
      axios.get('https://vue-moire.skillbox.cc/api/products', {
        params: {
          limit: this.state.quantityGoods,
          page: this.state.pageGoods,
          minPrice: this.state.minPrice,
          maxPrice: this.state.maxPrice,
          materialIds: this.state.materials,
          seasonIds: this.state.seasons,
          categoryId: this.state.categories,
          colorIds: this.state.colorIds,
        },
      })
        .then((response) => {
          const productsData = response.data.items;
          context.commit('updateProductsData', productsData);
        });
    },
    loadlistMaterialData(context) {
      axios.get('https://vue-moire.skillbox.cc/api/materials')
        .then((response) => {
          const listMaterialData = response.data.items;
          context.commit('updatelistMaterialData', listMaterialData);
        });
    },
    loadlistSeasonslData(context) {
      axios.get('https://vue-moire.skillbox.cc/api/seasons')
        .then((response) => {
          const listSeasonsData = response.data.items;
          context.commit('updatelistSeasonsData', listSeasonsData);
        });
    },
    loadlistProductCategories(context) {
      axios.get('https://vue-moire.skillbox.cc/api/productCategories')
        .then((response) => {
          const productCategories = response.data.items;
          context.commit('updateProductCategories', productCategories);
        });
    },
    getBasket(context) {
      axios.get('https://vue-moire.skillbox.cc/api/baskets', {
        params: {
          userAccessKey: this.state.userAccessKey.substring(1, this.state.userAccessKey.length - 1),
        },
      })
        .then((response) => {
          const products = response.data.items.length;
          context.commit('updateBasket', products);
        });
    },
    loadColors(context) {
      axios.get('https://vue-moire.skillbox.cc/api/colors')
        .then((response) => {
          const colorsData = response.data.items;
          context.commit('updateColors', colorsData);
          console.log(colorsData);
        });
    },
  },
  mutations: {
    updateProductsData(state, productsData) {
      state.productsData = productsData;
    },
    updatePageGoods(state, pageGoods) {
      state.pageGoods = pageGoods;
    },
    updateProductsDataLengthParams(state, productsDataLengthParams) {
      state.productsDataLengthParams = productsDataLengthParams.length;
      state.productsDataParams = productsDataLengthParams;
    },
    updateMinPrice(state, minPrice) {
      state.minPrice = minPrice;
    },
    updateMaxPrice(state, maxPrice) {
      state.maxPrice = maxPrice;
    },
    updateMaterials(state, materials) {
      state.materials = materials;
    },
    updateSeasons(state, seasons) {
      state.seasons = seasons;
    },
    updateCategories(state, categories) {
      state.categories = categories;
    },
    updatelistMaterialData(state, listMaterialData) {
      state.listMaterialData = listMaterialData;
    },
    updatelistSeasonsData(state, listSeasonsData) {
      state.listSeasonsData = listSeasonsData;
    },
    updateProductCategories(state, productCategories) {
      state.productCategories = productCategories;
    },
    updateBasket(state, baskets) {
      state.basket = baskets;
    },
    updateProducts(state, products) {
      state.products = products;
    },
    updateColors(state, colors) {
      state.colors = colors;
    },
    updateColorsIds(state, colorIds) {
      state.colorIds = colorIds;
    },
    updateQuantityGoods(state, quantityGoods) {
      state.quantityGoods = quantityGoods;
    },
  },
  state: {
    productsData: [],
    listMaterialData: [],
    listSeasonsData: [],
    productCategories: [],
    quantityGoods: 9,
    pageGoods: 1,
    productsDataLengthParams: 1,
    productsDataParams: [],
    minPrice: null,
    maxPrice: null,
    materials: [],
    seasons: [],
    categories: null,
    basket: 0,
    userAccessKey: localStorage.getItem('userAccessKey'),
    products: null,
    colors: null,
    colorIds: [],
  },
  getters: {
    updateProductsDataGetters: (state) => state.productsData.length,
  },
});
