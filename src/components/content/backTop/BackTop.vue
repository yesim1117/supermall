<template>
  <div class="back-top">
    <img src="~assets/images/common/top.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'BackTop'
}
</script>

<style>
  .back-top {
    position: fixed;
    right: 8px;
    bottom: 50px;
    z-index: 99;
  }
  .back-top img {
    width: 43px;
    height: 43px;
  }
</style>