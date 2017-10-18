import Vue from 'vue'
import Router from 'vue-router'  // 引入router路由
import Resource from 'vue-resource'  // 引入resource
import App from './App'

//引入组件
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';

import 'common/stylus/index.styl'

Vue.config.productionTip = false  //阻止 vue 在启动时生成生产提示
Vue.use(Router) // 使用router
Vue.use(Resource)  //全局注册
/* eslint-disable no-new */


// 定义路由
let routes = [
	{path: '/goods',component: goods}, 
	{path: '/ratings',component: ratings},
	{path: '/seller',component: seller}
 ]

// 实例化路由
let vueRouter =new Router({
  routes,

})

vueRouter.push('/goods');  //默认进入商品

new Vue({
  el: '#app',
  router: vueRouter,
  render: h => h(App)
})