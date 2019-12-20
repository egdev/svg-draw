import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { ShapeType, isRectangle, isPolygon } from '../svg/shape';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-view',
  templateUrl: './svg-view.component.html',
  styleUrls: ['./svg-view.component.css']
})
export class SvgViewComponent implements OnInit, OnChanges {
  @Input() shapes: Array<ShapeType>;
  @Input() image: string;
  @Input() attributes: any;

  private isPolygon: any;
  private isRectangle: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.isRectangle = isRectangle;
    this.isPolygon = isPolygon;
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if (changes.shapes)
    {
      this.shapes = changes.shapes.currentValue;
    }

  }

  buildHtml(shape: ShapeType)
  {
    return this.sanitizer.bypassSecurityTrustHtml(shape.buildHtml(this.attributes));
  }
}
