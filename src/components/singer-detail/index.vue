<template>
  <transition appear name="slide">
    <music-list :songs="songs" :title="singer.name" :bgImage="singer.icon"></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import { createSong,isValidMusic,processSongsUrl } from 'common/js/song'
  import MusicList from 'components/music-list/index'
  export default {
    name: "index",
    components: {
      MusicList
    },
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    data() {
      return {
        songs: []
      };
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        let id = this.singer.id;
        if (!id) {
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(id).then(res => {
          processSongsUrl(this.normalizeSongs(res.list)).then((songs) => {
            this.songs = songs;
          })
        })
      },
      // 序列化歌手详情数据
      normalizeSongs(list) {
        let result = [];
        list.forEach(item => {
          let { musicData } = item;
          if (isValidMusic(musicData)) {
            result.push(new createSong(musicData));
          }
        });
        return result;
      }
    }
  }
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all .5s

  .slide-leave-to, .slide-enter
    transform translate3d(100%,0,0)
</style>