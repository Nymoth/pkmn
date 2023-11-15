import Config from "../config"
import { Layer } from "./layer"
import { MapEngine } from "./map"

export class SpritesManager {
  constructor(private readonly _spritesLayer: Layer) {}

  public placeMainCharacter(): void {
    const ctx = this._spritesLayer.context
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(MapEngine.LEFT_OFFSET * Config.TILE_SIZE, MapEngine.TOP_OFFSET * Config.TILE_SIZE, Config.TILE_SIZE, Config.TILE_SIZE)
  }
}
