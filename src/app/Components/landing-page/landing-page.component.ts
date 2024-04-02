import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { Firestore, collection, addDoc, collectionData, getDocs, where, query } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})


export class LandingPageComponent implements OnInit {

  contactForm: FormGroup;
  currentCardIndex: number = 0;
  intervalId: any;
  currentDate: string;
  filteredEvents: any[] = [];

  cards = [
    { title: 'Event', imageUrl: '../../../assets/EventList.png', text: 'Hi, welcome to Rowgistic' },
    // { title: 'MarketPlace', imageUrl: '../../../assets/marketPlace.png', text: 'Hi, welcome to Rowgistic' },
    { title: 'Boats', imageUrl: '../../../assets/BoatList.png', text: 'Hi, welcome to Rowgistic' }
  ];


  @ViewChild('scriptElement', { static: true }) scriptElement: ElementRef | undefined;
  CreatedDate: any;
  eventNames: any;
  eventLocations: any;
  eventId: any;
  eventTransactionData: any;
  eventTransactions: any;

  constructor(private elRef: ElementRef, private route: Router, private fb: FormBuilder, private firestore: Firestore) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });

    this.currentDate = this.getCurrentDate();
    this.filterData();
  }

  ngOnInit() {

  }
  isNavbarCollapsed = true;
  isBodyBlurred = false;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    this.isBodyBlurred = !this.isNavbarCollapsed;
  }



  stopSlideshow() {
    clearInterval(this.intervalId);
  }

  showNextCard() {
    this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length;
  }


  scrollToSection(section: string): void {
    const element = this.elRef.nativeElement.querySelector(`#${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }


  isScrolled: boolean = false;


  imageBrightness: number = 1;

  @HostListener('window:scroll', [])



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
  getCurrentDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    console.log(`${month}/${day}/${year}`, "CurrentDate");

    return `${month}/${day}/${year}`;
  }

  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    console.log(`${month}/${day}/${year}`, "FormatEventDate");

    return `${month}/${day}/${year}`;
  }
  boatIds: any;
  participantIds: any;
  filterData() {
    const eventsRef = collection(this.firestore, 'events');
    getDocs(eventsRef).then(querySnapshot => {
      const eventData = querySnapshot.docs.map(snapshot => {
        const eventData = snapshot.data();
        const eventTimestamp = eventData['eventDate'].toDate();
        const formattedEventDate = this.formatDate(eventTimestamp);

        // If the event date matches the current date, return the event id
        if (formattedEventDate === this.getCurrentDate()) {
          return { ...eventData, eventDate: formattedEventDate, eventId: snapshot.id };
        }

        return null;
      }).filter(event => event !== null);

      this.filteredEvents = eventData;
      this.eventNames = this.filteredEvents.map(event => event.eventName);
      this.eventLocations = this.filteredEvents.map(event => event.eventLocation);
      this.eventId = this.filteredEvents.map(event => event.eventId);

      console.log("Filtered Events:", this.filteredEvents);
      console.log("Event Names:", this.eventNames);
      console.log("Event Locations:", this.eventLocations);
      console.log("Event Ids:", this.eventId);

      const eventTransactionsRef = collection(this.firestore, 'eventTransactions');
      const q = query(eventTransactionsRef, where('eventId', '==', this.eventId));
      getDocs(q).then(querySnapshot => {
        this.eventTransactions = querySnapshot.docs.map(snapshot => {
          this.eventTransactionData = snapshot.data();
          const eventTransactionDoc = snapshot.ref.path;
          return { ...this.eventTransactionData, eventTransactionDoc };
        });
        console.log('Event Transactions:', this.eventTransactions);


    
          this.boatIds = this.eventTransactions[0].boatId;
          this.participantIds = this.eventTransactions[0].participants.map((participant:any) => participant.userId);
    
          console.log(this.boatIds,"BoatIds");
          console.log(this.participantIds,"participantIds");

          const userPromises = this.participantIds.map((participantId:any) => {
            const userRef = doc(this.firestore, 'users', participantId);
            return getDoc(userRef);
          });
    
          Promise.all(userPromises).then(docSnapshots => {
            const usersData = docSnapshots.map(docSnapshot => {
              return docSnapshot.data();
            });
    
            console.log('Users Data:', usersData);
          });
    
        });

    });
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

      console.log(this.contactForm.value)
    }
  }
}
