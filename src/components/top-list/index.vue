<template>
  <transition appear name="slide">
    <music-list :rank="rank" :songs="songs" :title="topList.name" :bgImage="icon"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/index'
  import { mapGetters} from 'vuex'
  import { getMusicList } from 'api/rank'
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

  export default {
    name: "index",
    components: {
      MusicList
    },
    data() {
      return {
        songs: [],
        rank: true
      };
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      icon() {
        if (this.songs.length) {
          return this.songs[0].image;
        } else {
          return  ''
        }
      }
    },
    created() {
      this.getTopList();
    },
    methods: {
      getTopList() {
        let id = this.topList.id;
        if (!id) {
          this.$router.push('/rank');
          return ;
        }
        getMusicList(id).then(res => {
          processSongsUrl(this.normalizeSongs(res)).then(songs => {
            this.songs = songs;
          })
        });
      },
      normalizeSongs(list) {
        let result = [];
        list.forEach(musicData => {
          if (isValidMusic(musicData.data)) {
            result.push(new createSong(musicData.data));
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