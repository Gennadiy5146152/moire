<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
<main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>
      <div v-if="preloader" class="spinner-border" role="status">
        <span class="visually-hidden">Данные отправляются на сервер...</span>
    </div>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{this.$store.state.basket}} товар
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <li class="cart__item product" v-for="product in this.products"
            :key="product.id">
              <div class="product__pic">
                <img :src="product.color.gallery[0].file.url" width="120" height="120"
                 alt="Название товара">
              </div>
              <h3 class="product__title">
                {{product.product.title}}
              </h3>
              <p class="product__info product__info--color">
                Цвет:
                <span>
                  <i :style="{ 'background-color':
                  product.color.color.code }"></i>
                  {{product.color.color.title}}
                </span>
              </p>
              <span class="product__code">
                Артикул: {{product.product.id}}
              </span>

              <div class="product__counter form__counter">
                <button type="button" aria-label="Убрать один товар"
                @click.prevent="productReduction(product), changeQuantityGoods(product),
                  getTotalSummProducts()">
                  <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" :value="product.quantity" name="count"
                 @blur.prevent="inputQuantityProducts(product)"
                 @input.prevent="inputQuantityProducts(product), changeQuantityGoods(product),
                  getTotalSummProducts()">

                <button type="button" aria-label="Добавить один товар"
                 @click.prevent="product.quantity++, changeQuantityGoods(product),
                  getTotalSummProducts()">
                  <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="product__price">
                {{product.price}} ₽
              </b>

              <button class="product__del button-del" type="button"
              aria-label="Удалить товар из корзины"
              @click.prevent="deleteProducts(product)">
                <svg width="20" height="20" fill="currentColor">
                  <use xlink:href="#icon-close"></use>
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{this.summ}} ₽</span>
          </p>

          <router-link :to="{name: 'ClearanceGoods'}" tag="button"
          class="cart__button button button--primery" type="submit">
              Оформить заказ
        </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      userAccessKey: localStorage.getItem('userAccessKey'),
      products: null,
      summ: 0,
      preloader: false,
    };
  },
  methods: {
    ...mapState(['basket']),
    ...mapActions(['getBasket']),
    getTotalSummProducts() {
      this.summ = this.products.map((element) => element.price * element.quantity)
        .reduce((currentSum, currentNumber) => currentSum + currentNumber);
    },
    getBasketApi() {
      this.preloader = true;
      // console.log(localStorage.userAccessKey);
      axios.get('https://vue-moire.skillbox.cc/api/baskets', {
        params: {
          userAccessKey: this.userAccessKey.substring(1, this.userAccessKey.length - 1),
        },
      })
        .then((response) => {
          const products = response.data;
          this.products = products.items;
          this.preloader = false;
          if (this.products.length !== 0) {
            this.summ = this.products.map((element) => element.price * element.quantity)
              .reduce((currentSum, currentNumber) => currentSum + currentNumber);
          } else {
            this.summ = 0;
          }
        });
    },
    changeQuantityGoods(product) {
      axios.put('https://vue-moire.skillbox.cc/api/baskets/products', {
        basketItemId: product.id,
        quantity: product.quantity,
      }, {
        params: {
          userAccessKey: this.userAccessKey.substring(1, this.userAccessKey.length - 1),
        },
      });
    },
    deleteProducts(product) {
      axios.delete('https://vue-moire.skillbox.cc/api/baskets/products', {
        params: {
          userAccessKey: this.userAccessKey.substring(1, this.userAccessKey.length - 1),
        },
        data: {
          basketItemId: product.id,
        },
      })
        .then(() => {
          this.getBasketApi();
          this.getBasket();
        });
    },
    productIncrease() {
      this.quantityOfGoods += 1;
    },
    productReduction(product) {
      if (product.quantity > 0) {
        // eslint-disable-next-line no-param-reassign
        product.quantity -= 1;
      }
    },
    inputQuantityProducts(product) {
      (console.log(product.quantity));
      (console.log(product.quantity));
      if (product.quantity < 0) {
        // eslint-disable-next-line no-param-reassign
        product.quantity = 0;
        console.log('1');
      }
    },
  },
  created() {
    // this.getBasketApi();
  },
  mounted() {
    this.getBasketApi();
  },
};
</script>
