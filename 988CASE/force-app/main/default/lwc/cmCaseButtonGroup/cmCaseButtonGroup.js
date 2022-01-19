import { LightningElement,track,api } from 'lwc';

export default class CmCaseButtonGroup extends LightningElement {
    @api recordId;
    @track showbeds;
    @track showOutpatient;
    @api isModalOpen;
 
    connectedCallback() {
        this.showbeds = false;
        this.showOutpatient = false;
        this.isModalOpen = true;
    }

    handleClick(event) {
        console.log('Target ', event.target.name);

        if(event.target.name =='b1'){
            this.showbeds = true;
            this.showOutpatient = false;
        }
        if(event.target.name =='b2'){
            this.showOutpatient = true;
            this.showbeds = false;
        }
    }

    handleModalChanges(event){
        this.showOutpatient = event.detail.isoutpatientScheduling;
       // this.showbeds = event.detail.showbeds;
    }

}