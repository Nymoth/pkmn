import Config from "../config"
import { XY, Direction } from "./common"
import { MapEngine, Tile } from "./map"

export type CharacterStatus = {
  pos: XY
  direction: Direction
  counters: {
    movingStage: number
  }
}

export class CharacterController {
  private _x!: number
  private _y!: number
  private _movingStage = 0
  private _direction = Direction.South

  constructor(private readonly _mapEngine: MapEngine) {}

  public get pos(): XY {
    return {
      x: this._x,
      y: this._y
    };
  }

  public get status(): CharacterStatus {
    return {
      pos: this.pos,
      direction: this._direction,
      counters: {
        movingStage: this._movingStage
      }
    }
  }


  public moveTowards(direction: Direction): boolean {
    this._direction = direction
    if (!this._canMoveTowards(direction)) return false
    switch (direction) {
      case Direction.North:
        this._y--
        break
      case Direction.South:
        this._y++
        break
      case Direction.West:
        this._x--
        break
      case Direction.East:
        this._x++
        break
    }
    this._movingStage = Math.round(Config.TILE_SIZE / Config.SPEED)
    return true
  }

  public place(pos: XY): void {
    this._x = pos.x
    this._y = pos.y
  }

  public updateFrameCounters(): void {
    if (this._movingStage > 0) {
      this._movingStage--
    }
  }

  private _canMoveTowards(direction: Direction): boolean {
    const surroundingTiles = this._mapEngine.getSurroundingTiles(this.pos)
    return this._canAccessTile(surroundingTiles[direction])
  }

  private _canAccessTile(tile: Tile): boolean {
    if (tile.props.blocked) {
      return false
    }
    return true
  }
}
