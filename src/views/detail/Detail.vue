<template>
  <div id="detail">
    <detail-nav-bar ref="nav" class="detail-nac" @titleClick="titleClick"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommendInfo" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" class="back-top"></back-top>
    <detail-bootom-bar @addToCart="addToCart" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailBootomBar from './childComps/DetailBootomBar'
import DetailCommentInfo from './childComps/DetailCommentInfo'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from "components/content/goods/GoodsList"

import {backTopMixin} from 'common/mixin'

import {getDetali, getRecommendData, Goods, Shop, GoodsParam} from 'network/detail'
import { debounce } from '../../common/utils'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailBootomBar,
    DetailCommentInfo,
    GoodsList
  },
  mixins: [backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommendInfo: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    }
  },
  created() {
    // 保存传入的iid
    this.iid = this.$route.params.iid
    // 根据iid请求详情数据
    getDetali(this.iid).then(res => {
      const data = res.result
      // 获取顶部的图片轮播数据
      this.topImages = res.result.itemInfo.topImages
      // 获取商品详细信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 获取店铺信息
      this.shop = new Shop(data.shopInfo)
      // 保存商品的详细数据
      this.detailInfo = data.detailInfo
      // 获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 获取评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      // 获取推荐数据
      getRecommendData().then(res => this.recommendInfo = res.data.list)
    })
    // 防抖操作
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    }, 100)
  },
  // destroyed() {
  //   this.$bus.$off('itemImgLoad', this.itemImgListener)
  // },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index]+50, 200)
    },
    contentScroll(position) {
      // 获取Y值
      const positionY = -position.y
      // 与内容进行对比
      let length = this.themeTopYs.length
      for(let i = 0;i < length;i++){
        if (this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopYs[i] && 
        positionY < this.themeTopYs[i+1]) || (i === length -1 && positionY >= this.themeTopYs[i])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
    addToCart() {
      // 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.newPrice
      product.iid = this.iid

      // 将商品添加到购物车里
      // this.$store.commit('addCart', product)
      this.$store.dispatch('addCart', product)
    }
   }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nac {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 58px);
  }
  .back-top {
    position: fixed;
    bottom: 56px;
  }
</style>