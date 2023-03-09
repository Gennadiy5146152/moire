<template>
<main class="content container">
  <div v-if="preloader" class="spinner-border" role="status">
        <span class="visually-hidden">Данные отправляются на сервер...</span>
    </div>
    <div v-if="preloader">
        <span>Упс...корзина пуста</span>
    </div>
  <div v-if="this.orderInfo">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link" href="index.html">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name:'basketPage'}" class="breadcrumbs__link" href="cart.html">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{this.orderInfo.id}}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо
            с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{this.orderInfo.name}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{this.orderInfo.address}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{this.orderInfo.phone}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{this.orderInfo.email}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{this.orderInfo.paymentType}}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="product in this.orderInfo.basket.items"
             :key="product.id">
              <h3>{{product.product.title}}</h3>
              <b>{{product.price* product.quantity}} ₽</b>
              <span>Артикул: {{product.id}}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{this.orderInfo.deliveryType.title}}</b></p>
            <p>Итого: <b>{{this.orderInfo.basket.items.length}}</b>
              товара на сумму <b>{{this.orderInfo.totalPrice}} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </div>
  </main>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      orderId: this.$store.state.products,
      orderInfo: null,
      userAccessKey: localStorage.getItem('userAccessKey'),
      preloader: false,
    };
  },
  methods: {
    getOrderInfo() {
      this.preloader = true;
      axios.get(`https://vue-moire.skillbox.cc/api/orders/${this.$store.state.products}`, {
        params: {
          userAccessKey: this.userAccessKey.substring(1, this.userAccessKey.length - 1),
          orderId: this.$store.state.products,
        },
      })
        .then((response) => {
          this.orderInfo = response.data;
          this.preloader = false;
        });
    },
    ...mapActions(['getBasket']),
  },
  created() {
    this.getOrderInfo();
    this.getBasket();
  },
};
</script>
