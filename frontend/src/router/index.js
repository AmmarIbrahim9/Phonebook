import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePageComponent from '../views/HomePageComponent.vue'; 

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'HomePageComponent',
    component: HomePageComponent 
  }
];

const router = new VueRouter({
  routes
});

export default router;
