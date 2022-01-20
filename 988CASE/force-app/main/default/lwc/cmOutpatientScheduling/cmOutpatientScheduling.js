import { LightningElement ,track,api} from 'lwc';
import booking from '@salesforce/resourceUrl/booking';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CmOutpatientScheduling extends LightningElement {
    @api caseId;
    @track slots = [{Id: '1',Time: '09:00 AM',Selected:false},
                    {Id: '2',Time: '09:30 AM',Selected:false},
                    {Id: '3',Time: '10:00 AM',Selected:false},
                    {Id: '4',Time: '10:30 AM',Selected:false},
                    {Id: '5',Time: '11:00 AM',Selected:false},
                    {Id: '6',Time: '11:30 AM',Selected:false},
                    {Id: '7',Time: '12:00 PM',Selected:false},
                    {Id: '8',Time: '12:30 PM',Selected:false},
                    {Id: '9',Time: '01:00 PM',Selected:false},
                    {Id: '10',Time: '01:30 PM',Selected:false},
                    {Id: '11',Time: '02:00 PM',Selected:false},
                    {Id: '12',Time: '02:30 PM',Selected:false},
                    {Id: '13',Time: '03:00 PM',Selected:false},
                    {Id: '14',Time: '03:30 PM',Selected:false},
                    {Id: '15',Time: '04:00 PM',Selected:false},
                    {Id: '16',Time: '04:30 PM',Selected:false},
                    {Id: '17',Time: '05:00 PM',Selected:false},
                    {Id: '18',Time: '05:30 PM',Selected:false}
                    ];
    
    randomNumber = Math.floor(Math.random() * 4);

    isModalOpen = true;
    isDateSelected = false;
    bookedDate;
    istimeValue;
    booking = booking;
    @track bookedDateTime='';

    connectedCallback() {
        console.log('Record ID ',this.caseId);
        console.log('Random number: ', this.randomNumber);
    }
    
    
    handleDate(event){
        if(event.target.value){
            this.isDateSelected = true;
            this.bookedDate = event.target.value ;
            this.istimeValue ='';
        }
    }

    timeValue(event){
        this.istimeValue = event.target.name;
        this.bookedDateTime = this.bookedDate +' '+this.istimeValue;
        this.randomNumber

        for(let i = 0;i < this.randomNumber;i++){
             if (this.slots[i].Time === this.istimeValue){ 
                this.slots[i].Selected = true;
            }else{
                this.slots[i].Selected = false;
            }
        }
    }

    bookSlotHandle(event){
        if(this.bookedDate == null && (this.istimeValue ==null || this.istimeValue =='')){
            const ev = new ShowToastEvent({
                title: 'Slot is not Booked!!',
                message: 'Please select your prefer date and time',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(ev);

        }
        else{
        console.log('Date Time ',this.bookedDateTime);
        this.template.querySelector("lightning-record-edit-form").submit();
        this.closeModal();

        const ev = new ShowToastEvent({
            title: 'Slot Booked Successfully!!',
            message: 'Booking Confirmed on : '+this.bookedDate +' at '+this.istimeValue,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(ev);
    }
        
    }

    onSelectedSlot(event){
        console.log('Selected Slot Value ', event.detail.value);

    }

    closeModal() {
        const event = new CustomEvent("child", {
        detail: { isoutpatientScheduling:false },
        });
        this.dispatchEvent(event);
    }

}