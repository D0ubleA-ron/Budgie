import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import RegisterForm from '../components/RegisterForm.vue'
import PlaidLink from '../components/PlaidLink.vue'
import AccountInfo from '../components/AccountInfo.vue'
import Logout from '../components/Logout.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: RegisterForm },
  { path: '/plaid', name: 'PlaidLink', component: PlaidLink },
  { path: '/account', name: 'AccountInfo', component: AccountInfo },
  { path: '/logout', name: 'Logout', component: Logout },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
