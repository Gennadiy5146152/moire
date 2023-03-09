<template>
  <div>
    <router-link :to="{name: 'productProperty', params: {id:this.product.id}}"
            class="catalog__pic" :id="'color' + this.product.id">

              <img v-if="this.colorCurrent.gallery != null"
              :src="this.colorCurrent.gallery[0].file.url"
               alt="Название товара">
            </router-link>

            <h3 class="catalog__title">
              <a href="#">
                {{this.product.title}}
              </a>
            </h3>

            <span class="catalog__price">
             {{this.product.price}} ₽
            </span>

            <ul class="colors colors--black">
              <li class="colors__item" v-for="color in this.product.colors"
               :key="color.id">
                <label class="colors__label" :for="color.id">
                  <input class="colors__radio sr-only" type="radio" name="color-1"
                  :value="color"
                  v-model="colorCurrent" :id="color.id" checked="">
                  <span class="colors__value" :style="{ 'background-color':
                  color.color.code }">
                  </span>
                </label>
              </li>
            </ul>

  </div>

</template>

<script>
export default {
  props: { product: Object },
  data() {
    return {
      colorCurrent: this.product.colors[0],
      urlCurrent: null,
    };
  },
};
</script>
