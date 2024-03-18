import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-termsandcondition',
  templateUrl: './termsandcondition.component.html',
  styleUrls: ['./termsandcondition.component.scss']
})
export class TermsandconditionComponent {

  @Input() documentPath: any;
  safeUrl: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/' + this.documentPath);
  }
}
