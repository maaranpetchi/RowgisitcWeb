import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { Firestore, collection, addDoc, collectionData, getDocs, where, query } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database'; // Import for AngularFireDatabase

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
  participants: any;
  participantData: any;
  participantFirstNames: any;
  boatData: any;
  boatImages: any[]=[];
  boatSettingImages: any;
  boatName: any;

  constructor(private elRef: ElementRef, private route: Router, private fb: FormBuilder, private firestore: Firestore, private db: AngularFireDatabase) {
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
    this.isBodyBlurred = !this.isBodyBlurred;
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

  expandCard(event: MouseEvent) {
    const cardBody = (event.target as HTMLElement).closest('.card-body');
    if (cardBody) {
      cardBody.classList.add('expanded');
    }
  }

  collapseCard(event: MouseEvent) {
    const cardBody = (event.target as HTMLElement).closest('.card-body');
    if (cardBody) {
      cardBody.classList.remove('expanded');
    }
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
  boatsData: any[] = [];
  filterData() {
    const eventsRef = collection(this.firestore, 'events');
    getDocs(eventsRef).then(querySnapshot => {
      const eventData = querySnapshot.docs.map(snapshot => {
        const eventData = snapshot.data();
        console.log(eventData, "EvetData");

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
      const q = query(eventTransactionsRef, where('eventId', '==', String(this.eventId)));
      getDocs(q).then(querySnapshot => {
        this.eventTransactions = querySnapshot.docs.map(snapshot => {
          this.eventTransactionData = snapshot.data();
          const eventTransactionDoc = snapshot.ref.path;
          return { ...this.eventTransactionData, eventTransactionDoc };
        });
        console.log('Event Transactions:', this.eventTransactions);



        this.boatIds = this.eventTransactions[0].boatIds;
        this.participantIds = this.eventTransactions[0].participants.map((participant: any) => participant.userId);

        console.log(this.boatIds, "BoatIds");
        console.log(this.participantIds, "participantIds");

        ////Pass the Boat id
        this.getBoats();

        // Pass the participantIds array to the users collection
        const usersRef = collection(this.firestore, 'users');
        const q = query(usersRef, where('createdBy', 'in', this.participantIds));
        getDocs(q).then(querySnapshot => {
          this.participants = querySnapshot.docs.map(snapshot => {
            this.participantData = snapshot.data();
            const participantDoc = snapshot.ref.path;
            return { ...this.participantData, participantDoc };
          });
          console.log('Participants:', this.participants);
          this.participantFirstNames = this.participants.map((participant: any) => participant.firstName);
          console.log('Participant First Names:', this.participantFirstNames);
        })

      });

    });
  }

  getBoats() {
    const boatsRef = collection(this.firestore, 'boats');

    getDocs(boatsRef).then(querySnapshot => {
      this.boatsData = querySnapshot.docs.map(snapshot => {
        if (this.boatIds.includes(snapshot.id)) {
          const boatData = snapshot.data();
          console.log(boatData, "BoatDats");
          this.boatImages = this.boatsData.map(boat => boat.boatImages);
          console.log('Boat Images:', this.boatImages);

          boatData['id'] = snapshot.id;
          return boatData;
        }
        return null;
      }).filter(boat => boat !== null);

      console.log('Filtered Boats Data:', this.boatsData);
      this.boatSettingImages = this.boatsData.map((participant: any) => participant.boatImages);
console.log(this.boatSettingImages,"BoatSettingImages");
this.boatName = this.boatsData.map((participant: any) => participant.boatName);
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

