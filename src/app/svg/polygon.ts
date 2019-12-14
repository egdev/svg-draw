import { Shape } from './shape';

export class Polygon implements Shape {
    npoints: number = 0;
    xpoints: Array<number> = [];
    ypoints: Array<number> = [];
    bounds: any;

    private static MIN_MENGTH: number = 4;

    constructor() { }

    reset()
    {
        this.npoints = 0;
        this.bounds = null;
        this.xpoints.splice(0);
        this.ypoints.splice(0);
    } 

    addPoint(x:number, y:number)
    {
        this.xpoints.push(x);
        this.ypoints.push(y);
        this.npoints++;
        if (this.bounds != null)
            this.updateBounds(x, y);
    }

    updateBounds(x:number, y:number) {
        if (x < this.bounds.x) {
            this.bounds.width = this.bounds.width + (this.bounds.x - x);
            this.bounds.x = x;
        }
        else {
            this.bounds.width = Math.max(this.bounds.width, x - this.bounds.x);
            // bounds.x = bounds.x;
        }

        if (y < this.bounds.y) {
            this.bounds.height = this.bounds.height + (this.bounds.y - y);
            this.bounds.y = y;
        }
        else {
            this.bounds.height = Math.max(this.bounds.height, y - this.bounds.y);
            // bounds.y = bounds.y;
        }
    }

    svgPoints()
    {
        let str = "";
        for (let i=0; i < this.npoints; i++)
        {
            if (i > 0) 
                str += " ";
            
            str += this.xpoints[i] + "," + this.ypoints[i];
        }
        return str;
    }
}