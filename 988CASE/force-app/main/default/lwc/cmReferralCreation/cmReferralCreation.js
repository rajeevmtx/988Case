import { LightningElement ,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createReferral from '@salesforce/apex/CallScriptController.createReferral';
import getReferral from '@salesforce/apex/CallScriptController.getReferral';
import getCaseDetails from '@salesforce/apex/CallScriptController.getCaseDetails';

import {FlowNavigationFinishEvent} from 'lightning/flowSupport';

export default class CmReferralCreation extends LightningElement {
    referralValue;
    outcomeValue;
    programValue;
    Notes;
    @track refferals =[];
    @track recordId =[];
    hasReferral;
    isModalOpen = false;
    @api caseId;
    @api prevStageNo;
    @api stageNo;
    @api pathTracker;
    @api isDeesclated;
    @api selectedProgram;

    @track addressData = {
        'Street_Address__c': '',
        'Province__c': '',
        'City__c': '',
        'County__c': '',
        'Zip_Code__c': ''
    };
   
    get referralOptions(){
            return [
              { label: "Inbound", value: "Inbound" },
              { label: "Outbound", value: "Outbound" },
            //   {label: "No Referral", value: "No Referral"},
            ];
    }

    get referralOutcome(){
        return [
          { label: "Accepted", value: "Accepted" },
          { label: "Enrolled", value: "Enrolled" },
          {label: "Open", value: "Open"},
        ];
    }

    get programOptions(){
        return [
        { label: "Crisis Response Team", value: "Crisis Response Team" },
        { label: "Emergency Services", value: "Emergency Services" },
        {label: "Internal Case Management", value: "Internal Case Management"},
        ];
    }

    connectedCallback(){
        this.outcomeValue = 'Open';
        this.hasReferral = false;
        this.getReferral();
        console.log('Child PathTracker >> ',this.pathTracker);
        if(this.selectedProgram === 'Crisis'){
            this.programValue = 'Crisis Response Team';
        }
        else{
            this.programValue = 'Emergency Services';
        }
        console.log('this.programValue :>> ', this.programValue);

        this.getCaseData();
    }

    handleReferralChange(event) {
        this.referralValue = event.detail.value;
    }

    handleOutcomeChange(event){
        this.outcomeValue = event.detail.value;
        console.log('Outcome Change Value',event.detail.value);
    }

    handleProgramChange(event){
        this.programValue = event.detail.value;
        console.log('Program Change Value',event.detail.value);
    }
    handleNotesChange(event){
        this.Notes = event.detail.value;
        console.log('Notes Change Value',event.detail.value);
    }
    onBackClick() {
        // const count = parseInt(this.prevStageNo, 10) ;

        // if(this.isDeesclated == true){
        // const event = new CustomEvent('child', {
        //     detail: {stageNo:this.prevStageNo, prevStageNo:count-1 ,isDeesclated:true},
        //     });
        //     this.dispatchEvent(event);
        // }else if(this.isDeesclated == false){ 
        //     const event = new CustomEvent('child', {
        //         detail: {stageNo:this.prevStageNo, prevStageNo:count-2 ,isDeesclated:false},
        //         });
        //         this.dispatchEvent(event);
        // }else{
        //     const event = new CustomEvent('child', {
        //         detail: {stageNo:this.prevStageNo, prevStageNo:count-1},
        //         });
        //         this.dispatchEvent(event);
        // }
        const event = new CustomEvent('child', {
            detail: {stageNo:2, prevStageNo:5},
            });
            this.dispatchEvent(event);
    }
    onSubmit(){
        if(this.programValue == undefined && this.referralValue == undefined)
        {
            const event = new ShowToastEvent({
                title: 'Error Creating Referral',
                message: 'Please provide details before submitting!!',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);

        }
        else if(this.programValue != undefined && this.outcomeValue != undefined && this.referralValue != undefined){
        createReferral({caseId:this.caseId,programValue:this.programValue ,refOutcome:this.outcomeValue,referalNotes:this.Notes,referralValue:this.referralValue})
        .then(result=>{
            console.log(result);

            const event = new ShowToastEvent({
                title: 'Referral Created',
                message: 'Referral Created Successfully!!',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
            this.getReferral();
            console.log('Before',this.recordId);
            //this.recordId.push({Id:result.Id});
            this.hasReferral = true;
            console.log('After',this.recordId);
            this.template.querySelector('lightning-record-edit-form').submit();
         /*   const nextNavigationEvent = new FlowNavigationFinishEvent();
            this.dispatchEvent(nextNavigationEvent);*/
        })
        .catch(error=>{
            // this.error=error.message;
            // const event = new ShowToastEvent({
            //     title: 'Error Creating Referral',
            //     message: 'Please provide details before submitting!!',
            //     variant: 'error',
            //     mode: 'dismissable'
            // });
            // this.dispatchEvent(event);
        });
        }
    }

    getReferral(){
        console.log('GET REFFERALS');
        getReferral({caseId:this.caseId}).then(result =>{
            console.log('RESULT >> ',result);

            this.recordId = result;
            if(result.length > 0){
                this.hasReferral = true;
            }
        })
        .catch(error =>{
            console.log('Error >> ',error.message);
            this.error=error.message;
            this.hasReferral = false;
        });
    }

    onClose() {
        const event = new ShowToastEvent({
            title: 'Saving & Closing Call Script',
            message: 'Please view the details on the Case.',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
        window.open(
            "https://mtx988casedemo.lightning.force.com/" + this.caseId,
            "_self"
          );
    }

    onAddressChange(event) {
        var street = event.detail.street;
        var city = event.detail.city;
        var country = event.detail.country;
        var province = event.detail.province;
        var postalCode = event.detail.postalCode;

        this.addressData.Street_Address__c = street;
        this.addressData.Province__c = province;
        this.addressData.Zip_Code__c = postalCode;
        this.addressData.City__c = city;
        this.addressData.County__c = country;
        console.log('street :>> ', JSON.stringify(this.addressData));
    }

    getCaseData() {
        getCaseDetails({
            caseId: this.caseId
        })
            .then((result) => {
                this.addressData = JSON.parse(JSON.stringify(result));
                console.log('this.addressData :>> ', JSON.stringify(this.addressData));
                this.check = false;
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }
}