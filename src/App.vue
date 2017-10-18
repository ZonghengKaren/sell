<template>
  <div id="#app">
     <v-header v-bind:seller="seller"></v-header>
     <div class="tab border-1px">
        <div class="tab-item">
           <router-link to="/goods">商品</router-link>
        </div>
        <div class="tab-item">
           <router-link to="/ratings">评论</router-link>
        </div>
        <div class="tab-item">
           <router-link to="/seller">商家</router-link>
        </div>
     </div>
     <keep-alive>
        <router-view  v-bind:seller="seller" keep-alive></router-view>
     </keep-alive>
  </div>
</template>

<script>
import { urlParse } from 'common/js/util';
import header from 'components/header/header.vue'
const ERR_OK = 0;
const debug = process.env.NODE_ENV !== 'production';
export default {
  data() {
    return{
      seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
      }
    }
  },
  created() {
      const url = debug ? '/api/seller' : 'http://ustbhuangyi.com/sell/api/seller';
      this.$http.get('http://www.best-led-strip.com/upload/seller/data.php', {"id": this.seller.id}).then((response) => {
        response = response.body;
        ///if (response.errno===ERR_OK) {
           //this.seller=response.data;
         this.seller = Object.assign({}, this.seller, response.seller); //给对象扩展属性  主要时存储地址栏上的id
         //console.log(this.seller)
        //}
    });
  },
  components:{
     'v-header':header,
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
   @import './common/stylus/mixin.styl'
   .tab
     display:flex
     width:100%
     height: 40px
     line-height: 40px
     //border-bottom:1px solid rgba(7,1,27,0.1)
     border-1px-bottom(rgba(7,1,27,0.1))
     .tab-item
       flex:1
       text-align:center
       & > a     /*& 父元素*/
         display:block    
         font-size:14px
         color:rgb(77,85,93)  
       & .router-link-exact-active
         color:rgb(240,20,20)
     
</style>
