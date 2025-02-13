<template>
    <div class="wrapper" :style="{ height: `calc(var(--vh, 1vh) * 100 - 51px)` }">
      <div v-if="!authed">
        <img class="logo" src="../assets/logoo.png" width="300px" height="300px">
        <h1 class="title">{{ $t("main.title") }}</h1>
        <h2 class="subtitle">{{ $t("main.subtitle") }}</h2>
        <div class="content">{{ $t("main.content1") }}</div>
        <div class="content">{{ $t("main.content2") }}</div>
        <!--<div class="content">{{ $t("main.content3") }}</div>-->
        <br>
        <router-link to="/login">
          <button>{{ $t("main.startButton") }}</button>
        </router-link>
        <br>
        <img class="arrow" src="../assets/arrow.png" width="50px">
        <br>
        <img src="../assets/preview6.png" width="800px">
        <div class="content">{{ $t("main.content4") }}</div>
        <div class="content">{{ $t("main.content6") }}</div>
        <div class="block"></div>
        <div class="preview-flex">
          <img src="../assets/preview5.png" width="500px">
          <img src="../assets/preview4.png" width="500px">
        </div>
        <div class="content">{{ $t("main.content5") }}</div>
        <div class="content">{{ $t("main.content7") }}</div>
        <div class="copyright">© 2025. RecordBox All rights reserved.</div>
      </div>
      <div v-if="authed">
        <!--
        <img class="logo" width="250px" height="250px">
        <div class="search_bar">
          <select v-model="searchType" class="searchType">
            <option value="Title">Title</option>
            <option value="Artist">Artist</option>
          </select>
          <input type="text" v-model="searchQuery" class="searchQuery" @input="searchVinyls" />
        </div>-->
      </div>
    </div>
</template>

<script>
//import apiClient from '@/services/api';

export default {
  name: "MainView",
  data() {
    return {
      searchType: 'Title',
      searchQuery: '',
      authed: false,
    }
  },
  async mounted() {
    this.updateViewportHeight();
    window.addEventListener("resize", this.updateViewportHeight);
    try {
      //await apiClient.get('/auth/session');
      //this.authed = true;
      //this.$router.push('/vinyl');
    } catch(err) {
      this.authed = false;
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateViewportHeight);
  },
  methods: {
    searchVinyls() {
      console.log(this.searchType, this.searchQuery);
    },
    updateViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
  }
}
</script>

<style scoped>

.copyright {
  margin-top: 150px;
  margin-bottom: 10px;
  color: darkgray;
}

.block {
  margin: 150px;
}

.preview-flex {
  display: flex;
  justify-content: center;
}
.arrow {
  margin: 20px;
  margin-bottom: 150px;
}
.logo {
  margin-top: 150px;
}

.wrapper {
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-family: Bebas Neue;
  font-size: 70px;
}

.subtitle {
  font-size: 30px;
}

.content {
  font-size: 20px;
  margin: 10px;
}

.search_bar {
  width: 600px;
  height: 40px;
  border: 1px solid #2a2e32;
}

</style>