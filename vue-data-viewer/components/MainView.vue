<template>
  <div
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="main-view"
  ></div>
</template>

<script>
import { Application, Container, Graphics } from 'pixi.js'
import { VueComponent } from './Graphics/VueComponent'
import Line from './Graphics/Line'
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
      renderIndex: -1,
      deltaY: 0,
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
      },
      componentsStructure: [],
      graphics: {
        lineContainer: null,
        componentContainer: null,
        components: [],
        defaultWidth: 90,
        defaultMargin: 60,
        treeMargin: 30
      }
    }
  },
  methods: {
    getDirectChildCount(component) {
      return component.$children.length
    },
    getComponentName(component) {
      if (!component.$options.name) {
        if (component._uid === this.$root._uid) {
          return 'root'
        } else return 'none'
      }

      return component.$options.name
    },
    getComponentPosX(radius, intend) {
      return radius / 2 + intend
    },

    getComponentPosY(depth) {
      return this.graphics.defaultRadius * depth
    },

    setIntend(component) {
      if (component.$parent.$children) {
        const woSource = component.$children.filter(
          child => !this.isSource(child.$options.name)
        )
        woSource.forEach(child => {
          console.log(child.$$options)
          if (child.$children.length) {
            this.setIntend(child)
          }
        })
        // const woSource = component.$children.filter(
        //   child => !this.isSource(child.$options.name)
        // )
        // woSource.forEach((child, index) => {
        //   for (let i = 0; i < index; i++) {
        //     child.$$options.intend += woSource[i].$$options.totalWidth
        //   }
        //
        //   this.setIntend(child)
        // })
      } else {
        console.log('ROOT')
        this.setIntend(component.$children[0])
      }
    },

    magic(component) {
      component.$$options = {}
      if (!component.$$depth) component.$$depth = 1
      component.$$options.depth = component.$$depth
      component.$$options.totalWidth = 0
      component.$$options.intend = 0
      component.$$options.name = this.getComponentName(component)
      component.$$options.directChildCount = this.getDirectChildCount(component)
      // console.log(component.$$options)
      if (component.$children.length) {
        const woSource = component.$children.filter(
          child => !this.isSource(child.$options.name)
        )
        woSource.forEach(child => {
          child.$$depth = component.$$depth + 1
          this.magic(child)
        })
        woSource.forEach(child => {
          component.$$options.totalWidth += child.$$options.totalWidth
        })

        if (component.$parent) {
          component.$parent.$children.forEach((child, index, array) => {
            // console.log(component.$parent.$children[index].$$depth)
            if (array[index - 1]) {
              // console.log(index)
              // component.$$options.intend +=
              //   component.$parent.$children[index - 1].$$options.totalWidth
            }
          })
        }
        // woSource.forEach((child, index) => {
        //   if (child[index - 1]) {
        //     child[index].$$options.intend +=
        //       child[index - 1].$$options.totalWidth
        //   }
        // })
      } else {
        component.$$options.totalWidth = this.graphics.defaultWidth
        component.$$options.posX = this.getComponentPosX(
          component.$$options.totalWidth
        )
      }
    },

    isSource(name) {
      // console.log(this.$options.name)
      return name === 'main-view' || name === 'vue-data-viewer'
    },
    isRoot(component) {
      return this.$root._uid === component._uid
    },

    showChildren(component) {
      if (component) {
        component.$$options.posX = this.getComponentPosX(
          component.$$options.totalWidth,
          component.$$options.intend
        )
        component.$$options.posY = this.getComponentPosY(
          component.$$options.depth
        )
        // console.log(component.$$options)
        this.renderGraphics(component)
        if (component.$children.length) {
          const woSource = component.$children.filter(
            child => !this.isSource(child.$options.name)
          )
          woSource.forEach((child, index) => {
            if (!this.isSource(child.$options.name)) {
              this.showChildren(child)
            }
          })
        }
      }
    },

    createStructure(component) {
      component.$$options = {
        name: '',
        depth: 0,
        directChildCount: 0,
        totalWidth: 0,
        intend: 0
      }
      if (component.$options.name) {
        component.$$options.name = component.$options.name
      } else if (this.isRoot(component)) {
        component.$$options.name = 'root'
      }

      if (component.$$depth) {
        component.$$options.depth = component.$$depth
      }
      delete component.$$depth

      component.$$options.directChildCount = component.$children.length
      // console.log(component.$$options)
      if (component.$children.length) {
        component.$children.forEach((child, index, array) => {
          child.$$depth = component.$$options.depth + 1
          this.createStructure(child)
          component.$$options.totalWidth += child.$$options.totalWidth
        })
      } else {
        component.$$options.totalWidth =
          this.graphics.defaultWidth + this.graphics.defaultMargin
      }
    },
    previousIntend(component) {
      if (component) {
        return component.$$options.intend
      }
      return 0
    },
    previousTotalWidth(component) {
      if (component) {
        return component.$$options.totalWidth
      }
      return 0
    },
    parentIntend(component) {
      return component.$parent.$$options.intend
    },
    createIntend(component) {
      component.$children.forEach((child, index, array) => {
        child.$$options.parent = component.$$options

        if (index !== 0) {
          child.$$options.intend =
            this.previousIntend(array[index - 1]) +
            this.previousTotalWidth(array[index - 1])
        } else {
          child.$$options.intend =
            this.previousIntend(array[index - 1]) +
            this.previousTotalWidth(array[index - 1]) +
            this.parentIntend(child)
        }
        // console.log(child.$$options)
        // console.log(component.$$options)
        this.createIntend(child)
      })
    },

    treeMargin(component) {
      if (component.$$options.margin) {
        return component.$$options.margin
      }
      return 0
    },
    getPosX(component) {
      if (component.$$options.parent) {
        return (
          component.$$options.parent.intend +
          component.$$options.parent.totalWidth / 2
        )
      }
      return 0
    },

    getPosY(component) {
      if (component.$$options.parent) {
        return (
          (this.graphics.defaultWidth + this.graphics.defaultMargin) *
          component.$$options.parent.depth
        )
      }
      return 0
    },
    depthScale(component) {
      if (component.$$options.depth && component.$$options.depth !== 1) {
        return 20 / (component.$$options.depth / 3)
      }
      return 20
    },
    renderGraphics(component) {
      this.renderIndex++
      this.graphics.components.push(
        new VueComponent(
          this.graphics.componentContainer,
          this.graphics.lineContainer,
          component.$$options.intend + component.$$options.totalWidth / 2,
          (this.graphics.defaultWidth + this.graphics.defaultMargin) *
            component.$$options.depth,
          this.graphics.defaultWidth / 2 + this.depthScale(component),
          0x367437,
          component.$$options.name,
          {
            posX: this.getPosX(component),
            posY: this.getPosY(component)
          },
          this.app.renderer.plugins.interaction
        )
      )

      // console.log(this.graphics.components[this.renderIndex])
    },
    renderStage(component) {
      this.renderGraphics(component)
      component.$children.forEach(child => {
        this.renderStage(child)
      })
    }
  },

  mounted() {
    this.$el.appendChild(this.app.view)

    this.graphics.lineContainer = new Container()
    this.graphics.componentContainer = new Container()
    this.iManager = this.app.renderer.plugins.interaction
    this.createStructure(this.$root)
    this.createIntend(this.$root)
    this.renderStage(this.$root)
    this.app.stage.addChild(this.graphics.lineContainer)
    this.app.stage.addChild(this.graphics.componentContainer)
    // this.app.stage.scale.set(0.4, 0.4)

    // this.magic(this.$root)
    // this.setIntend(this.$root)
    // this.showChildren(this.$root)
    // this.showChildren(this.$root)

    // this.$root.$children.forEach(child => {
    //   console.log(child)
    //   child.$children.forEach(child => {
    //     console.log(child)
    //   })
    // })

    // for (let i = 0; i < 5; i++) {
    //   this.graphics.components.push(
    //     new VueComponent(container, 100 * i, 50 * i, 0x233422, this.iManager)
    //   )
    // }

    // this.app.stage.scale.set(0.5, 0.5)
    // this.app.stage.pivot.set(-this.width / 2, -100)

    this.app.stage.interactive = true
    this.app.renderer.plugins.interaction.cursorStyles.default = 'grab'
    window.addEventListener('keydown', key => {
      if (key.key === '`' || key.key === 'ё') {
        while (this.app.stage.children.length > 0) {
          let child = this.app.stage.getChildAt(0)
          this.app.stage.removeChild(child)
        }
        this.createStructure(this.$root)
        this.createIntend(this.$root)
        this.renderStage(this.$root)
      }
    })

    this.app.view.addEventListener('mousewheel', evt => {
      this.deltaY += evt.deltaY
      this.app.stage.scale.set(1 - this.deltaY / 1000, 1 - this.deltaY / 1000)
    })

    this.app.renderer.plugins.interaction.on('mousedown', evt => {
      // for (let i = 0; i < this.app.stage.children.length; i++) {
      //   this.app.stage.removeChild(this.app.stage.children[i])
      // }

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
