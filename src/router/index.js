import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import EventMark from '../views/EventMark.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/mark',
    name: 'EventMark',
    component: EventMark
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
