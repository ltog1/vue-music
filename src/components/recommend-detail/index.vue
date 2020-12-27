<template>
  <transition appear name="slide">
    <music-list :songs="songs" :title="disc.name" :bgImage="disc.icon"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/index'
  import { mapGetters } from 'vuex'
  import { getSongList } from 'api/recommend'
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
  export default {
    name: "index",
    components: {
      MusicList
    },
    data() {
      return {
        songs: []
      };
    },
    computed: {
      ...mapGetters([
        'disc'
      ]),
    },
    created() {
      this.getSongList();
    },
    methods: {
      getSongList() {
        let discId = this.disc.id;
        if (!discId) {
          this.$router.push('/recommend');
          return ;
        }
        getSongList(discId).then(res => {
          processSongsUrl(this.normalizeSongs(res.songlist)).then(songs => {
            this.songs = songs;
          })
        })
      },
      normalizeSongs(list) {
        let result = [];
        list.forEach(musicData => {
          if (musicData.songid && musicData.albumid) {
            if (isValidMusic(musicData)) {
              result.push(new createSong(musicData));
            }
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