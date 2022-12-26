import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from '../pages/MainPage.vue';
import ProductPage from '../pages/ProductPage.vue';
import BasketPage from '../pages/BasketPage.vue';
import ClearanceGoodsPage from '../pages/ClearanceGoodsPage.vue';
import OrderInfoPage from '../pages/OrderInfoPage.vue';

Vue.use(VueRouter);

const routes = [
  { name: 'main', component: MainPage, path: '/' },
  { name: 'productProperty', component: ProductPage, path: '/productProperty/:id' },
  { name: 'mainFilter', component: MainPage, path: '/categories/:id' },
  { name: 'basketPage', component: BasketPage, path: '/basket/' },
  { name: 'ClearanceGoods', component: ClearanceGoodsPage, path: '/ClearanceGoods/' },
  { name: 'OrderInfoPage', component: OrderInfoPage, path: '/OrderInfoPage/' },
];
const router = new VueRouter({
  routes,
});

export default router;
