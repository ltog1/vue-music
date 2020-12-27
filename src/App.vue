<!--
 * @Author: your name
 * @Date: 2020-12-25 22:58:21
 * @LastEditTime: 2020-12-26 17:43:22
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\music\src\App.vue
-->
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
