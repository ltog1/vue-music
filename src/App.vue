<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player />
  </div>
</template>

<script>
  import MHeader from 'components/m-header/index'
  import Tab from 'components/tab/index'
  import Player from 'components/palyer/index'
  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style lang="stylus" scoped>
  @import "common/stylus/variable"
</style>
