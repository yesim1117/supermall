// 混入
import BackTop from 'components/content/backTop/BackTop'
export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      // 判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000
    },
  },
}