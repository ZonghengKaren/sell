<template>
  <div class="header">
     <div class="content-wrapper">
     	<div class="avatar">
     		<img v-bind:src="seller.avatar" width="64" height="64"/>
     	</div>
     	<div class="content">
     		<div class="title">
     			<span class="brand"></span>
     			<span class="name">{{seller.name}}</span>
     		</div>
     		<div class="description">
     			<p><span>{{seller.description}}</span>/<span>{{seller.deliveryTime}}分钟送达</span></p>
     		</div>
     		<div v-if="seller.supports" class="support">
     			<span class="icon" v-bind:class="classMap[seller.supports[0].type]"></span>
     			<span class="text">{{seller.supports[0].description}}</span>	
     		</div>
     	</div>
      <div v-if="seller.supports" class="support-count" v-on:click="detailShow=true">
        <span>{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
     </div>  
     <div class="bulletin-wrapper" @click="detailShow=true">
       <span class="bulletin-icon"></span><span class="bulletin-text">{{seller.bulletin}}</span>
       <i class="icon-keyboard_arrow_right"></i>
     </div>
     <div class="heder-bg">
        <img v-bind:src="seller.avatar" width="100%" height="auto"/>
     </div>
     <transition name="fade">
       <div v-show="detailShow" class="support-detail">
           <div class="detail-wrapper clearfix">
             <div class="detail-main">
                <h1 class="name">{{seller.name}}</h1>
                <div class="star-wrapper">
                  <v-star :size="48" :score="seller.score"></v-star>
                </div>
                <div class="title">
                  <div class="line"></div>
                  <div class="text">优惠信息</div>
                  <div class="line"></div>
                </div>
                <ul class="supports-list" v-if="seller.supports">
                   <li v-for="(item,index) in seller.supports">
                     <span class="icon" :class="classMap[item.type]"></span>
                     <span class="text" v-text="item.description"></span>
                   </li>
                </ul>
                <div class="title">
                  <div class="line"></div>
                  <div class="text">商家公告</div>
                  <div class="line"></div>
                </div>
                <div class="bulletin-detail">
                  <p>{{seller.bulletin}}</p>
                </div>
             </div>
           </div>
           <div class="detail-close" @click="detailShow=false">
              <span class="icon-close"></span>
           </div>
       </div>
     </transition>
  </div>
</template>

<script>
import star from 'components/star/star.vue'
export default {
  data (){
    return{
       classMap: ['decrease','discount','guarantee','invoice','special'],
       detailShow: false
    }
  },
  props: {
  	//获取父元素传过来的值
  	seller: {
  	  type: Object
  	}
  },
  created() {
    /*this.classMap=['decrease','discount','guarantee','invoice','special']*/
  },
  components:{
     'v-star':star
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .header
   	color:#FFF
   	position:relative
    background-color:rgba(7,17,27,0.5)
   	.content-wrapper
   	   font-size:0
   	   padding:24px 12px 18px 24px
       position:relative
       .avatar
          display:inline-block
          vertical-align:top
          border-radius:2px
          overflow:hidden 
       .content
          display:inline-block
          vertical-align:top
          margin-left:16px
          font-size:14px
          .title
            padding:2px 0px 8px 0px
            .brand
              display:inline-block
              vertical-align:top
              width:30px
              height:18px
              bg-image("brand")
              background-size: 30px 18px
              background-repeat: no-repeat
            .name
              margin-left:6px;
              font-size: 16px
              line-height:18px
              font-weight:bold
          .description
            margin:0px 0px 10px 0px
            font-size:12px
            line-height:12px
          .support
            font-size:10px
            line-height:12px
            .icon
              display:inline-block
              width:12px
              height:12px
              vertical-align:top
              margin-right:4px
              background-size:12px 12px
              background-repeat:no-repeat
              &.decrease
                bg-image('decrease_1')
              &.discount
                bg-image('discount_1')
              &.guarantee
                bg-image('guarantee_1')
              &.invoice
                bg-image('invoice_1')
              &.special
                bg-image('special_1')  
       .support-count
         position:absolute
         right:12px
         bottom:18px
         background-color:rgba(0,0,0,0.2)
         padding:0px 8px
         height:24px
         line-height:24px
         border-radius:14px	
         font-size:10px
         .icon-keyboard_arrow_right
           line-height:24px
           padding-left:2px
    .bulletin-wrapper
      position:relative
      height:28px
      line-height:28px
      background-color:rgba(7,17,27,0.2)
      padding:0px 22px 0px 12px
      overflow:hidden
      white-space: nowrap
      text-overflow: ellipsis 
      .bulletin-icon
        display:inline-block
        vertical-align:middle
        width:22px
        height:12px
        bg-image('bulletin')
        background-size:22px 12px
        background-repeat:no-repeat
        margin-right:4px
      .bulletin-text
        vertical-align:middle
        font-size:10px
        margin:0px 4px
      .icon-keyboard_arrow_right
        position:absolute
        font-size:12px
        right:12px
        top:50%
        margin-top:-6px
        color:red   
    .heder-bg
      position:absolute
      left:0px
      top:0px
      z-index:-1
      width:100%
      height:100%
      overflow:hidden
      filter:blur(10px)
    .support-detail
      position: fixed
      top:0px
      left:0  
      z-index:100
      width:100%
      height:100%
      overflow:auto
      backdrop-filter: blur(10px)
      opacity: 1
      background: rgba(7, 17, 27, 0.8)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        left:100%
        background: rgba(7, 17, 27, 0)
      .detail-wrapper
        min-height:100%
        .detail-main
          padding:64px 32px
          .name
            font-size:16px
            line-height:16px
            font-weight:700
            text-align:center
          .star-wrapper
            text-align:center
            padding:16px 0px 28px 0px
          .title
            display:flex
            margin-bottom:24px
            .line
              flex:1
              border-bottom:1px solid rgba(255,255,255,0.2)
              position:relative
              top:-6px
            .text
              padding:0px 12px
              font-weight:700
              font-size:14px
          .supports-list
            margin-bottom:28px
            &>li
              padding:0px 12px
              margin-bottom:12px
              font-size:0
              &:last-child
                margin-bottom:0px
              .icon
                display:inline-block
                vertical-align:middle
                width:16px
                height:16px
                background-size:100% auto
                background-repeat:no-repeat
                margin-right:6px
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                font-size:12px
                vertical-align:middle
                line-height:16px;
          .bulletin-detail
            &>p
              font-size:12px
              line-height:24px
              padding:0px 12px
      .detail-close
        position:relative
        margin:-64px auto 0px auto
        width:32px
        height:32px
        clear:both
        font-size:32px
</style>