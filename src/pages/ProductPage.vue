<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
<main class="content container">
  <div v-if="preloader" class="spinner-border" role="status">
        <span class="visually-hidden">Данные отправляются на сервер...</span>
    </div>
    <div v-if="this.dataPage">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            <span @click="goToDirectoryMain()">Каталог</span>
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link"
          :to="{name: 'mainFilter', params: {id:this.categoriesId}}">
          <span @click="filterCat()">{{this.categoriesTitle}}</span>
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{this.dataPage.title}}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="this.urlCurrent"
           alt="Название товара">
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{this.dataPage.id}}</span>
        <h2 class="item__title" v-if="this.dataPage">
          {{this.dataPage.title}}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST">
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар"
                @click.prevent="productReduction()">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text"  name="count"
                 v-model.number="this.quantityOfGoods"
                 @blur.prevent="inputQuantityProducts()"
                 @input.prevent="inputQuantityProducts()" >

                <button type="button" aria-label="Добавить один товар"
                @click.prevent="productIncrease()">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>
              <b class="item__price">
                {{this.dataPage.price}} ₽
              </b>
            </div>
            <BaseFormField :error="this.errorMeaning" v-if="this.errorMeaning"></BaseFormField>
            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item" v-for="color in dataPage.colors" :key="color.id">
                    <label class="colors__label" :for="color.color.code">
                      <input class="colors__radio sr-only" type="radio" name="color-item"
                       :value="color.color.code" v-model="colorsCurrent" :id="color.color.code"
                        @change="filterUrlByImage()">
                      <span class="colors__value" :style="{ 'background-color': color.color.code }">
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>
              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select" for="category">
                  <select class="form__select" type="text" name="category"
                  v-model="sizeProduct">
                  <option disabled value="">Выбирите размер</option>
                    <option :value="size.id" v-for="(size, index) in this.productsSize"
                    :key="index">
                      {{size.title}}</option>
                  </select>
                </label>
              </fieldset>
            </div>
            <BaseFormField :error="this.errorSize" v-if="this.errorSize"></BaseFormField>
            <button class="item__button button button--primery" type="submit"
             @click.prevent="addingProductToCart(), getQuantityGoods()">
              В корзину
            </button>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item" @click.prevent="switchingInfo()">
            <a class="tabs__link"
            :class="{'tabs__link--current': this.infoProduct}">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item"  @click.prevent="switchingDelivery()">
            <a class="tabs__link"
            :class="{'tabs__link--current': this.infoDelivery}">
              Доставка и возврат
            </a>
          </li>
        </ul>
        <div class="item__content" v-show="this.infoProduct">
          {{this.textApi}}
        </div>
        <div class="item__content" v-show="this.infoDelivery">
          {{this.textDeliveryApi}}
        </div>
      </div>
    </section>
  </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axios from 'axios';
import BaseFormField from '@/components/BaseFormField.vue';

export default {
  data() {
    return {
      dataPage: null,
      categoriesTitle: null,
      categoriesId: 1,
      colorsCurrent: null,
      colorId: null,
      urlCurrent: null,
      quantityOfGoods: 0,
      productsSize: null,
      sizeProduct: '',
      text: 'Состав 60% хлопок 30% полиэстер Уход:Машинная стирка при макс. 30ºC короткий отжим Гладить при макс. 110ºC Не использовать машинную сушку Отбеливать запрещено Не подвергать химчистке',
      textApi: null,
      textDelivery: 'Доставка курьером осуществляется по Санкт-Петербургу в пределах КАД.Стоимость доставки — 600 рублей.',
      textDeliveryApi: null,
      infoProduct: true,
      infoDelivery: false,
      userAccessKey: localStorage.userAccessKey,
      products: null,
      preloader: false,
      errorMeaning: '',
      errorSize: '',
    };
  },
  methods: {
    ...mapState(['productsDataParams', 'productCategories', 'basket']),
    ...mapActions(['loadProducts', 'loadlistProductCategories', 'getBasket']),
    getPropertyProduct() {
      this.preloader = true;
      axios.get('https://vue-moire.skillbox.cc/api/products')
        .then((response) => {
          const productsDataPage = response.data.items;
          // eslint-disable-next-line no-unused-vars, prefer-destructuring
          this.dataPage = (productsDataPage
            .filter((elem) => elem.id === +this.$route.params.id))[0];
          this.colorsCurrent = this.dataPage.colors[0].color.code;
          this.preloader = false;
        })
      // eslint-disable-next-line no-unused-vars
        .then((response) => this.determiningSeasonForBreadcrumbs());
    },
    filterUrlByImage() {
      this.urlCurrent = (this.dataPage.colors.filter((elem) => elem.color.code
                === this.colorsCurrent))[0].gallery[0].file.url;
      this.colorId = (this.dataPage.colors.filter((elem) => elem.color.code
                === this.colorsCurrent))[0].color.id;
    },
    productIncrease() {
      this.quantityOfGoods += 1;
    },
    productReduction() {
      if (this.quantityOfGoods > 0) {
        this.quantityOfGoods -= 1;
      }
    },
    inputQuantityProducts() {
      if (this.quantityOfGoods < 0) {
        this.quantityOfGoods = 0;
      }
    },
    determiningSeasonForBreadcrumbs() {
      axios.get(`https://vue-moire.skillbox.cc/api/products/${this.dataPage.id}`)
        .then((response) => {
          const productCategories = response.data;
          this.categoriesTitle = productCategories.category.title;
          this.categoriesId = productCategories.category.id;
          this.productsSize = productCategories.sizes;
          this.productsInBasket = productCategories;
        });
    },
    filterCat() {
      this.$store.commit('updatePageGoods', 1);
      this.$store.commit('updateCategories', this.categoriesId);
    },
    addingTextInLocalStorage() {
      localStorage.text = this.text;
      localStorage.textDelivery = this.textDelivery;
    },
    getInfoLocalSorage() {
      this.textApi = localStorage.getItem('text');
      this.textDeliveryApi = localStorage.getItem('textDelivery');
    },
    goToDirectoryMain() {
      this.$store.commit('updatePageGoods', 1);
    },
    switchingInfo() {
      if (this.infoProduct === false) {
        this.infoProduct = true;
        this.infoDelivery = false;
      } else if (this.infoProduct === true) {
        this.infoProduct = true;
        this.infoDelivery = false;
      }
    },
    switchingDelivery() {
      if (this.infoDelivery === false) {
        this.infoProduct = false;
        this.infoDelivery = true;
      } else if (this.infoDelivery === true) {
        this.infoProduct = true;
        this.infoDelivery = false;
      }
    },
    getQuantityGoods() {
      axios.get('https://vue-moire.skillbox.cc/api/baskets', {
        params: {
          userAccessKey: this.userAccessKey.substring(1, this.userAccessKey.length - 1),
        },
      })
        .then((response) => {
          const products = response.data;
          this.products = products.items.length;
          this.getBasket();
        });
    },
    addingProductToCart() {
      // console.log(this.userAccessKey);
      axios.post('https://vue-moire.skillbox.cc/api/baskets/products', {
        productId: this.productsInBasket.id,
        colorId: this.colorId,
        sizeId: this.sizeProduct,
        quantity: this.quantityOfGoods,
      }, {
        params: {
          userAccessKey: this.userAccessKey.substring(1, this.userAccessKey.length - 1),
        },
      })
        .then((response) => {
          // eslint-disable-next-line no-unused-vars
          const info = response.data;
          this.errorSize = '';
        })
        .catch((error) => {
          this.errorSize = error.response.data.error.request.sizeId;
          this.errorMeaning = error.response.data.error.request.quantity;
        });
    },
  },
  created() {
    this.getPropertyProduct();
  },
  mounted() {
    this.getInfoLocalSorage();
    this.addingTextInLocalStorage();
  },
  watch: {
    colorsCurrent() {
      if (this.urlCurrent === null) {
        this.filterUrlByImage();
      }
    },
  },
  components: { BaseFormField },
};
</script>

<style>

</style>
