<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="foodscroll">
       <div class="food-content">
          <div class="image-header">
            <img :src="food.image" width="100%" height="auto">
            <div class="back" @click.stop.prevent="hide">
              <i class="icon-arrow_lift"></i>
            </div>   
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartjoin-wrapper">
              <v-cartcontrol :food="food" @add="addFood"></v-cartcontrol>
              <span class="cartjoin" @click.stop.prevent="cartjoin" v-show="!food.count">加入购物车</span>
            </div>
          </div>
          <v-split v-if="food.info"></v-split>
          <div class="info-wrapper"  v-if="food.info">
            <h2 class="info-title">商品介绍</h2>
            <p class="info">{{food.info}}</p>
          </div>
          <v-split></v-split>
          <div class="ratings-wrapper">
            <h2 class="title">商品评价</h2>
            <v-ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></v-ratingselect>
            <div class="rating-container">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-for="rating in food.ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px">
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                  </p>
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                  </div>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
       </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'; //滑动插件
import cartcontrol from 'components/cartcontrol/cartcontrol.vue'; //添加购物车按钮组件
import split from 'components/split/split.vue'; //分割线组件
import ratingselect from 'components/ratingselect/ratingselect.vue'; //商品评论按钮组件
import {formatDate} from 'common/js/date'; //时间格式化插件
const ALL = 2;
export default {
  data (){
    return{
      classMap: ['decrease','discount','guarantee','invoice','special'],
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc:{
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
    }
  },
  props:{
  	//获取父元素传过来的值
  	food: {
  	  type: Object
  	}
  },
  computed:{

  },
  created() {
     
   },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodscroll, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() { //隐藏商品介绍页面
      this.showFlag = false;
    },
    cartjoin:function(event){ //添加第一个
      if (!event._constructed) {
          return;
        }
      this.$set(this.food, 'count', 1); 
      
    },
    addFood(target) { //产品详情页小球动画
        this.$emit('add', target); //向父元素传值
    },
    selectRating(type) { //评论切换（全屏、满意、不满意）
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
    },
    toggleContent() { //评论切换（只显示有内容）
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
    },
    needShow(type, text) { //评论条件筛选
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
  }
 },
 filters: {
    formatDate:function(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
 },
 components:{
 	'v-cartcontrol':cartcontrol,
  'v-split':split,
  'v-ratingselect':ratingselect
 }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
    .food
      position:fixed
      top:0px
      left:0px
      bottom:48px
      z-index:30
      width:100%
      background-color:#FFF
      transform: translate3d(0, 0, 0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.2s linear
      &.move-enter, &.move-leave-active
        transform: translate3d(100%, 0, 0)
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back
          position:absolute
          top:0px
          left:0px
          padding:10px
          font-size:16px
          color:#00a0dc
      .content
        position:relative
        margin:18px
        .title
          padding-bottom:8px
          font-size:14px
          font-weight:700
          line-height:14px
          color:rgb(7,17,27)
        .detail
          padding-bottom:18px
          color:rgb(147,153,159)
          line-height:10px
          font-size:10px
          span
            padding-right:10px
        .price
          line-height:18px
          font-size:12px
          .now
              color:rgb(240,20,20)
              padding-right:8px
              font-weight:700
            .old
              color:rgb(147,153,159)
              text-decoration:line-through
              font-weight:700
        .cartjoin-wrapper
          position:absolute
          width:86px
          right:0px
          bottom:-12px
          .cartjoin
            display:block
            width:100%
            position:absolute
            left:0px
            top:0px
            height:30px
            line-height:30px
            color:#FFF
            background-color:#00a0dc
            font-size:10px
            border-radius:12px
            text-align:center
            box-sizing:border-box
      .info-wrapper
        padding:18px
        .info-title
          line-height:14px
          font-size:14px
          padding-bottom:6px
          color:rgb(7,17,27)
        .info
          font-size:12px
          line-height:24px
          padding:0px 8px 
          color:rgb(77,85,93) 
      .ratings-wrapper
        padding-top:18px 
        .title
          margin-left:18px
          line-height:14px
          font-size:14px
          padding-bottom:6px
          color:rgb(7,17,27)
        .rating-container
          padding: 0 18px
          .rating-item
            position: relative
            padding: 16px 0
            border-1px-bottom(rgba(7, 17, 27, 0.1))
            .time
              margin-bottom: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
            .text
              line-height: 16px
              font-size: 12px
              color: rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                margin-right: 4px
                line-height: 16px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .icon-thumb_down
                color: rgb(147, 153, 159)
            .user
              position: absolute
              right: 0
              top: 16px
              line-height: 12px
              font-size: 0
              .name
                display: inline-block
                margin-right: 6px
                vertical-align: top
                font-size: 10px
                color: rgb(147, 153, 159)
              .avatar
                border-radius: 50%
          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147, 153, 159)           	   	 		
</style>