import './style.css'

import { LayerManager } from './core/layer'
import { InputManager } from './core/input'
import { MapEngine, TileMap } from './core/map'
import { Renderer, TextureMap } from './core/renderer'
import { CharacterController } from './core/characterController'
import { SpritesManager } from './core/sprites'
import { NEUTRAL_XY } from './core/common'

const textureMap: TextureMap = {
  void: {
    solid: '#000000'
  },
  grass: {
    solid: '#009900'
  },
  water: {
    solid: '#000099'
  }
}

const testMap = {
  size: {
    x: 80,
    y: 60
  },
  base: 'grass',
  sub: [
    {
      pos: {
        x: 5,
        y: 5
      },
      size: {
        x: 10,
        y: 7
      },
      base: 'water',
      props: {
        blocked: true,
      }
    },
  ]
}




type FrameInfo = {
  count: number
  visibleSection: TileMap
  movingCharacter: boolean
}

class Game {
  private readonly _inputManager: InputManager
  private readonly _mapEngine: MapEngine
  private readonly _renderer: Renderer
  private readonly _layerManager: LayerManager
  private readonly _spritesManager: SpritesManager
  private readonly _character: CharacterController

  constructor(private readonly _rootElement: HTMLElement) {
    this._inputManager = new InputManager()
    this._mapEngine = new MapEngine()
    this._layerManager = new LayerManager(this._rootElement.querySelector('.screen')!)

    const mapLayer = this._layerManager.createLayer('map')
    const spritesLayer  = this._layerManager.createLayer('sprites')
    this._renderer = new Renderer(textureMap, mapLayer)
    this._spritesManager = new SpritesManager(spritesLayer)

    this._mapEngine.loadMap(testMap)

    this._character = new CharacterController(this._mapEngine)
    this._character.place(NEUTRAL_XY)
    this._spritesManager.placeMainCharacter()
    const visibleSection = this._mapEngine.getVisibleSection(this._character.pos)
    this._paintMap(visibleSection)

    this._frame({
      count: 0,
      visibleSection,
      movingCharacter: false
    })
  }

  private _frame(previousFrameInfo: FrameInfo): void {
    const input = this._inputManager.status
    let {visibleSection, movingCharacter} = previousFrameInfo

    // -- upkeep
    this._character.updateFrameCounters()

    // -- input control -> pre state changes
    if ((input.pad.x !== 0 || input.pad.y !== 0) && this._character.status.counters.movingStage === 0) {
      const direction = InputManager.getDirectionFromAxis(input.pad)
      if (this._character.moveTowards(direction)) {
        visibleSection = this._mapEngine.getVisibleSection(this._character.pos)
        movingCharacter = true
      }
    }

    // -- frame actions
    if (movingCharacter) {
      this._paintMap(visibleSection)
    }

    // -- post state changes
    if (this._character.status.counters.movingStage === 0) {
      movingCharacter = false
    }

    const frameInfo: FrameInfo = {
      count: previousFrameInfo.count + 1,
      visibleSection,
      movingCharacter
    }
    setTimeout(() => requestAnimationFrame(() => this._frame(frameInfo)), 1000 / 60);
  }

  private _paintMap(visibleSection: TileMap): void {
    const character = this._character.status
    this._renderer.paintMap(visibleSection, character.direction, character.counters.movingStage)
  }
}

addEventListener('load', () => new Game(document.getElementById('app')!))
