import Config from '../config'
import { Direction, XY } from './common'
import { Layer } from './layer'
import { TileMap } from './map'

export type TextureMap = {
  [name: string]: {
    solid?: string
  }
}

export class Renderer {
  constructor(private readonly _textureMap: TextureMap, private readonly _mapLayer: Layer) {}

  public paintMap(visibleSectionWithMargin: TileMap, direction: Direction, stage: number): void {
    const offset = this._getOffsetMoveFromDirection(direction, stage)
    console.log('paintMap', direction, stage, offset)
    for (let x = 0; x < visibleSectionWithMargin.length; x++) {
      for (let y = 0; y < visibleSectionWithMargin[x].length; y++) {
        const tile = visibleSectionWithMargin[x][y]
        const textureInfo = this._textureMap[tile.tex] ?? this._textureMap.void
        if (textureInfo.solid) {
          this._renderSolidTexture(textureInfo.solid, { x, y }, offset)
        }
      }
    }
  }

  private _renderSolidTexture(color: string, pos: XY, offset: XY): void {
    this._mapLayer.context.fillStyle = color
    this._mapLayer.context.fillRect((pos.x - 1) * Config.TILE_SIZE - offset.x, (pos.y - 1) * Config.TILE_SIZE - offset.y, Config.TILE_SIZE, Config.TILE_SIZE)
  }

  private _getOffsetMoveFromDirection(direction: Direction, stage: number): XY {
    const offset = Config.SPEED * stage
    switch (direction) {
      case Direction.North: return { x: 0, y: offset }
      case Direction.South: return { x: 0, y: -offset }
      case Direction.West: return { x: offset, y: 0 }
      case Direction.East: return { x: -offset, y: 0 }
    }
  }
}
