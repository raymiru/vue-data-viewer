<template>
  <div
    v-show="show"
    id="vue-data-viewer"
    ref="rdiv"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      top: `${top}px`,
      left: `${left}px`
    }"
  >
    <div class="resizers" ref="rs">
      <div ref="rtl" class="resizer-top-left"></div>
      <div class="resizer-top-right"></div>
      <div class="resizer-bottom-left"></div>
      <div class="resizer-bottom-right"></div>
      <div ref="rt" class="resizer-top"></div>
      <div ref="rr" class="resizer-right"></div>
      <div ref="rb" class="resizer-bottom"></div>
      <div ref="rl" class="resizer-left"></div>
    </div>
    <div :style="{ height: `${dragerH}px` }" ref="drager" class="drager">
      VCV
    </div>
    <MainView :width="width" :height="height - dragerH" />
  </div>
</template>

<script>
import MainView from './components/MainView'
export default {
  name: 'vue-data-viewer',
  components: { MainView },
  data() {
    return {
      show: false,
      dragerH: 30,
      width: this.w,
      height: this.h,
      top: this.t,
      left: this.l,
      eventTarget: '',
      widthLimit: 100,
      heightLimit: 100,
      dragging: false,
      deltaY: 0,
      deltaX: 0
    }
  },
  props: {
    w: Number,
    h: Number,
    t: Number,
    l: {
      type: Number,
      default: 0
    }
  },
  computed: {},
  methods: {
    maxElemWidth(side) {
      if (side === 'right') {
        return window.innerWidth - this.$refs.rdiv.offsetLeft
      } else if (side === 'left') {
        return this.$refs.rdiv.offsetLeft + this.width
      }
    },

    maxElemHeight(side) {
      if (side === 'top') {
        return this.$refs.rdiv.offsetTop + this.height
      } else if (side === 'bottom') {
        return window.innerHeight - this.$refs.rdiv.offsetTop - 1
      }
    },

    resize(evt) {
      const offsetLeft = this.$refs.rdiv.offsetLeft
      const offsetTop = this.$refs.rdiv.offsetTop

      const cornerHandler = (x, y) => {
        let nextW
        let nextH
        if (x === 'left') {
          nextW = this.width - (evt.clientX - this.$refs.rdiv.offsetLeft)
        } else {
          nextW = this.width + evt.clientX - (offsetLeft + this.width)
        }
        if (y === 'top') {
          nextH = this.height - (evt.clientY - this.$refs.rdiv.offsetTop)
        } else {
          nextH = this.height + evt.clientY - (offsetTop + this.height)
        }
        if (
          nextH > this.heightLimit &&
          nextW > this.widthLimit &&
          nextW < this.maxElemWidth(x) &&
          nextH < this.maxElemHeight(y)
        ) {
          if (y !== 'bottom') {
            this.top += evt.clientY - this.$refs.rdiv.offsetTop
          }
          if (x !== 'right') {
            this.left += evt.clientX - this.$refs.rdiv.offsetLeft
          }
          this.width = nextW
          this.height = nextH
        }
      }

      // const handler = a => {
      //   let next
      //   if (a === 'left') {
      //     next = this.width - (evt.clientX - offsetLeft)
      //   } else if (a === 'right') {
      //     next = this.width + evt.clientX - (offsetLeft + this.width)
      //   } else if (a === 'top') {
      //     next = this.height - (evt.clientY - this.$refs.rdiv.offsetTop)
      //   } else if (a === 'bottom') {
      //     next = this.height + evt.clientY - (offsetTop + this.height)
      //   }
      // }

      if (this.eventTarget === 'resizer-left') {
        const next = this.width - (evt.clientX - offsetLeft)
        if (next > this.widthLimit && next < this.maxElemWidth('left')) {
          this.left += evt.clientX - offsetLeft
          this.width = next
        } else if (next < this.widthLimit) {
          this.left = this.left + (this.width - this.widthLimit)
          this.width = this.widthLimit
        } else if (next >= this.maxElemWidth('left')) {
          this.width = this.width + offsetLeft
          this.left = 0
        }
      } else if (this.eventTarget === 'resizer-right') {
        const next = this.width + evt.clientX - (offsetLeft + this.width)
        if (next > this.widthLimit && next < this.maxElemWidth('right'))
          this.width = next
      } else if (this.eventTarget === 'resizer-top') {
        const next = this.height - (evt.clientY - this.$refs.rdiv.offsetTop)
        if (next > this.heightLimit && next < this.maxElemHeight('top')) {
          this.top += evt.clientY - offsetTop
          this.height -= evt.clientY - offsetTop
        }
      } else if (this.eventTarget === 'resizer-bottom') {
        const next = this.height + evt.clientY - (offsetTop + this.height)
        if (next > this.heightLimit && next < this.maxElemHeight('bottom'))
          this.height = next
      } else if (this.eventTarget === 'resizer-top-left') {
        cornerHandler('left', 'top')
      } else if (this.eventTarget === 'resizer-bottom-left') {
        cornerHandler('left', 'bottom')
      } else if (this.eventTarget === 'resizer-top-right') {
        cornerHandler('right', 'top')
      } else if (this.eventTarget === 'resizer-bottom-right') {
        cornerHandler('right', 'bottom')
      }
    },

    stopResize() {
      window.removeEventListener('mousemove', this.resize, false)
    },

    resizeInit(evt) {
      evt.preventDefault()
      this.eventTarget = evt.target.classList[0]
      window.addEventListener('mouseup', this.stopResize)
      window.addEventListener('mousemove', this.resize, false)
    },

    drag(evt) {
      const offsetTop = this.$refs.rdiv.offsetTop
      const offsetLeft = this.$refs.rdiv.offsetLeft
      if (!this.dragging) {
        this.deltaY = evt.clientY - offsetTop
        this.deltaX = evt.clientX - offsetLeft
        this.dragging = true
      }
      const nextT = this.top + evt.clientY - this.deltaY - offsetTop
      if (nextT > 0) this.top = nextT
      else this.top = 0
      this.left += evt.clientX - this.deltaX - offsetLeft
    },

    stopDrag() {
      window.removeEventListener('mousemove', this.drag, false)
      this.dragging = false
    },

    dragInit(evt) {
      evt.preventDefault()
      this.eventTarget = evt.target.classList[0]
      window.addEventListener('mouseup', this.stopDrag)
      window.addEventListener('mousemove', this.drag, false)
    }
  },

  mounted() {
    if (!this.left) {
      this.left = document.querySelector('html').clientWidth - this.width - 5
    }
    this.$refs.rs.addEventListener('mousedown', this.resizeInit, false)
    this.$refs.drager.addEventListener('mousedown', this.dragInit, false)
    window.addEventListener('keydown', key => {
      if (key.key === 'F2') {
        this.show = true
      }
    })
  }
}
</script>

<style lang="scss">
.hidden {
  display: none;
}
#vue-data-viewer {
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: rgba(1, 32, 37, 0.3);
}

.drager {
  background-color: rebeccapurple;
  width: 100%;
  cursor: move;
  color: white;
}

.resizers {
  > div {
    position: absolute;
  }
}

.resizer-top {
  width: 100%;
  height: 4px;
  top: -2px;
  left: 0;
  cursor: n-resize;
}
.resizer-right {
  top: 0;
  right: -2px;
  height: 100%;
  width: 4px;
  cursor: e-resize;
}

.resizer-bottom {
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 4px;
  cursor: n-resize;
}

.resizer-left {
  top: 0;
  left: -2px;
  height: 100%;
  width: 4px;
  cursor: e-resize;
}

.resizer-top-left {
  top: -3px;
  left: -3px;
  width: 7px;
  height: 7px;
  z-index: 2;
  cursor: nw-resize;
}

.resizer-top-right {
  top: -3px;
  right: -3px;
  width: 7px;
  height: 7px;
  z-index: 2;
  cursor: ne-resize;
}

.resizer-bottom-left {
  bottom: -3px;
  left: -3px;
  width: 7px;
  height: 7px;
  z-index: 2;
  cursor: ne-resize;
}

.resizer-bottom-right {
  bottom: -3px;
  right: -3px;
  width: 7px;
  height: 7px;
  z-index: 2;
  cursor: nw-resize;
}
</style>
