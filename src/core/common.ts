export type XY = {
  x: number
  y: number
}

export const NEUTRAL_XY = { x: 0, y : 0 } as const

export enum Direction {
  North = 'North',
  South = 'South',
  West = 'West',
  East = 'East'
}

export type Compass<T> = {
  [Direction.North]: T
  [Direction.South]: T
  [Direction.West]: T
  [Direction.East]: T
}

