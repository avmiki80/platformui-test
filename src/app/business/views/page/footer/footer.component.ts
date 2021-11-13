import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year: Date;

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    this.year = new Date();

  }
}
