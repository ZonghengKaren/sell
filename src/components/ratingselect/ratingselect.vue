<template>
   <div class="ratingselect border-1px">
      <div class="ratigtype border-1px">
        <span class="desc positive" :class="{'active':selectType===2}" @click.stop.prevent="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
        <span class="desc positive" :class="{'active':selectType===0}" @click.stop.prevent="select(0,$event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
        <span class="desc negative" :class="{'active':selectType===1}" @click.stop.prevent="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
      </div>
      <div @click.stop.prevent="toggleContent" class="switch" :class="{'on':onlyContent}">
        <span class="icon-check_circle"></span>
        <span class="text">只看有内容的评价</span>
      </div>
   </div>
</template>
<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  data (){
    return{
      
    }
  },
  props:{
    ratings:{
        type: Array,
        default(){
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type:Boolean,
        default: false
      },
      desc:{
        type: Object,
        default(){
           return{
             all:'全部',
             positive:'满意',
             negative:'不满意'
         }
        }
      }
  },
  computed:{
    positives() { //数组过滤
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
    negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
  },
  methods:{
    select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('select', type);
      },
    toggleContent(event) {
      if (!event._constructed) {
        return;
      }
      this.$emit('toggle');
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl' 
    .ratingselect
       padding:18px
       padding-bottom:0px
       border-1px-bottom(rgba(7,17,27,0.1))
       .ratigtype
         padding-bottom:18px
         border-1px-bottom(rgba(7,17,27,0.1))
         font-size:0
         .desc
           display:inline-block
           vertical-align:middle
           padding:8px 12px
           font-size: 12px
           color:rgb(77,85,93)
           border-radius:1px
           margin-right:8px
           &.active
            color: #fff
           .count
            margin-left: 2px
            font-size: 8px
           &.positive
            background: rgba(0, 160, 220, 0.2)
            &.active
              background: rgb(0, 160, 220)
           &.negative
            background: rgba(77, 85, 93, 0.2)
            &.active
              background: rgb(77, 85, 93)	
       .switch
          padding: 12px 0px
          line-height: 24px
          color: rgb(147, 153, 159)
          font-size: 0
          &.on
            .icon-check_circle
              color: #00c850
          .icon-check_circle
            display: inline-block
            vertical-align: top
            margin-right: 4px
            font-size: 24px
          .text
            display: inline-block
            vertical-align: top
            font-size: 12px   	 		
</style>