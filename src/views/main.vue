<template>
    <div class="wrapper" :style="{ height: `calc(var(--vh, 1vh) * 100 - 51px)` }">
      <div v-if="!authed">
        <img class="logo" width="250px" height="250px">
        <div class="title">{{ $t("main.title") }}</div>
        <div class="subtitle">{{ $t("main.subtitle") }}</div>
        <div class="content">{{ $t("main.content1") }}</div>
        <div class="content">{{ $t("main.content2") }}</div>
        <div class="content">{{ $t("main.content3") }}</div>
        <br>
        <button @click="$router.push('login')">{{ $t("main.startButton") }}</button>
      </div>
      <div v-if="authed">
        <img class="logo" width="250px" height="250px">
        <div class="search_bar">
        </div>
      </div>
    </div>
</template>

<script>
import apiClient from '@/services/api';

export default {
  name: "MainView",
  data() {
    return {
      authed: false,
    }
  },
  async mounted() {
    this.updateViewportHeight();
    window.addEventListener("resize", this.updateViewportHeight);
    try {
      await apiClient.get('/auth/session');
      this.authed = true;
    } catch(err) {
      this.authed = false;
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateViewportHeight);
  },
  methods: {
    updateViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
  }
}
</script>

<style scoped>
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