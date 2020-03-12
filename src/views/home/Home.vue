<template>
  <div id="home">
    <!-- 首页导航 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" 
    @tabClick="tabClick" 
    ref="tabControl1" class="tab-control" v-show="isTabFixed" />
    <!-- 轮播图 -->
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <feature></feature>
      <tab-control :titles="['流行', '新款', '精选']" 
      @tabClick="tabClick" 
      ref="tabControl2" />
      <goods-list :goods="showGoos"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'

import HomeSwiper from './childComps/HomeSwiper'
import HomeRecommendView from './childComps/HomeRecommendView'
import Feature from './childComps/Feature'

import GoodsList from 'components/content/goods/GoodsList'
import TabControl from 'components/content/tabControl/TabControl'

import {getHomeMultidata, getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'
import {backTopMixin} from 'common/mixin'

export default {
  name: 'Home',
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommendView,
    Feature,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  // 组件创建完成
  created() {
    // 请求多个数据
    this.getHomeMultidata()
    
    // 请求分类商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  // 组件挂载完成
  mounted() {
    /**
     * 监听事件总线
     */
    // 图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 500)
    this.$bus.$on('itemImageLoad',() => {
      refresh()
    })
  },
  destroyed() {
    // console.log('home destroyed')
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    this.saveY = this.$refs.scroll.scroll.y
  },
  computed: {
    showGoos() {
      return this.goods[this.currentType].list
    }
  },
  methods: {
    /**
     * 事件监听相关
     */
    tabClick(index) {
      switch(index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    contentScroll(position) {
      // 判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000
      // 判断tabControl是否吸顶 (position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // 获取tabControl的offsetTop
      // 组件属性$el 用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    /**
     * 网络请求相关
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        //完成上拉加载
        this.$refs.scroll.finishPullUp()
      })
    }
  },
}
</script>

<style scoped>
  #home {
    position: relative;
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;
  }
  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .tab-control {
    position: relative;
    z-index: 99;
  }
</style>