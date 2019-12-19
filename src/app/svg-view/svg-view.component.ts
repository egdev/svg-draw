import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ShapeType, isRectangle, isPolygon } from '../svg/shape';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-view',
  templateUrl: './svg-view.component.html',
  styleUrls: ['./svg-view.component.css']
})
export class SvgViewComponent implements OnInit {
  @Input() initialShapes: Array<ShapeType>;
  @Input() image: string;
  @Input() attributes: any;

  private shapes: Array<ShapeType> = [];
  private isPolygon: any;
  private isRectangle: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.isRectangle = isRectangle;
    this.isPolygon = isPolygon;
    this.shapes = this.initialShapes;
  }

  buildHtml(shape: ShapeType)
  {
    return this.sanitizer.bypassSecurityTrustHtml(shape.buildHtml(this.attributes));
  }
}
