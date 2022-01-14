import { api, LightningElement } from 'lwc';
import createHouseholds from "@salesforce/apex/IntakeController.createHouseholds";
import getHouseholdMember from "@salesforce/apex/IntakeController.getHouseholdMember";

export default class CmAdditionalIntake extends LightningElement {
    // fields = ['Name', 'Id', 'Case__c'];

    // handleSuccess(event) {
    //     const evt = new ShowToastEvent({
    //         title: 'Intake Created',
    //         message: 'Intake Created ID : ' + event.detail.id,
    //         variant: 'success',
    //     });
    //     this.dispatchEvent(evt);
    // }
    @api householdId;
    // @api intakeId;
    saveAdult(event) {
        console.log('Save Adult Called');
        // let accountForm = this.template.querySelector('lightning-record-edit-form[data-id="accountForm"]');
        // accountForm.submit();
        this.template.querySelector('lightning-record-edit-form').submit();
        // console.log('After Save Adult',JSON.stringify(accountForm));
        
        // this.adultsList.push(this.adultData);
        // console.log('adultsList :>> ', this.adultsList);

        // getHouseholdMember({ intakeID: this.intakeID })
        //     .then((result) => {
        //         console.log("Data from backend", result);
        //         // this.adultsList = result;
        //     })
        //     .catch((error) => {
        //         console.log("Error", error);
        //     });
        // const evt = new ShowToastEvent({
        //     title: 'Success',
        //     message: 'Saved House Hold Info',
        //     variant: 'success',
        // });
        // this.dispatchEvent(evt);
    }

}