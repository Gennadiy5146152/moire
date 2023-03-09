<template>
<main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          150 товаров
        </span>
      </div>
    </div>
    <div v-if="preloader" class="spinner-border" role="status">
        <span class="visually-hidden">Данные отправляются на сервер...</span>
    </div>

    <FilterMainPage></FilterMainPage>

    <div class="content__catalog">

      <div id="app"></div>

    </div>
  </main>
</template>

<script>
import axios from 'axios';
import FilterMainPage from '../components/FilterMainPage.vue';

export default {
  data() {
    return {
      preloader: false,
    };
  },
  components: { FilterMainPage },
  methods: {
    getUserAccessKey() {
      this.preloader = true;
      axios.get('https://vue-moire.skillbox.cc/api/users/accessKey')
        .then((response) => {
          const key = response.data;
          if (!localStorage.userAccessKey) {
            localStorage.setItem('userAccessKey', JSON.stringify(key.accessKey));
          }
          this.preloader = false;
        });
    },
  },
  created() {
    this.getUserAccessKey();
  },
};

</script>
