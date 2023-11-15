import Config from "../config"
import { CharacterController } from "./characterController"
import { Compass, Direction, XY } from "./common"

type MapCommon = {
  size: XY
  base: string
  props?: Object
}

type MapSection = MapCommon & {
  pos: XY
}

type Map = MapCommon & {
  sub: MapSection[]
}

type TileProps = {
  blocked?: boolean
}

export type Tile = {
  tex: string
  props: TileProps
}

export type TileMap = Tile[][]

const emptyTile: Tile = {
  tex: 'void',
  props: {
    blocked: true
  }
} as const

export class MapEngine {
  public static readonly LEFT_OFFSET = Math.floor(Config.WIDTH / 2)
  public static readonly TOP_OFFSET = Math.floor(Config.HEIGHT / 2)

  private _tileMap!: TileMap

  public loadMap(map: Map): void {
    this._tileMap = this._parseMap(map)
  }

  public get tileMap(): TileMap {
    return this._tileMap
  }

  public getVisibleSection(pos: XY): TileMap {
    const tiles: TileMap = []
    for (let i = 0; i < Config.WIDTH + 2; i++) {
      tiles.push([])
      for (let j = 0; j < Config.HEIGHT + 2; j++) {
        tiles[i].push(this._tileMap[i + pos.x - MapEngine.LEFT_OFFSET - 1]?.[j + pos.y - MapEngine.TOP_OFFSET - 1] ?? emptyTile)
      }
    }
    return tiles
  }

  public getSurroundingTiles(pos: XY): Compass<Tile> {
    return {
      [Direction.North]: this._tileMap[pos.x]?.[pos.y - 1] ?? emptyTile,
      [Direction.South]: this._tileMap[pos.x]?.[pos.y + 1] ?? emptyTile,
      [Direction.West]: this._tileMap[pos.x - 1]?.[pos.y] ?? emptyTile,
      [Direction.East]: this._tileMap[pos.x + 1]?.[pos.y] ?? emptyTile
    }
  }

  private _parseMap(map: Map): TileMap {
    const tiles: TileMap = []
    for (let i = 0; i < map.size.x; i++) {
      tiles.push([])
      for (let j = 0; j < map.size.y; j++) {
        tiles[i].push({
          tex: map.base,
          props: {}
        })
      }
    }
    map.sub.forEach((mapSection: MapSection) => {
      for (let i = mapSection.pos.x; i < mapSection.pos.x + mapSection.size.x; i++) {
        for (let j = mapSection.pos.y; j < mapSection.pos.y + mapSection.size.y; j++) {
          tiles[i][j] = {
            tex: mapSection.base,
            props: mapSection.props ?? {}
          }
        }
      }
    });
    return tiles
  }
}
