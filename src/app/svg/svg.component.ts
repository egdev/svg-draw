import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Polygon } from './polygon';
import { Shape } from './shape';


@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})

export class SvgComponent implements OnInit {
  @Input() initialPolygons: Array<Polygon>;
  @Input() image: string;
  @Input() fill: string;
  @Input() fillEdited: string;
  @Input() stroke: string;
  @Input() strokeWidth: number;

  @Output() shapes = new EventEmitter<Polygon[]>(true); 

  private activePoint: number;
  private moveHandler = null;
  private createdPolygons: Array<Polygon> = [];
  private currentPolygon: Polygon;
  private editShape: boolean = false;
  private attributes: Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.createdPolygons = <Polygon[]>this.initialPolygons;
    this.shapes.emit(this.createdPolygons.slice());
    this.moveHandler = this.move.bind(this);
    this.attributes.push({ name: "fill", value: this.fill});
    this.attributes.push({ name: "stroke", value: this.stroke});
  }

  addPolygon()
  {
    const polygon = new Polygon();
    this.currentPolygon = polygon;
  }

  move(e) {
    const coords = this.getRelativeCoordinates(e);
    this.currentPolygon.xpoints[this.activePoint] = Math.round(coords.x);
    this.currentPolygon.ypoints[this.activePoint] = Math.round(coords.y); 
    
  };

  stopdrag(e) {
    console.log("STOP DRAG");
    e.currentTarget.removeEventListener('mousemove', this.moveHandler);
    this.activePoint = null;
  };

  public managePoint(event: any)
  { 
    if (!this.currentPolygon)
      return;

    if (event.which === 3)  
      return false;

    event.preventDefault();
    
    const coords = this.getRelativeCoordinates(event);
    const index = this.findClickedPointIndex(coords);
    if (index != -1) // click on a point
    {
      this.activePoint = index;
      console.log("Click on point " + this.activePoint);
      event.currentTarget.addEventListener('mousemove', this.moveHandler);       
      return false;
    }

    console.log("x = " + coords.x + ", y = " + coords.y);
    if (this.isPolygon(this.currentPolygon))
    {
      this.currentPolygon.addPoint(Math.round(coords.x), Math.round(coords.y));
      this.activePoint = (this.currentPolygon.npoints - 1);
    }
    event.currentTarget.addEventListener('mousemove', this.moveHandler);
  }

  isPolygon(shape: Shape)
  {
    return (shape instanceof Polygon);
  } 

  editPolygon(event)
  {
    this.editShape = true;
    console.log(event.currentTarget.getAttribute('data-index'));
    this.currentPolygon = this.createdPolygons.slice(event.currentTarget.getAttribute('data-index'))[0];
    console.log("INSTANCE OF", this.currentPolygon instanceof Polygon)
    event.stopPropagation();
  }

  public record() 
  {
    if (!this.currentPolygon)
      return;

    if (!this.currentPolygon.canRecord())
    {
      console.log("Polygon has no points !");
      return;
    }

    this.activePoint = null;
    console.log("BEFORE SIZE", this.createdPolygons.length);
    if (this.editShape)
      this.editShape = false;
    else
      this.createdPolygons.push(this.currentPolygon);

    this.shapes.emit(this.createdPolygons.slice());
    this.currentPolygon = null;
    console.log("AFTER SIZE", this.createdPolygons.length);
  }

  public clear()
  {
    this.currentPolygon.reset();
  }

  public rightClick(event: any)
  {
    event.preventDefault();
    console.log("rightCLick");

    const coords = this.getRelativeCoordinates(event);
    const index = this.findClickedPointIndex(coords);
    if (index == -1)
      return false;

    this.currentPolygon.removePoint(index);
  }

  private getRelativeCoordinates(event: any)
  {
    const rect = (event.currentTarget || event.target).getBoundingClientRect();
    const win = (event.currentTarget || event.target).ownerDocument.defaultView;
    const top = (rect.top + win.pageYOffset);
    const left = (rect.left + win.pageXOffset);
    const offsetX = (event.pageX - left);
    const offsetY = (event.pageY - top);

    return { x: offsetX, y: offsetY };
  }

  private findClickedPointIndex(coords: any): number
  {
    for (let i = 0; i < this.currentPolygon.npoints; i++) {
      const dis = Math.sqrt(Math.pow(coords.x - this.currentPolygon.xpoints[i], 2) + Math.pow(coords.y - this.currentPolygon.ypoints[i], 2));
      if ( dis < 6 ) {
        console.log("Point found at coordinates (" + this.currentPolygon.xpoints[i] + "," + this.currentPolygon.ypoints[i] + ")");
        return i;
      }
    }
    console.log("No point found !");
    return -1;
  }
}
