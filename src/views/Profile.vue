<template>
    <div class="profile">
      <div v-if="profile">
        <h1>{{ profile.Username }}</h1>
        <div class="infoTitle">
          {{ $t("profile.informationTitle") }}
        </div>
        <div class="infoWrapper">
          <div class="infoContainer">
            <h3>{{ $t("profile.vinylTitle") }}</h3>
            <p>13</p>
          </div>
          <div class="infoContainer">
            <h3>{{ $t("profile.shelvesTitle") }}</h3>
            <p>13</p>
          </div>
        </div>
        <p><strong>{{ $t("profile.createdat") }}</strong> {{ profile.CreatedAt.split("T")[0] }}</p>
        <button @click="logOut">{{ $t("profile.logout") }}</button>
        <button @click="deleteAccount">{{ $t("profile.deleteaccount") }}</button>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '@/services/api';
  
  export default {
    name: "ProfileComponent",
    data() {
      return {
        profile: null,
      };
    },
    methods: {
      async getProfile() {
        try {
          const response = await apiClient.get('/user');
          this.profile = response.data;
          console.log(response)
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },
      async logOut() {
        try {
          const response = await apiClient.post('/auth/logout');
          if (response.status === 200) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            this.$router.push('/');
          }
        } catch (error) {
          console.error('Error logout:', error);
        }
      },
      async deleteAccount() {
        try {
          const response = await apiClient.delete('/user');
          if (response.status === 200) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            this.$router.push('/');
          }
        } catch (error) {
          console.error('Error logout:', error);
        }
      }
    },
    created(){
      this.getProfile()
    }
  };
  </script>
  
  <style scoped>
  .profile {
    width: 500px;
    margin: 0 auto;
    margin-top: 50px;
  }
  .infoTitle {
    margin: 0 auto;
  }
.infoWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.infoContainer {
  margin: 15px;
}
</style>