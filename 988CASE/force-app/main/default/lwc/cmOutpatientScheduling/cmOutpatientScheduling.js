import { LightningElement ,track,api} from 'lwc';
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
                    ];

    @track defaultSlot =[];
    isModalOpen;
    isDateSelected;
    bookedDate;
    bookedDateTime;
    istimeValue;
    value = '';

    connectedCallback() {
        this.isDateSelected = false;
        this.isModalOpen = true;
        console.log('Record ID ',this.recordId);
    }
    
    handleDate(event){
        console.log('Handle Date Called');
        if(event.target.value){
            console.log('Inside IF');
            //this.slots = ['8:30 AM', '9:00 AM'];
            //console.log('Random Value ',parseInt(Math.floor(Math.random() * 17)));
           // console.log('SLOT REturned ',this.slots[Math.floor(Math.random() * this.slots.length)]);
           // var s = this.slots[Math.floor(Math.random() * myShows.length)]

            this.defaultSlot = this.slots;
            this.isDateSelected = true;
            this.bookedDate = event.target.value ;
        }
    }

    timeValue(event){
        console.log("Slot:",event.target.name);
        this.istimeValue = event.target.name;
    }

    bookSlotHandle(event){
        console.log('Slot Booked');
        //Create a date time by combining date + time 
        //this.bookedDateTime = < your combined value > ;
        //Submit the record edit form
       // this.template.querySelector("lightning-record-edit-form").submit();
        this.isModalOpen = false;

    }

    onSelectedSlot(event){
        console.log('Selected Slot Value ', event.detail.value);

    }

    closeModal() {
        this.isModalOpen = false;
    }

}