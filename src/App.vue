<template>
  <Header></Header>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css" integrity="sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls" crossorigin="anonymous">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue" rel="stylesheet">
  <!--<img alt="Vue logo" src="./assets/logo.png">2c3e50-->
  <router-view />
</template>

<script>
import Header from "./components/common/Header.vue"
export default {
  name: 'App',
  components: {
    Header
  },
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
button {
  background-color: transparent;
  border: 1px solid #2a2e32;
  padding: 5px;
  color: #2a2e32;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2a2e32;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}
</style>
