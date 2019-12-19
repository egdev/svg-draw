import { Shape } from './shape';

export class Rectangle implements Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    
    xpoints: number[] = [];
    ypoints: number[] = [];
    npoints: number = 0;

    constructor(x:number, y:number, width:number, height: number){
        if (width == 0 || height == 0)
            return;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.npoints = 4;
        this.xpoints.push(x);
        this.ypoints.push(y);
        this.xpoints.push(x + width);
        this.ypoints.push(y);
        this.xpoints.push(x + width);
        this.ypoints.push(y + height);
        this.xpoints.push(x);
        this.ypoints.push(y + height);
    }

    canSave() : boolean
    {
        return this.npoints == 4;
    }

    addPoint(x:number, y:number)
    {
        if (this.npoints > 1)
            return;

        if (this.npoints == 0) // first point
        {
            this.x = x;
            this.y = y;
            this.xpoints[0] = x;
            this.ypoints[0] = y;
        }
        else if (this.npoints == 1) // second point
        {
            let w = Math.round(x - this.x);
            let h = Math.round(y - this.y);
            this.width = Math.abs(w);  
            this.height = Math.abs(h);
            

            if (w < 0)
            {
                if (h < 0)
                {
                    this.x = x;
                    this.y = y;
                }
                else
                {
                    this.x = x;
                    this.y = y - h;
                }              
            }
            else
            {
                if (h < 0)
                {
                    this.x = x - w;
                    this.y = y;
                }
            }
        }
        this.npoints++;     
        
        if (this.npoints == 2)
        {
            this.updatePoints();
            this.npoints = 4;
        }
    }

    updatePoints()
    {
        this.xpoints[0] = this.x;
        this.ypoints[0] = this.y;
        this.xpoints[1] = this.x + this.width;
        this.ypoints[1] = this.y;
        this.xpoints[2] = this.x + this.width;
        this.ypoints[2] = this.y + this.height;
        this.xpoints[3] = this.x;
        this.ypoints[3] = this.y + this.height;
    }    

    buildHtml(attributes?: any)
    {
        let p = document.createElement('rect');
        p.setAttribute("x", this.x.toString());
        p.setAttribute("y", this.y.toString());
        p.setAttribute("width", this.width.toString());
        p.setAttribute("height", this.height.toString());

        if (attributes)
        {
            for (let key in attributes)
                p.setAttribute(key, attributes[key]);
        }

        return p.outerHTML;
    }
}