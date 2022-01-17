import { LightningElement ,track} from 'lwc';

export default class CmOutpatientScheduling extends LightningElement {
    
    @track slots;
    isModalOpen;
    isDateSelected;

    connectedCallback() {
        this.isDateSelected = false;
        this.isModalOpen = false;
    }
    
    handleDate(event){
        if(event.target.value){
            this.slots = ['8:30 AM', '9:00 AM'];
            this.isDateSelected = true;
        }
    }

    bookSlotHandle(event){
        console.log('Slot Booked');
    }

    onSelectedSlot(event){
        console.log('Selected Slot Value ', event.detail.value);

    }

    closeModal() {
        this.isModalOpen = false;
    }

}