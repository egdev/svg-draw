import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Point } from './point';
import { CdkDragMove, CdkDragStart, CdkDragRelease } from '@angular/cdk/drag-drop';


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

  @Output() polygon = new EventEmitter<string>(); 

  private activePoint: number;
  private points: Array<Point> = [];
  private polygonPoints: string = "";

  protected points$: BehaviorSubject<Array<Point>> = new BehaviorSubject<Array<Point>>([]);

  private parentElement: HTMLElement;
  private exampleBoxElement: HTMLElement;
  private movingDistance: any = null;
  private moveHandler = null;
  constructor() { }

  ngOnInit() {
    this.moveHandler = this.move.bind(this);
    this.points$.subscribe(pts => {
      this.polygonPoints = "";
      let i =0;
      for (i=0; i < pts.length; i++)
      {
        if (i > 0) this.polygonPoints += " ";
        this.polygonPoints += pts[i].x + "," + pts[i].y;
      }
      this.polygon.emit(this.polygonPoints);
    });
  }

  ngOnDestroy()
  {
    this.points$.unsubscribe();
  }

  move(e) {
    console.log(e.currentTarget);
    const coords = this.getRelativeCoordinates(e);
    this.points[this.activePoint].x = Math.round(coords.x);
    this.points[this.activePoint].y = Math.round(coords.y);
    this.points$.next(this.points);
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
    this.points.push(new Point(Math.round(coords.x), Math.round(coords.y)));
    this.points$.next(this.points);
    this.activePoint = (this.points.length - 1);
    event.currentTarget.addEventListener('mousemove', this.moveHandler);
  }

  public clear()
  {
    this.points = [];
    this.points$.next([]);
  }

  public rightClick(event: any)
  {
    event.preventDefault();
    console.log("rightCLick");

    const coords = this.getRelativeCoordinates(event);
    const index = this.findClickedPointIndex(coords);
    if (index == -1)
      return false;

    this.points.splice(index, 1);
    this.points$.next(this.points);
  }

  onDragStarted(e: CdkDragStart)
  {
    const index = parseInt(e.source.element.nativeElement.getAttribute('data-index'));
    if (isNaN(index))  
      return;
    //this.movingDistance = new Point(this.points[index].x, this.points[index].y);
    //console.log("MOVING POINT", this.movingPoint);
  }

  onDragMoved(e: CdkDragMove) {
    const index = parseInt(e.source.element.nativeElement.getAttribute('data-index'));
    if (isNaN(index))  
      return;
    this.movingDistance = e.distance;
    //console.log("X", this.movingPoint.x + "+" + e.distance.x);
    //console.log("Y", this.movingPoint.y + "+" + e.distance.y);
    //this.points[index].x = this.movingPoint.x + e.distance.x;
    //this.points[index].y = this.movingPoint.y + e.distance.y;
    //console.log("MOVING POINT AFTER MOVE", this.movingPoint);
    //const coords = this.getRelativeCoordinates(e.event);
    /*const rect = e.source.element.nativeElement.getBoundingClientRect();
    const win = e.source.element.nativeElement.ownerDocument.defaultView;
    const top = (rect.top + win.pageYOffset);
    const left = (rect.left + win.pageXOffset);
    const offsetX = (e.event.pageX - left);
    const offsetY = (e.event.pageY - top);

    this.points.push(new Point(Math.round(offsetX), Math.round(offsetY)));
    this.points$.next(this.points);*/
    /*console.log(e);
    console.log("distance x = " + e.distance.x + ", y = " + e.distance.y);
    const index = e.source.element.nativeElement.getAttribute('data-index');
    if (!index)  
      return;
    this.points[index].x = e.distance.x;
    this.points[index].y = e.distance.y;
    this.points$.next(this.points);*/
    //console.log("onDragMoved x = " + e.pointerPosition.x + ", y = " + e.pointerPosition.y);
    /*console.log(event);
    const coords = this.getRelativeCoordinates(event);*/
    /*const fromLeftOfDraggedElement = e.pointerPosition.x;// - this.exampleBoxElement.getBoundingClientRect().left;
    const fromTopOfDraggedElement = e.pointerPosition.y;// - this.exampleBoxElement.getBoundingClientRect().top;

    const xRelativeToParent = e.pointerPosition.x - fromLeftOfDraggedElement - this.parentElement.getBoundingClientRect().left;
    const yRelativeToParent = e.pointerPosition.y - fromTopOfDraggedElement - this.parentElement.getBoundingClientRect().top;
    console.log(`Relative to .parent: ${xRelativeToParent}, ${yRelativeToParent}`);*/
  }

  onDragReleased(e: CdkDragRelease)
  {
    const index = parseInt(e.source.element.nativeElement.getAttribute('data-index'));
    if (isNaN(index))  
      return;
      
    this.points[index].x = this.points[index].x + this.movingDistance.x;
    this.points[index].y = this.points[index].y + this.movingDistance.y;
    this.movingDistance = null;
    this.points$.next(this.points);
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
    for (let i = 0; i < this.points.length; i++) {
      const dis = Math.sqrt(Math.pow(coords.x - this.points[i].x, 2) + Math.pow(coords.y - this.points[i].y, 2));
      if ( dis < 6 ) {
        console.log("Point found at coordinates (" + this.points[i].x + "," + this.points[i].y + ")");
        return i;
      }
    }
    console.log("No point found !");
    return -1;
  }
}
