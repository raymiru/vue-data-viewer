<template>
  <div
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="main-view"
  ></div>
</template>

<script>
import { Application, Container, Graphics } from 'pixi.js'
export default {
  name: 'main-view',
  props: {
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  data() {
    return {
      app: new Application({
        width: this.width,
        height: this.height,
        transparent: true,
        antialias: true
      }),
      stage: {
        mousedown: {
          x: 0,
          y: 0,
          difference: {
            x: 0,
            y: 0
          }
        }
      }
    }
  },
  mounted() {
    this.$el.appendChild(this.app.view)

    const container = new Container()
    container.width = this.width
    container.height = this.height
    this.app.stage.addChild(container)

    const gr = new Graphics()
    gr.beginFill(0x323212, 0.7)
    gr.drawCircle(0, 0, 32)
    gr.endFill()
    container.addChild(gr)
    gr.x = 0
    gr.y = 0

    const pr = gr.clone()
    pr.x = 200
    pr.y = 300
    container.addChild(pr)
    console.log('sssss')
    console.log(this.app.stage.pivot)

    pr.interactive = true
    pr.click = () => {
      console.log('dsdsdsd')
    }
    pr.pointerover = () => {
      this.app.renderer.plugins.interaction.cursorStyles.default = 'pointer'
      this.app.renderer.plugins.interaction.setCursorMode('pointer')
    }

    pr.pointerout = () => {
      this.app.renderer.plugins.interaction.cursorStyles.default = 'grab'
      this.app.renderer.plugins.interaction.setCursorMode('grab')
    }
    // this.app.stage.scale.set(0.5, 0.5)
    // this.app.stage.pivot.set(-this.width / 2, -100)

    this.app.stage.interactive = true
    this.app.renderer.plugins.interaction.cursorStyles.default = 'grab'

    this.app.renderer.plugins.interaction.on('mousedown', evt => {
      this.app.renderer.plugins.interaction.cursorStyles.default = 'grabbing'
      this.app.renderer.plugins.interaction.setCursorMode('grabbing')

      this.stage.mousedown.x = evt.data.global.x
      this.stage.mousedown.y = evt.data.global.y
      let pivotX = this.app.stage.pivot.x
      let pivotY = this.app.stage.pivot.y

      // this.app.stage.pivot.set( -evt.data.global.y)
      this.app.renderer.plugins.interaction.on('mousemove', evt => {
        this.stage.mousedown.difference.x =
          this.stage.mousedown.x - evt.data.global.x
        this.stage.mousedown.difference.y =
          this.stage.mousedown.y - evt.data.global.y
        // console.log(this.stage.mousedown.difference.x)
        // console.log(this.stage.mousedown.difference.y)

        this.app.stage.pivot.set(
          pivotX + this.stage.mousedown.difference.x,
          pivotY + this.stage.mousedown.difference.y
        )
      })
      this.app.renderer.plugins.interaction.on('mouseup', () => {
        this.app.renderer.plugins.interaction.removeListener('mousemove')
        this.app.renderer.plugins.interaction.cursorStyles.default = 'grab'
        this.app.renderer.plugins.interaction.setCursorMode('grab')
      })
      this.app.renderer.plugins.interaction.on('mouseout', () => {
        this.app.renderer.plugins.interaction.removeListener('mousemove')
        this.app.renderer.plugins.interaction.cursorStyles.default = 'grab'
        this.app.renderer.plugins.interaction.setCursorMode('grab')
      })
    })
  },
  watch: {
    width(w) {
      this.app.view.width = w
      // this.app.stage.pivot.set(-w / 2, -100)
    },
    height(h) {
      this.app.view.height = h
      // this.app.stage.pivot.set(-this.width / 2, -100)
    }
  }
}
</script>

<style>
.main-view {
  height: 100%;
  width: 100%;
}
</style>
