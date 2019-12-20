import * as PIXI from 'pixi.js'
import Line from './Line'

export class VueComponent extends PIXI.Graphics {
  /**
   * @param cnt
   * @param lineCnt
   * @param posX
   * @param posY
   * @param color
   * @param radius
   * @param text
   * @param parent
   * @param iManager {PIXI.interaction.InteractionManager}
   */
  constructor(cnt, lineCnt, posX, posY, radius, color, text, parent, iManager) {
    super()
    this.position.set(posX, posY)
    this.beginFill(color, 0.95)
    this.drawCircle(0, 0, radius)

    this.interactive = true
    this.on('pointerover', this.onPointerOver)
    this.on('pointerout', this.onPointerOut)
    this.iManager = iManager

    this.textstyle = new PIXI.TextStyle({
      fontFamily: 'Century Gothic',
      fontSize: 15,
      fill: 'white',
      align: 'center'
    })

    this.title = this.createText(text, this.textstyle)

    if (cnt) {
      this.addChild(this.title)
      cnt.addChild(this)
      if (parent.posX) {
        const line = new Line([parent.posX, parent.posY, posX, posY], 3)
        lineCnt.addChild(line)
      }
    }
  }

  onPointerOver() {
    this.iManager.cursorStyles.default = 'pointer'
    this.iManager.setCursorMode('pointer')
  }

  onPointerOut() {
    this.iManager.cursorStyles.default = 'grab'
    this.iManager.setCursorMode('grab')
  }

  createText(text, style) {
    let newText = new PIXI.Text(text, style)
    newText.anchor.set(0.5)
    return newText
  }

  drawLine() {}
}
