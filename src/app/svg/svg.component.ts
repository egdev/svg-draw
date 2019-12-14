import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Point } from './point';
import { Polygon } from './polygon';
import { Shape } from './shape';


@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})

export class SvgComponent implements OnInit, OnDestroy {

  @Input() image: string;
  @Input() fill: string;
  @Input() stroke: string;
  @Input() strokeWidth: number;

  @Output() shapes = new EventEmitter<Shape>(); 

  private activePoint: number;
  //private points: Array<Point> = [];
  //private polygonPoints: string = "";

  //protected points$: BehaviorSubject<Array<Point>> = new BehaviorSubject<Array<Point>>([]);
  //protected polygons$: BehaviorSubject<Array<Polygon>> = new BehaviorSubject<Array<Polygon>>([]);

  private movingDistance: any = null;
  private moveHandler = null;
  private polygons: Array<Polygon> = [];
  private currentPolygon: Polygon;

  constructor() { }

  ngOnInit() {
    this.addPolygon();
    this.moveHandler = this.move.bind(this);
    /*this.points$.subscribe(pts => {
      this.polygonPoints = "";
      let i =0;
      for (i=0; i < pts.length; i++)
      {
        if (i > 0) this.polygonPoints += " ";
        this.polygonPoints += pts[i].x + "," + pts[i].y;
      }
      this.polygon.emit(this.polygonPoints);
    });*/
  }

  ngOnDestroy()
  {
    //this.points$.unsubscribe();
  }

  addPolygon()
  {
    const polygon = new Polygon();
    this.polygons.push(polygon);
    this.currentPolygon = polygon;
  }

  move(e) {
    console.log(e.currentTarget);
    const coords = this.getRelativeCoordinates(e);
    this.currentPolygon.xpoints[this.activePoint] = Math.round(coords.x);
    this.currentPolygon.ypoints[this.activePoint] = Math.round(coords.y);
    //this.points$.next(this.points);
  };

  stopdrag(e) {
    console.log(e.currentTarget);
    console.log("STOP DRAG");
    e.currentTarget.removeEventListener('mousemove', this.moveHandler);
    this.activePoint = null;
  };

  public managePoint(event: any)
  { 
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
    //this.points.push(new Point(Math.round(coords.x), Math.round(coords.y)));
    this.currentPolygon.addPoint(Math.round(coords.x), Math.round(coords.y));
    //this.points$.next(this.points);
    this.activePoint = (this.currentPolygon.npoints - 1);
    event.currentTarget.addEventListener('mousemove', this.moveHandler);
  }

  public record() 
  {
    this.activePoint = null;
    this.shapes.emit(this.polygons);
    this.addPolygon();
  }
  public clear()
  {
    //this.points = [];
    //this.points$.next([]);
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

    //this.points.splice(index, 1);
    this.currentPolygon.xpoints.splice(index, 1);
    this.currentPolygon.ypoints.splice(index, 1);
    //this.points$.next(this.points);
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
