import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const vue = new Vue({
  router,
  store,
  mounted() {
    this.$children.forEach(child => {
      console.log(child.$options.__proto__)
    })
  },
  render: h => h(App)
}).$mount('#app')
