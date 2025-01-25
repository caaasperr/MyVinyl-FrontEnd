<template>
    <div class="signup-page">
      <h2>{{$t('signup.title')}}</h2>
      <div class="signup_container">
        <form class="signup_form" @submit.prevent="signup">
          <div class="input_wrapper">
            <label>Username</label>
            <input
              type="text"
              v-model="signupData.Username"
              :placeholder="$t('signup.username')"
              required
            />
          </div>
          <div class="input_wrapper">
            <label>Password</label>
            <input
              type="password"
              v-model="signupData.Password"
              :placeholder="$t('signup.password')"
              required
            />
          </div>
          <div class="input_wrapper">
            <label style="margin: 0;">Confirm Password</label>
            <input
              type="password"
              v-model="confirmPassword"
              :placeholder="$t('signup.confirm')"
              required
            />
          </div>
          <button type="submit" class="submit">{{$t('signup.submit')}}</button>
          <p v-if="errorMessage" class="error-message">Error: {{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>

<script>
import apiClient from '@/services/api';

export default {
  name: "SignUpComp",
  data() {
    return {
      signupData: {
        Username: '',
        Password: '',
      },
      confirmPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    async signup() {
      try {
        if (this.signupData.Password.length < 8) {
          this.errorMessage = this.$t('signup.error.password_length');
          return
        }
        if (this.signupData.Password !== this.confirmPassword) {
          this.errorMessage = this.$t('signup.error.password_not_match');
          return
        }
        const response = await apiClient.post('/auth/signup', this.signupData);
        if (response.status === 201) {
          this.$router.push('/');
        }
      } catch (error) {
        this.errorMessage = this.$t('signup.error.default');
        console.error(error);
      }
    },
  },
};
</script>
  
<style scoped>

label {
    margin-right: 45px;
}

.signup-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 120px;
}

.input_wrapper {
  margin-bottom: 3px;
}

.signup_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.signup_form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.submit {
  margin-top: 20px;
  width: 150px;
}

</style>