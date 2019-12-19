import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Polygon } from './polygon';
import { Shape, ShapeType, isPolygon, isRectangle } from './shape';
import { Rectangle } from './rectangle';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})

export class SvgComponent implements OnInit, OnDestroy {
  @Input() initialShapes: Array<ShapeType>;
  @Input() image: string;
  @Input() attributes: any = { fill: 'red', 'stroke-width' : 1, stroke: 'black' };

  @Output() updateShapes = new EventEmitter<ShapeType[]>(true); 

  private activePoint: number;
  private moveHandler = null;
  private dragHandler = null;
  private keyHandler = null;
  private shapes: Array<ShapeType> = [];
  private currentShape: ShapeType;
  private editShape: boolean = false;
  private dragElement: any;
  private dragOffset: any;
  private transform: any;
  private isPolygon: any;
  private isRectangle: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.isPolygon = isPolygon;
    this.isRectangle = isRectangle;
    this.shapes = this.initialShapes;
    this.updateShapes.emit(this.shapes.slice());
    this.moveHandler = this.move.bind(this);
    this.dragHandler = this.drag.bind(this);
    this.keyHandler = this.manageKey.bind(this);
    window.addEventListener('keydown', this.keyHandler);
  }

  ngOnDestroy()
  {
    window.removeEventListener('keydown', this.keyHandler);
  }

  manageKey(event)
  {
    //event.preventDefault();
    //event.stopPropagation();

    if (event.keyCode != 13)
      return;

    this.record();
  }

  add(type:string)
  {
    if (this.currentShape)
      this.record();

    switch (type)
    {
      case 'polygon':
        this.addPolygon();
        break;
      case 'rectangle':
        this.addRectangle();
        break;        
    }
  }

  addPolygon()
  {
    this.currentShape = new Polygon();
  }

  addRectangle()
  {
    console.log('add rectangle');
    this.currentShape = new Rectangle(0, 0, 0, 0);
  }

  /*isPolygon(shape: ShapeType) : shape is Polygon
  {
    return shape instanceof Polygon;
  }

  isRectangle(shape: ShapeType) : shape is Rectangle
  {
    return shape instanceof Rectangle;
  }*/

  getHtml(shape)
  {
    return this.sanitizer.bypassSecurityTrustHtml(shape.buildHtml(this.attributes));
  }

  move(e) {
    let coords = this.getRelativeCoordinates(e);
    coords.x -= this.currentShape.transform.x;
    coords.y -= this.currentShape.transform.y;

    if (isPolygon(this.currentShape))
    {
      this.currentShape.xpoints[this.activePoint] = Math.round(coords.x);
      this.currentShape.ypoints[this.activePoint] = Math.round(coords.y);
    }
    else if (isRectangle(this.currentShape))
    {
      let w, h, x, y;

      // found which corner has been clicked
      if (this.activePoint == 0)
      {
        // top left corner
        x = Math.round(coords.x);
        y = Math.round(coords.y);
        w = Math.round(this.currentShape.xpoints[1] - x);
        h = Math.round(this.currentShape.ypoints[3] - y);
      }
      else if (this.activePoint == 1)
      {
        // top right corner
        x = this.currentShape.x;
        y = Math.round(coords.y);
        w = Math.round(coords.x - x);
        h = Math.round(this.currentShape.ypoints[2] - y);
     }
      else if (this.activePoint == 2)
      {
        x = this.currentShape.x;
        y = this.currentShape.y;
        // bottom right corner
        w = coords.x - x;
        h = coords.y - y;
      }
      else if (this.activePoint == 3)
      {
        // bottom left corner
        x = Math.round(coords.x);
        y = this.currentShape.y;
        w = Math.round(this.currentShape.xpoints[1] - x);
        h = Math.round(coords.y - this.currentShape.ypoints[0]);
      }

      if (w > 4)
      {
        this.currentShape.xpoints[this.activePoint] = Math.round(coords.x);
        this.currentShape.x = x;
        this.currentShape.width = w;
      }

      if (h > 4)
      {
        this.currentShape.ypoints[this.activePoint] = Math.round(coords.y);
        this.currentShape.y = y;
        this.currentShape.height = h;
      }

      this.currentShape.updatePoints();
    }
  };

  stopdrag(e) {
    e.currentTarget.removeEventListener('mousemove', this.moveHandler);
    this.activePoint = null;
  };

  managePoint(event: any)
  { 
    if (!this.currentShape)
    {
      alert('Vous devez ajouter une forme !');
      return;
    }

    if (event.which === 3)  
      return false;

    event.preventDefault();
    
    const coords = this.getRelativeCoordinates(event);
    const index = this.findClickedPointIndex(coords, this.currentShape.getTransform());
    if (index != -1) // click on a point
    {
      this.activePoint = index;
      event.currentTarget.addEventListener('mousemove', this.moveHandler);       
      return false;
    }

    if (isPolygon(this.currentShape))
    {
      this.currentShape.addPoint(Math.round(coords.x - this.currentShape.transform.x), Math.round(coords.y - this.currentShape.transform.y));
      this.activePoint = (this.currentShape.npoints - 1);
      event.currentTarget.addEventListener('mousemove', this.moveHandler);
    }
    else if (isRectangle(this.currentShape))
    {
      this.currentShape.addPoint(Math.round(coords.x), Math.round(coords.y));
    }
  }

  edit(event)
  {
    event.stopPropagation();
    this.editShape = true;
    const idx = parseInt(event.currentTarget.getAttribute('data-index'));
    this.currentShape = this.shapes[idx];//JSON.parse(JSON.stringify(this.shapes[idx]));    
  }

  getMousePosition(evt) {
    var CTM = document.getElementsByTagName('svg')[0].getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

  startDrag(event)
  {
    //event.preventDefault();
    event.stopPropagation();
    //this.dragElement = event.target;
    this.dragOffset = this.getMousePosition(event);
    
    var transforms = event.target.transform.baseVal;
    // Ensure the first transform is a translate transform
    if (transforms.length === 0 ||
        transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      // Create an transform that translates by (0, 0)
      var translate = document.getElementsByTagName('svg')[0].createSVGTransform();
      translate.setTranslate(0, 0);
      // Add the translation to the front of the transforms list
      event.target.transform.baseVal.insertItemBefore(translate, 0);
    }
    // Get initial translation amount
    this.transform = transforms.getItem(0);
    this.dragOffset.x -= this.transform.matrix.e;
    this.dragOffset.y -= this.transform.matrix.f;
    
    event.target.addEventListener('mousemove', this.dragHandler); 
  }

  drag(event)
  {
    event.preventDefault();
    this.dragElement = event.target;
    if (this.dragElement)
    {
      var coord = this.getMousePosition(event);
      this.transform.setTranslate(coord.x - this.dragOffset.x, coord.y - this.dragOffset.y);
      const idx = parseInt(this.dragElement.getAttribute('data-index'));
      this.shapes[idx].setTransform({ x: (coord.x - this.dragOffset.x), y: (coord.y - this.dragOffset.y) });
    }
  }

  stopShapeDrag(event)
  {
    event.preventDefault();
    event.stopPropagation();
    this.dragElement.removeEventListener('mousemove', this.dragHandler);
    this.dragElement = null;
  }

  record() 
  {
    console.log("RECORD");
    if (!this.currentShape)
      return;

    if (!this.currentShape.canSave())
    {
      console.log("Impossible d'enregistrer la forme !");
      return;
    }

    this.activePoint = null;
    if (this.editShape)    
      this.editShape = false;
    else
      this.shapes.push(this.currentShape);
    this.currentShape = null;
    this.updateShapes.emit(this.shapes);
  }

  public deleteShape()
  {
    if (!this.currentShape)
      return;

    if (this.editShape)
    {
      this.shapes.splice(this.shapes.indexOf(this.currentShape), 1);
      this.updateShapes.emit(this.shapes);
      this.editShape = false;
    }
    this.currentShape = null;
    this.activePoint = null;
  }

  public rightClick(event: any)
  {
    event.preventDefault();

    const coords = this.getRelativeCoordinates(event);
    const index = this.findClickedPointIndex(coords, this.currentShape.getTransform());
    if (index == -1)
      return false;

    if (isPolygon(this.currentShape))
      (this.currentShape as Polygon).removePoint(index);
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

  private findClickedPointIndex(coords: any, transform: any): number
  {
    for (let i = 0; i < this.currentShape.npoints; i++) {
      const dis = Math.sqrt(Math.pow(coords.x - (this.currentShape.xpoints[i] + transform.x), 2) + Math.pow(coords.y - (this.currentShape.ypoints[i] + transform.y), 2));
      if ( dis < 6 ) {
        console.log("Point found at coordinates (" + (this.currentShape.xpoints[i] + transform.x) + "," + (this.currentShape.ypoints[i] + transform.y) + ")");
        return i;
      }
    }
    console.log("No point found !");
    return -1;
  }
}
