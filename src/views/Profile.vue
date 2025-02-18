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
        <p>{{ profile.Vinyls }}</p>
      </div>
      <div class="infoContainer">
        <h3>{{ $t("profile.shelvesTitle") }}</h3>
        <p>{{ profile.Shelves }}</p>
      </div>
    </div>
    <p><strong>{{ $t("profile.createdat") }}</strong> {{ profile.CreatedAt.split("T")[0] }}</p>
    <button @click="logOut" class="logout">{{ $t("profile.logout") }}</button>
    <button @click="isRemovingAccount = true;">{{ $t("profile.deleteaccount") }}</button>
  </div>
</div>
<modal v-if="isRemovingAccount" @close="isRemovingAccount = false">
  <template #header>
    <p>Removing vinyl</p>
  </template>
  <template #body>
    <p>Are you sure you want to delete your account?</p>
    <input type="password" placeholder="Password" class="modalInput">
  </template>
  <template #footer>
    <button @click="isRemovingAccount = false;" class="modalButton">Close</button>
    <button @click="deleteAccount();" class="modalButton right">Remove</button>
  </template>
</modal>
</template>
  
<script>
import apiClient from '@/services/api';
import Modal from '@/components/modal.vue'

export default {
  name: "ProfileComponent",
  data() {
    return {
      profile: null,
      isRemovingAccount: false,
    };
  },
  components: {
    Modal,
  },
  methods: {
    async getProfile() {
      try {
        const response = await apiClient.get('/user');
        this.profile = response.data;
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
    this.getProfile().then(() => {
      window.title = this.profile.Username + " - RecordBox"
    })
  }
};
</script>
  
<style scoped>
.modalButton {
  background-color: white;
  border: none;
  color: #2a2e32;
  width: 50%;
  border-right: 1px solid #2a2e32;
  height: 30px;
  font-weight: 700;
}

.modalButton.right {
  border-right: none;
  font-weight: 400;
}

.logout {
  margin: 10px;
}
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