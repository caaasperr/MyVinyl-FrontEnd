<template>
    <div class="login_page">
      <h2>{{ $t('login.title') }}</h2>
      <div class="login_container">
        <form class="login_form" @submit.prevent="login">
          <div class="pure-control-group">
            <label for="aligned-name">Username</label>
            <input
              id="aligned-name"
              type="text"
              v-model="loginData.Username"
              :placeholder="$t('login.username')"
              required
            />
          </div>
          <div class="pure-control-group">
            <label for="aligned-name">Password</label>
            <input
              type="password"
              v-model="loginData.Password"
              :placeholder="$t('login.password')"
              required
            />
          </div>
          <a href="/reset_password">{{ $t('login.forgot_password') }}</a>
          <div class="pure-controls">
            <button type="submit" class="pure-button">{{$t('login.submit')}}</button>
        </div>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
        <p>{{$t('login.donthaveaccount')}} <a href="/signup">{{$t('login.signup')}}</a></p>
      </div>
    </div>
  </template>
  
<script>
import apiClient from '@/services/api';

export default {
  name: "LoginComp",
  data() {
    return {
      loginData: {
        Username: '',
        Password: '',
      },
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await apiClient.post('/auth/login', this.loginData);
        if (response.status === 200) {
            const { token } = response.data["session_id"];
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', this.loginData.Username);
            this.$router.push('/');
        }
      } catch (error) {
        this.errorMessage = this.$t('login.error.login_default');
      }
    },
  },
};
</script>
  
<style scoped>

.login_page {
  flex: 1;
  padding: 150px;
}

.login_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login_form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>