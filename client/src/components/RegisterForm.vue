<template>
  <div>
    <h3>Create an Account</h3>
    <form @submit.prevent="register" style="margin-top: 20px;">
      <div>
        <label for="email">Email:</label><br />
        <input
          type="email"
          v-model="email"
          id="email"
          required
        />
      </div>
      <div style="margin-top: 10px;">
        <label for="password">Password:</label><br />
        <input
          type="password"
          v-model="password"
          id="password"
          required
        />
      </div>
      <button type="submit" style="margin-top: 15px;">Register</button>
    </form>

    <div v-if="errorMessage" style="margin-top: 10px; color: red;">
      {{ errorMessage }}
    </div>
    <div v-if="success" style="margin-top: 10px; color: green;">
      Account created successfully!
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      success: false,
    };
  },
  methods: {
    async register() {
      this.errorMessage = '';
      this.success = false;

      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (response.ok) {
          this.success = true;
          this.email = '';
          this.password = '';
        } else {
          const data = await response.json();
          this.errorMessage = data.error || 'Something went wrong.';
        }
      } catch (error) {
        this.errorMessage = 'Failed to connect to server.';
        console.error(error);
      }
    },
  },
};
</script>
