<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/index'
  import Tab from 'components/tab/index'
  export default {
    components: {
      MHeader,
      Tab
    }
  }
</script>

<style lang="stylus" scoped>
  @import "common/stylus/variable"
</style>
