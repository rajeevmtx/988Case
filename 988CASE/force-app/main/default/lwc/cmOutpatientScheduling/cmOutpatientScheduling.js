import { LightningElement ,track,api} from 'lwc';
import booking from '@salesforce/resourceUrl/booking';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CmOutpatientScheduling extends LightningElement {
    @api caseId;
    @track slots = [{Id: '1',Time: '09:00 AM'},
                    {Id: '2',Time: '09:30 AM'},
                    {Id: '3',Time: '10:00 AM'},
                    {Id: '4',Time: '10:30 AM'},
                    {Id: '5',Time: '11:00 AM'},
                    {Id: '6',Time: '11:30 AM'},
                    {Id: '7',Time: '12:00 PM'},
                    {Id: '8',Time: '12:30 PM'},
                    {Id: '9',Time: '01:00 PM'},
                    {Id: '10',Time: '01:30 PM'},
                    {Id: '11',Time: '02:00 PM'},
                    {Id: '12',Time: '02:30 PM'},
                    {Id: '13',Time: '03:00 PM'},
                    {Id: '14',Time: '03:30 PM'},
                    {Id: '15',Time: '04:00 PM'},
                    {Id: '16',Time: '04:30 PM'},
                    {Id: '17',Time: '05:00 PM'},
                    {Id: '18',Time: '05:30 PM'}
                    ];

    @track defaultSlot =[];
    isModalOpen = true;
    isDateSelected = false;
    bookedDate;
    bookedDateTime;
    istimeValue;
    booking = booking;

    connectedCallback() {
        console.log('Record ID ',this.caseId);
    }
    
    handleDate(event){
        if(event.target.value){
            this.defaultSlot = this.slots;
            this.isDateSelected = true;
            this.bookedDate = event.target.value ;
            this.istimeValue ='';
        }
    }

    timeValue(event){
        this.istimeValue = event.target.name;
    }

    bookSlotHandle(event){
        // 1. Check if booking date and time are available  else through error to select date and time
        // 2. Create a date time by combining date(this.bookedDate) + time (this.istimeValue)
        //  this.bookedDateTime = < your combined value > ;
        // 3. Submit the record edit form using below syntax (just uncomment the below line)
        // this.template.querySelector("lightning-record-edit-form").submit();
        this.closeModal();
    }

    onSelectedSlot(event){
        console.log('Selected Slot Value ', event.detail.value);

    }

    closeModal() {
        const event = new CustomEvent("child", {
        detail: { isoutpatientScheduling:false },
        });
        this.dispatchEvent(event);

        const ev = new ShowToastEvent({
            title: 'Slot Booked Successfully!!',
            message: 'Booking Confirmed on : '+this.bookedDate +' at '+this.istimeValue,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(ev);
    }

}