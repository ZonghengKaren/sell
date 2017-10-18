<template>
  <div>
	  <div class="goods">
	     <div class="menu-wrapper" ref="menuWrapper">
	     	<ul>
	     		<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
	     			<span class="text border-1px">
	     				<span class="icon" v-if="item.type>-1" :class="classMap[item.type]"></span>{{item.name}}
	     		    </span>
	     		</li>
	     	</ul>
	     </div>
	     <div class="foods-wrapper" ref="foodsWrapper">
	     	<ul>
	     		<li v-for="item in goods" class="food-list" ref="foodList">
	     			<h2 class="title">{{item.name}}</h2>
	     			<ul class="food-ul">
	     				<li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
	     					<div class="icon">
	     						<img :src="food.icon" width="58" height="58"/>
	     					</div>
	     					<div class="content">
	     						<h3 class="name">{{food.name}}</h3>
	     						<p class="description" v-if="food.description">{{food.description}}</p>
	     						<p class="extra">
	     							<span>月售{{food.sellCount}}份</span>
	     							<span>好评率{{food.rating}}%</span>
	     						</p>
	     						<div class="price">
	     							<span class="now">￥{{food.price}}</span>
	     							<span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
	     						</div>
	     					</div>
	     					<div class="cartcontrol-wrapper">
	     						<v-cartcontrol :food="food" v-on:add="addFood"></v-cartcontrol>
	     					</div>
	     				</li>
	     			</ul>
	     		</li>
	     	</ul>
	     </div>
	     <v-shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></v-shopcart>
	  </div>
	  <v-food @add="addFood" :food="selectedFood" ref="food"></v-food>
  </div>
</template>

<script>

import BScroll from 'better-scroll'; //https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/installation.html#npm
import shopcart from 'components/shopcart/shopcart.vue'
import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
import food from 'components/food/food.vue'

const ERR_OK = 0;
const debug = process.env.NODE_ENV !== 'production';
export default {
  data (){
    return{
      classMap: ['decrease','discount','guarantee','invoice','special'],
      goods:[],
      listHeight:[],
      scrollY: 0,
      selectedFood: {}
    }
  },
  props:{
  	//获取父元素传过来的值
  	seller: {
  	  type: Object
  	}
  },
  computed:{
    currentIndex(){
    	for(let i=0;i<this.listHeight.length;i++){
    		let height1 = this.listHeight[i];
    		let height2 = this.listHeight[i+1];
    		if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            //this._followScroll(i);
            return i;
          }

    	}
    	return 0;
    },
    selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
  },
  created() {
      /*const url = debug ? '/api/goods' : 'http://ustbhuangyi.com/sell/api/goods';
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {  //操作demo
            this._initScroll();
            this._calculateHeight();
          });
        }
      });*/
   },
  mounted() {
    this.$nextTick(() => {
       this._goodsView();
    })
  },
  methods: {
   _goodsView(){
     const url = debug ? '/api/goods' : 'http://ustbhuangyi.com/sell/api/goods';
      this.$http.get('http://www.best-led-strip.com/upload/seller/data.php', {"id": this.seller.id}).then((response) => {
        response = response.body;
        //if (response.errno === ERR_OK) {
          this.goods = response.goods;
          this.$nextTick(() => {  //操作demo
            this._initScroll();
            this._calculateHeight();
          });
        //}
      });
   },
   _initScroll() {    //better-scroll
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });

        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3  //获取实时滚动的位置
        });

        this.foodsScroll.on('scroll', (pos) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
          if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y));//获取绝对值
          }
        });
     },
     _calculateHeight() { //把每个分类所占的高度存为数组
        let foodList = this.$refs.foodList;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu:function(index,event){  //点击左边栏目
        if (!event._constructed) {  //避免PC端操作2次
          return;
        }
        let foodList = this.$refs.foodList;
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      addFood(target) {
        this._drop(target);
      },
      _drop(target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target); //调取子组件shopcart里面的drop方法
        });
      },
      selectFood(food, event) { //产品详情页
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show(); //调取子组件的show()方法
      }
 },
 components:{
 	'v-shopcart': shopcart,
 	'v-cartcontrol': cartcontrol,
 	'v-food': food
 }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
    .goods
   	   display:flex
   	   position:absolute
   	   top:174px
   	   bottom: 48px
   	   width:100%
   	   overflow:hidden
   	   .menu-wrapper
   	      flex: 0 0 80px
   	   	  width:80px
   	   	  background-color:#F3F5F7
   	   	  .menu-item
   	   	  	display:table
   	   	  	width:56px
   	   	  	height:54px
   	   	  	color:rgb(7,17,27)
   	   	  	font-size:0
   	   	  	line-height:14px
   	   	  	padding:0px 12px
   	   	  	&.current
   	   	  		font-weight:700
   	   	  		position:relative
   	   	  		z-index:10
   	   	  		margin-top:-1px
   	   	  		background-color:#FFF
   	   	  		.text
   	   	  		  border-none()
   	   	  	.text
            	display:table-cell
            	font-size:12px
            	vertical-align:middle
            	border-1px-bottom(rgba(7,17,27,0.1))
            	.icon
	              display:inline-block
	              width:12px
	              height:12px
	              vertical-align:top
	              margin-right:2px
	              background-size:12px 12px
	              background-repeat:no-repeat
	              &.decrease
	                bg-image('decrease_3')
	              &.discount
	                bg-image('discount_3')
	              &.guarantee
	                bg-image('guarantee_3')
	              &.invoice
	                bg-image('invoice_3')
	              &.special
	                bg-image('special_3') 
   	   .foods-wrapper
   	   	 flex:1
   	   	 .title
   	   	 	height:26px
   	   	 	line-height:26px
   	   	 	color:rgb(147,153,159)
   	   	 	font-size:12px
   	   	 	background-color:#F3F5F7
   	   	 	padding-left:14px
   	   	 	border-left:2px solid #D9DDE1
   	   	 	font-weight:600
   	   	 .food-item
   	   	 	display:flex
   	   	 	position:relative
   	   	 	margin:0 18px
   	   	 	padding:18px 0
   	   	 	border-1px-bottom(rgba(7,1,27,0.1))
   	   	 	&:last-child
   	   	 		border-none()
   	   	 	.icon
   	   	 		flex: 0 0 58px
   	   	 		width:58px
   	   	 		margin-right:10px
   	   	 	.content
   	   	 		flex:1
   	   	 		.name
   	   	 			font-size:14px
   	   	 			line-height:14px
   	   	 			color:rgb(7,17,27)
   	   	 			padding:2px 0px 8px 0px
   	   	 		.description,.extra
   	   	 			font-size:10px
   	   	 			line-height:12px
   	   	 			color:rgb(147,153,159)
   	   	 			padding-bottom:8px
   	   	 		.extra
   	   	 			color:rgb(7,17,27)
   	   	 			&>span:first-child
   	   	 				padding-right:12px
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
   	   	 	.cartcontrol-wrapper
   	   	 		position:absolute
   	   	 		right:-6px
   	   	 		bottom:12px
</style>