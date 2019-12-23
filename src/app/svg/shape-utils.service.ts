import { Injectable } from "@angular/core";
import { Polygon } from './polygon';
import { ShapeType } from './shape';
import { Rectangle } from './rectangle';

@Injectable({
    providedIn: 'root'
})
export class ShapeUtils {
    constructor() {}

    isPolygon(shape: ShapeType) : shape is Polygon    
    {
        return shape instanceof Polygon;
    }

    isRectangle(shape: ShapeType) : shape is Rectangle
    {
        return shape instanceof Rectangle;  
    }
}