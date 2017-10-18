<template>
  <div class="cartcontrol">
     <transition name="move">
       <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
         <i class="icon-remove_circle_outline"></i>
       </div>
     </transition>
     <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
     <div class="cart-add" @click.stop.prevent="addCart($event)">
       <i class="icon-add_circle"></i>
     </div>
  </div>
</template>

<script>

export default {
  data (){
    return{
    }
  },
  props: {
  	//获取父元素传过来的值
    food:{
      type: Object
    }
  },
  created() {
    
  },
  computed:{
    
  },
  methods:{
    addCart:function(event){
      if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          this.$set(this.food, 'count', 1); //创建新的
        } else {
          this.food.count++;
        }
      this.$emit('add', event.target); //向父元素传对象（当前点击的） event.target直接接受事件的目标DOM元素
      /*let pos =event.target.getBoundingClientRect();
      console.log(pos.left)*/
    },
    decreaseCart:function(event){
      if (!event._constructed) {
          return;
        }
      if(this.food.count>0){
        this.food.count--;
      }else{
        this.food.count=0;
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .cartcontrol
    font-size:0
    .cart-decrease,.cart-add
      display:inline-block
      vertical-align:middle
      padding:6px
      font-size:24px
      line-height:24px
      color:#00a0dc
    .cart-decrease
      opacity:1
      transform: translate3D(0,0,0) rotate(0deg)
      &.move-enter-active, &.move-leave-active
        transition: all 0.5s
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3D(24px,0,0) rotate(180deg)
    .cart-count
      display:inline-block
      vertical-align:middle
      line-height:24px
      font-size:12px
      color:rgb(147,153,159)
      font-weight:bold
</style>