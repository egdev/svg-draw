import { Rectangle } from './rectangle';
import { Polygon } from './polygon';

export interface Shape
{
    
}

export type ShapeType = Polygon | Rectangle

export function isPolygon(shape: ShapeType) : shape is Polygon
{
    return shape instanceof Polygon;
}

export function isRectangle(shape: ShapeType) : shape is Rectangle
{
  return shape instanceof Rectangle;
}