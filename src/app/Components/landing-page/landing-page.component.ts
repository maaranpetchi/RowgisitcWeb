import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  contactForm: FormGroup;


  @ViewChild('scriptElement', { static: true }) scriptElement: ElementRef | undefined;

  constructor(private elRef: ElementRef, private route: Router, private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  scrollToSection(section: string): void {
    const element = this.elRef.nativeElement.querySelector(`#${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }


  isScrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }


  showImage: boolean = false;
  selectedImage: string = '';

  showEventImage() {
    this.showImage = true;
    this.selectedImage = 'event';
  }

  showMarketPlaceImage() {
    this.showImage = true;
    this.selectedImage = 'marketplace';
  }

  showBoatsImage() {
    this.showImage = true;
    this.selectedImage = 'boats';
  }



  navigatetoTerms() {
    const url = '/Rowgistic/TermsAndCondition';
    window.open(this.route.serializeUrl(this.route.createUrlTree([url])), '_blank');
  }

  onSubmit() {
    console.log('Form values:', this.contactForm.value);

    if (this.contactForm.valid) {
      console.log('Form values:', this.contactForm.value);
      emailjs.init('5cYgjfhsJVzlkDYdF')
      emailjs.send("service_q9prn92", "template_wn4geiw", {
        name: this.contactForm.value.name,
        message: this.contactForm.value.message,
        emailid: this.contactForm.value.email,
      });
      Swal.fire({
        title: "Done!",
        text: "Send Email Successfully!",
        icon: "success"
      }).then((res) => {
        if (res.isConfirmed) {
          this.contactForm.reset();
        }
      });
    } else {
      // Handle form validation errors
    }
  }
}
