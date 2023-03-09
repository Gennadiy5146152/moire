<template>
  <div>
  <header class="header container">
    <div class="header__wrapper">
      <router-link :to="{name: 'main'}" class="header__info">Каталог</router-link>

      <a class="header__logo" href="#">
        <img src="img/svg/logo-moire.svg" alt="Логотип интернет магазина Moire"
         width="116" height="34">
      </a>

      <a class="header__tel" href="tel:8 800 600 90 11">
        8 800 600 90 12
      </a>
      <transition name="fade" v-if="show">
      <router-link class="header__cart" :to="{name: 'basketPage'}"
       aria-label="Корзина с товарами">
        <svg width="19" height="24">
          <use xlink:href="#icon-cart"></use>
        </svg>
        <span class="header__count" aria-label="Количество товаров">
          {{animatedCurrentGoods}}</span>
      </router-link>
    </transition>
    </div>
  </header>
  <router-view></router-view>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import gsap from 'gsap';

export default {
  data() {
    return {
      show: true,
      currentGoods: this.basket,
    };
  },
  methods: {
    ...mapActions(['getBasket']),
    ...mapState(['basket']),
  },
  computed: {
    animatedCurrentGoods() {
      return this.currentGoods();
    },
  },
  mounted() {
    this.getBasket();
  },
  watch: {
    currentGoods() {
      console.log('1');
      gsap.to(this.$data, { duration: 5, number: this.currentGoods });
    },
  },
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
