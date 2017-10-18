<template>
  <div class="star" :class="starType">
     <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
const LENGTH=5;
const CLS_ON= 'on';
const CLS_HALF= 'half';
const CLS_OFF= 'off';

export default {
  data (){
    return{
    }
  },
  props: {
  	//获取父元素传过来的值
    size:{
      type: Number
    },
    score:{
      type: Number
    }
  },
  created() {
    
  },
  computed:{
    starType(){
      return 'star-' + this.size
    },
    itemClasses(){
      let classArray=[];
      let score = Math.floor(this.score*2)/2; //
      let hasDecimal= score%1 !==0;  //获取全星个数
      let integer = Math.floor(score); //获取半星个数
      for (let i=0;i<integer;i++){
        classArray.push(CLS_ON);
      }
      if(hasDecimal){
        classArray.push(CLS_HALF);
      }
      /*let offNum=LENGTH-integer-hasDecimal;
      if(offNum>0){
        for (let j=0;j<offNum;j++){
          console.log(offNum);
          classArray.push(CLS_OFF);
        }
      }*/
      while(classArray.length < LENGTH){
        classArray.push(CLS_OFF);
      }
      return classArray;
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .star
    font-size:0
    .star-item
      display:inline-block
      background-repeat:no-repeat
      background-size:100% auto
    &.star-48
      .star-item
        width:20px
        height:19px
        margin-right:20px
        &:last-child
          margin-right:0px
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width:15px
        height:15px
        margin-right:6px
        &:last-child
          margin-right:0px
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width:10px
        height:10px
        margin-right:3px
        &:last-child
          margin-right:0px
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
      
</style>