import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { ShapeType } from '../svg/shape';
import { DomSanitizer } from '@angular/platform-browser';
import { ShapeUtils } from '../svg/shape-utils.service';

@Component({
  selector: 'app-svg-view',
  templateUrl: './svg-view.component.html',
  styleUrls: ['./svg-view.component.css']
})
export class SvgViewComponent implements OnInit, OnChanges {
  @Input() shapes: Array<ShapeType> = [];
  @Input() image: string = "";
  @Input() attributes: any;

  constructor(private sanitizer: DomSanitizer, private shapeUtils: ShapeUtils) { }

  ngOnInit() {
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
