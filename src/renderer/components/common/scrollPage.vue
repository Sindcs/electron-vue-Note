<template>
  <div class="fileScrollCon themeSkin-scrollBack" ref="scrollDom" @scroll="scrollFunc">
    <slot name="scrollContent"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: ['isGettingData', 'isLoad', 'isWheel'],
    methods: {
      scrollFunc () {
        this.$nextTick(() => {
          if (this.isLoad === false) {
            let dom = this.$refs.scrollDom
            let scrollH = dom.scrollHeight
            let scrollT = dom.scrollTop
            let divH = dom.clientHeight
            if ((scrollH - (scrollT + divH) < 3) || (scrollH - (scrollT + divH) < -3)) {
              if (!this.isGettingData) {
                this.$emit('scrollGetData')
              }
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fileScrollCon{
    display: -webkit-flex;
    -webkit-flex: 1;
    width:100%;
    padding: 0;
    overflow-x: hidden;
    overflow-y:auto;
    box-sizing: border-box;
    -webkit-flex-direction: column;
    background: linear-gradient(white 15px, hsla(0,0%,100%,0)) 0 0 / 100% 50px,
    radial-gradient(at top, rgba(132,160,123,0.3), transparent 70%) 0 0 / 100% 15px,
    linear-gradient(to top, white 15px, hsla(0,0%,100%,0)) bottom / 100% 50px,
    radial-gradient(at bottom, rgba(132,160,123,0.3), transparent 70%) bottom / 100% 15px;
    background-repeat: no-repeat;
    background-attachment: local, scroll, local, scroll;
  }
</style>
