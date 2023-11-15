import { Direction, XY } from "./common"

export type InputStatus = {
  a: boolean
  b: boolean
  start: boolean
  pad: XY
}

export class InputManager {
  private _aPressed = false
  private _bPressed = false
  private _startPressed = false
  private _xAxis = 0
  private _yAxis = 0

  public static getDirectionFromAxis(axis: XY): Direction {
    if (axis.y < 0) {
      return Direction.North
    } else if (axis.y > 0) {
      return Direction.South
    }
    if (axis.x < 0) {
      return Direction.West
    } else if (axis.x > 0) {
      return Direction.East
    }
    throw Error('Tried to get direction with centered axis')
  }

  constructor() {
    this._listenForKeyboardInput()
  }

  public get status(): InputStatus {
    return {
      a: this._aPressed,
      b: this._bPressed,
      start: this._startPressed,
      pad: {
        x: this._xAxis,
        y: this._yAxis
      }
    }
  }

  private _listenForKeyboardInput(): void {
    addEventListener('keydown', (ev: KeyboardEvent) => {
      switch (ev.key) {
        case 'ArrowUp':
          this._yAxis = -1
          // this._fixDiagonalMovement()
          break
        case 'ArrowDown':
          this._yAxis = 1
          // this._fixDiagonalMovement()
          break
        case 'ArrowLeft':
          this._xAxis = -1
          // this._fixDiagonalMovement()
          break
        case 'ArrowRight':
          this._xAxis = 1
          // this._fixDiagonalMovement()
          break
        case 'x':
          this._aPressed = true
          break
        case 'z':
          this._bPressed = true
          break
        case 'Escape':
          this._startPressed = true
          break
      }
    });
    addEventListener('keyup', (ev: KeyboardEvent) => {
      switch (ev.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          this._yAxis = 0
          break
        case 'ArrowLeft':
        case 'ArrowRight':
          this._xAxis = 0
          break
        case 'x':
          this._aPressed = false
          break
        case 'z':
          this._bPressed = false
          break
        case 'Escape':
          this._startPressed = false
          break
      }
    });
  }

  // private _fixDiagonalMovement(): void {
  //   if (Math.abs(this._yAxis) + Math.abs(this._xAxis) === 2) {
  //     const diagonalDistance = Math.sin(1)
  //     this._xAxis *= diagonalDistance
  //     this._yAxis *= diagonalDistance
  //   }
  // }
}
