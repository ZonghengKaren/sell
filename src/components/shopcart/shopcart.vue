<template>
  <div>
    <div class="shopcart">
      <div class="content">
         <div class="cotent-left" @click="toggleList">
           <div class="logo-wrapper">
             <div class="logo" :class="{'highlight':Totalcount>0}">
               <i class="icon-shopping_cart"></i>
             </div>
             <div class="num"  v-show="Totalcount>0">{{Totalcount}}</div>
           </div>
           <div class="price" :class="{'highlight':Totalcount>0}">￥{{TotalPrice}}</div>
           <div class="desc">
             另需配送费￥{{deliveryPrice}}元
           </div>
         </div>
         <div class="content-right">
           <div class="pay" :class="{'payClass':TotalPrice>=minPrice}"  @click.stop.prevent="pay"><!-- @click.stop.prevent 阻止事件冒泡或者系统默认事件-->
             {{payDesc}}
           </div>
         </div>
         <!--小球-->
         <div class="ball-container">
          <div v-for="ball in balls">
            <transition name="drop" @before-enter="beforeDrop($event)" @enter="dropping($event)" @after-enter="afterDrop($event)">
              <div class="ball" v-show="ball.show">
                <div class="inner inner-hook"></div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header clearfix">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border-1px" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol @add="addFood" :food="food"></v-cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script>

import BScroll from 'better-scroll'; //https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/installation.html#npm
import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
const ERR_OK = 0;
export default {
  data (){
    return{
      balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
      dropBalls: [],
      fold: true
    }
  },
  props:{
  	//获取父元素传过来的值
  	deliveryPrice: {
  	  type: Number,
      default:0
  	},
    minPrice: {
      type: Number,
      default:0
    },
    selectFoods:{
      type: Array,
      default: function () {
        return [{ 
          price: 10,
          count: 1 
        }]
      }
    }
  },
  computed:{
    //计算总价格
    TotalPrice:function(){
      let total = 0;
      this.selectFoods.forEach((food, index)=>{
         total+=food.price*food.count;    
      })
      return total;
    },
    Totalcount: function(){ //计算总数量
      let count = 0;
      this.selectFoods.forEach((food, index)=>{
         count+=food.count;    
      })
      return count;
    },
    payDesc: function(){
      if(this.TotalPrice===0){
        return `￥${this.minPrice}元起送`;
      }else if(this.TotalPrice<this.minPrice){
        let diff=this.minPrice-this.TotalPrice
        return `还差￥${diff}元起送`;
      }else{
        return '去结算';
      }
    },
    listShow: function() {
        if (!this.Totalcount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
  },
  created() {
   },
  methods: {
    drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el; // 保存ball.show=true的demo
            this.dropBalls.push(ball);
            return;
          }
        }
    },
    beforeDrop(el) { //点击时把小球先定位到点击位置
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {  //获取最后一个的等于true的小球
            let rect = ball.el.getBoundingClientRect(); //获取点击位置相对于视口的位置
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = 'block';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) { //小球从点击位置运动到购物车那里
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done); //告知动画结束了
        });
      },
      afterDrop(el) { //最后隐藏小球
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.Totalcount) {
          return;
        }
        this.fold = !this.fold;
      },
      hideList() {
        this.fold = true;
      },
      empty() {
        this.fold = true;
        let self=this;
        if (self && !self._isDestroyed) {
          setTimeout(() => {
             if (self && !self._isDestroyed)
                this.selectFoods.forEach((food) => {
                  food.count = 0;
              });
            }, 200);
        }
      },
      pay() {
        if (this.TotalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.TotalPrice}元`);
      },
      addFood(target) {
        this.drop(target);
      }
    },
    components:{
      "v-cartcontrol":cartcontrol
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
   	.shopcart
      position:fixed
      z-index:50
      left:0px
      bottom:0px
      width:100%
      height:48px
      .content
        display:flex
        background-color:#141d27
        height:100%
        .cotent-left
          flex:1
          font-size:0
          .logo-wrapper
            display:inline-block
            vertical-align:middle
            width:56px
            height:56px
            padding:6px
            background-color:#141d27
            position:relative
            left:12px
            top:-10px
            border-radius:50%
            box-sizing:border-box
            .logo
              width:100%
              height:100%
              border-radius:50%
              background-color:rgba(255,255,255,0.2)
              font-size:24px
              color:rgba(255,255,255,0.4)
              text-align:center
              line-height:44px
              &.highlight
                background: rgb(0, 160, 220)
                color:rgba(255,255,255,1)
            .num
              position: absolute
              top: 0
              right: 0
              width: 24px
              height: 16px
              line-height: 16px
              text-align: center
              border-radius: 16px
              font-size: 9px
              font-weight: 700
              color: #fff
              background: rgb(240, 20, 20)
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
          .price
            display:inline-block
            vertical-align:middle
            font-size:16px
            color:rgba(255,255,255,0.4)
            line-height:24px
            padding:0 12px 0px 18px
            box-sizing:border-box
            font-weight:700
            border-right:1px solid rgba(255,255,255,0.4)
            margin-bottom:4px
            &.highlight
              color: #fff
          .desc
            display:inline-block
            vertical-align:middle
            font-size:12px
            color:rgba(255,255,255,0.4)
            line-height:24px
            padding:0 12px 0px 18px
            box-sizing:border-box
            font-weight:700
            margin-bottom:4px
        .content-right
          flex:0 0 105px
          width:105px
          background-color:rgba(255,255,255,0.4)
          .pay
            height:48px
            line-height:48px
            font-size:16px
            color:rgba(255,255,255,0.4)
            font-weight:700
            text-align:center
            &.payClass
              background: #00b43c
              color: #fff
        .ball-container
          .ball
            position: fixed
            left: 32px
            bottom: 22px
            z-index: 200
            transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41) /*y贝赛尔曲线 http://cubic-bezier.com/*/
            .inner
              width: 16px
              height: 16px
              border-radius: 50%
              background: rgb(0, 160, 220)
              transition: all 0.4s linear	
      .shopcart-list
        position: absolute
        left: 0
        top: 0
        z-index: -1
        width: 100%
        transform: translate3d(0, -100%, 0)
        &.fold-enter-active, &.fold-leave-active
          transition: all 0.5s
        &.fold-enter, &.fold-leave-active
          transform: translate3d(0, 0, 0)
        .list-header
          height: 40px
          line-height: 40px
          padding: 0 18px
          background: #f3f5f7
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          .title
            float: left
            font-size: 14px
            color: rgb(7, 17, 27)
          .empty
            float: right
            font-size: 12px
            color: rgb(0, 160, 220)
        .list-content
          padding: 0 18px
          max-height: 217px
          overflow: hidden
          background: #fff
          .food
            position: relative
            padding: 12px 0
            box-sizing: border-box
            border-1px-bottom(rgba(7, 17, 27, 0.1))
            .name
              line-height: 24px
              font-size: 14px
              color: rgb(7, 17, 27)
            .price
              position: absolute
              right: 90px
              bottom: 12px
              line-height: 24px
              font-size: 14px
              font-weight: 700
              color: rgb(240, 20, 20)
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 6px         		
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        backdrop-filter: blur(10px)
        opacity: 1
        background: rgba(7, 17, 27, 0.6)
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.5s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          background: rgba(7, 17, 27, 0)
</style>