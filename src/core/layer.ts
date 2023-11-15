import Config from "../config"

export class Layer {
    private _visible = true
    private _context: CanvasRenderingContext2D

    constructor(private readonly _canvas: HTMLCanvasElement ) {
      this._context = _canvas.getContext('2d')!
    }

    public get visible(): boolean {
      return this._visible
    }

    public get context(): CanvasRenderingContext2D {
      return this._context
    }

    public show(): void {
      this._canvas.style.display = 'static'
      this._visible = true
    }

    public hide(): void {
      this._canvas.style.display = 'none'
      this._visible = false
    }
  }

  export class LayerManager {
    private readonly _layers = new Map<string, Layer>()

    constructor(private readonly _screenElement: HTMLElement) {}

    public createLayer(name: string): Layer {
      if (this._layers.has(name)) throw Error(`Layer ${name} aleady exists`)

      const layer = new Layer(this._createCanvas())
      this._layers.set(name, layer)
      return layer
    }

    private _createCanvas(): HTMLCanvasElement {
      const canvas = document.createElement('canvas')
      canvas.width = Config.WIDTH * Config.TILE_SIZE
      canvas.height = Config.HEIGHT * Config.TILE_SIZE
      canvas.style.zIndex = `${this._layers.size + 1}`
      this._resizeCanvas(canvas)
      addEventListener('resize', () => this._resizeCanvas(canvas))
      this._screenElement.appendChild(canvas)
      return canvas
    }

    private _resizeCanvas(canvas: HTMLCanvasElement): void {
      const {width, height} = this._screenElement.getBoundingClientRect()
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }
  }
