<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
<main class="content container">
  <div v-if="preloader" class="spinner-border" role="status">
        <span class="visually-hidden">Данные отправляются на сервер...</span>
    </div>
  <div v-if="this.products">
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

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formData.name" title="ФИО"
             :error="formError.name" placeholder="Введите ваше полное имя"></BaseFormText>

            <BaseFormText v-model="formData.address" title="Адрес доставки"
             :error="formError.address" placeholder="Введите ваш адрес"></BaseFormText>

             <BaseFormText v-model="formData.phone" title="Телефон"
             :error="formError.phone" placeholder="Введите ваш телефон"></BaseFormText>

             <BaseFormText v-model="formData.email" title="Email"
             :error="formError.email" placeholder="Введи ваш Email"></BaseFormText>

            <BaseFormTextarea v-model="formData.comments" :error="formError.comments"
            title="Комментарий к заказу"
            placeholder="Ваши пожелания"></BaseFormTextarea>

          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="method in this.methodsDelivery" :key="method.id">
                <DeliveryComp :title="method.title" :id="method.id" :price="method.price"
                v-model="deliveryTypeId">
                </DeliveryComp>
              </li>

            </ul>
            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="methodPay in this.methodPay" :key="methodPay.id">
                <MethodPay :id="methodPay.id" :title="methodPay.title" v-model="paymentTypeId">
                </MethodPay>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="product in products" :key="product.id">
              <h3>{{product.product.title}}</h3>
              <b>{{product.price}} ₽</b>
              <span>Артикул: {{product.product.id}}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>бесплатно</b></p>
            <p>Итого: <b>{{this.products.length}}</b> товара на сумму
              <b>{{this.summ + +this.priceDelivery}} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" @click.prevent=formValidation()>
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="Object.keys(this.formError).length !== 0">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </div>
  </main>
</template>

<script>

import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import DeliveryComp from '@/components/DeliveryComp.vue';
import MethodPay from '@/components/MethodPay.vue';
import axios from 'axios';

export default {
  data() {
    return {
      formData: {},
      formError: {},
      methodsDelivery: null,
      methodPay: null,
      deliveryTypeId: null,
      paymentTypeId: null,
      summ: null,
      products: null,
      userAccessKey: localStorage.getItem('userAccessKey'),
      priceDelivery: 0,
      preloader: false,
    };
  },
  components: {
    BaseFormText, BaseFormTextarea, DeliveryComp, MethodPay,
  },
  methods: {
    getMethodsDelivery() {
      axios.get('https://vue-moire.skillbox.cc/api/deliveries')
        .then((resonse) => {
          const dataDelivery = resonse.data;
          this.methodsDelivery = dataDelivery;
        });
    },
    getMethodPay() {
      axios.get('https://vue-moire.skillbox.cc/api/payments', {
        params: {
          deliveryTypeId: this.deliveryTypeId,
        },
      })
        .then((resonse) => {
          const dataPay = resonse;
          this.methodPay = dataPay.data;
        });
    },
    getBasket() {
      this.preloader = true;
      axios.get('https://vue-moire.skillbox.cc/api/baskets', {
        params: {
          userAccessKey: this.userAccessKey.substring(1, this.userAccessKey.length - 1),
        },
      })
        .then((response) => {
          const products = response.data;
          this.products = products.items;
          console.log(products);
          if (this.products.length !== 0) {
            this.summ = this.products.map((element) => element.price * element.quantity)
              .reduce((currentSum, currentNumber) => currentSum + currentNumber);
          } else {
            this.summ = 0;
          }
          this.preloader = false;
        });
    },
    formValidation() {
      Object.keys(this.formError).forEach((key) => delete this.formError[key]);
      axios.post('https://vue-moire.skillbox.cc/api/orders', {
        name: this.formData.name,
        address: this.formData.address,
        phone: this.formData.phone,
        email: this.formData.email,
        deliveryTypeId: this.deliveryTypeId,
        paymentTypeId: this.paymentTypeId,
        comment: this.formData.comments,
      }, {
        params: {
          userAccessKey: this.userAccessKey.substring(1, this.userAccessKey.length - 1),
        },
      })
        .then((response) => {
          console.log(response.data.id);
          const iD = response.data.id;
          this.$store.commit('updateProducts', iD);
          if (Object.keys(this.formError).length === 0) {
            this.$router.push('OrderInfoPage');
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-unused-vars
          this.formError = error.response.data.error.request;
        });
    },
    priceForDelivery() {
      this.priceDelivery = (this.methodsDelivery
        .filter((elem) => elem.id === this.deliveryTypeId))[0].price;
    },
  },
  created() {
    this.getMethodsDelivery();
  },
  mounted() {
    this.getBasket();
  },
  watch: {
    deliveryTypeId() {
      this.getMethodPay();
      this.priceForDelivery();
    },
  },
};
</script>
