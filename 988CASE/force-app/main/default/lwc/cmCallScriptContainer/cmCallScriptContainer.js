import { LightningElement, api, track, wire } from "lwc";
import createCase from "@salesforce/apex/CallScriptController.createCase";
import getAvailableBeds from '@salesforce/apex/AvailableBedsController.getAvailableBeds';
import phoneIcon from '@salesforce/resourceUrl/Phone988';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import FACILITY from '@salesforce/schema/Available_Beds__c.Facility_Type__c';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import BEDS_OBJECT from '@salesforce/schema/Available_Beds__c';
import bed from '@salesforce/resourceUrl/bed';

export default class CmCallScriptContainer extends LightningElement {
    @api stageNo;
    @api prevStageNo;
    @api stepNo;
    @api caseId;
    @api isDeesclated;
    @track selectedValue;
    @api recordId;
    @api triageNew;
    @track data;
    isModalOpen = false;
    @track value = '';
    showDataTable = false;
    @track isoutpatientScheduling=false;

    @track onLoad;
    phoneIcon = phoneIcon;
    bed = bed;


    @track columns;
    @wire(getObjectInfo, { objectApiName: BEDS_OBJECT })
    bedsInfo;

    @wire(getPicklistValues, { recordTypeId: '$bedsInfo.data.defaultRecordTypeId', fieldApiName: FACILITY })
    facilityValues;


    connectedCallback() {
        this.onLoad = true;
    }

    onLoadSwitch(event) {
        this.onLoad = false;
        if (this.recordId.startsWith("500")) {
            console.log("Case Record");

            this.caseId = this.recordId;
            this.stageNo = 1;
            this.prevStageNo = 1;
            this.error = undefined;

            this.isDeesclated = false;
            this.triageNew = true;
            this.stepNo = 1;
        }
        else {
            console.log("Conatct Record");
            createCase({ contactID: this.recordId })
                .then((result) => {
                    console.log("Result", result);
                    this.caseId = result;
                    this.stageNo = 1;
                    this.prevStageNo = 1;
                    this.error = undefined;
                })
                .catch((error) => {
                    console.log("Error", error);
                    this.error = error;
                    this.caseId = undefined;
                });
            this.isDeesclated = false;
            this.triageNew = true;
            this.stepNo = 1;
        }
    }


    handleStageChanges(event) {
        this.template.querySelector("lightning-record-edit-form").submit();
        console.log("Stage No >> ", event.detail.stageNo);
        console.log("Previous Stage No >> ", event.detail.prevStageNo);

        if (event.detail.isDeesclated == true) {
            console.log(
                "True Value isDeesclated >>",
                event.detail.isDeesclated
            );
            this.isDeesclated = true;
        } else if (event.detail.isDeesclated == false) {
            console.log(
                "False Value isDeesclated >>",
                event.detail.isDeesclated
            );
            this.isDeesclated = false;
        }
        if (event.detail.caseOutcome == "Dispatched Crisis Response Team") {
            this.selectedValue = "Crisis";
        } else if (
            event.detail.caseOutcome == "Dispatched Emergency Services"
        ) {
            this.selectedValue = "Emergency";
        }
        if (event.detail.triageNew == false) {
            this.triageNew = false;
        }
        if (event.detail.stepNo == 2) {
            this.stepNo = 2;
        } else {
            this.stepNo = 1;
        }
        this.stageNo = event.detail.stageNo;
        this.prevStageNo = event.detail.prevStageNo;

    }

    handleModalChanges(event){
        this.isoutpatientScheduling = event.detail.isoutpatientScheduling;
    }

    redirectReferal(event) {
        this.selectedValue = event.target.name;
        this.prevStageNo = this.stageNo;
        this.stageNo = 5;
        console.log("this.selectedValue :>> ", this.selectedValue);
    }

    showAvailableBedstReferal(event) {
        this.isModalOpen = true;
        this.showDataTable = false;
    }

    outpatientScheduling(event) {
        
        this.isoutpatientScheduling =true;
       
    }



    closeModal(event) {
        this.isModalOpen = false;
        this.showDataTable = false;
        this.value = '';
        console.log('Disconnecting with Value', this.value);
    }

    handleChange(event) {
        this.value = event.detail.value;
        console.log('This.Value ', this.value);

        if (this.value == 'Hospital') {
            this.columns = [
                { label: 'Facility ID', fieldName: 'Facility_Name__c' },
                { label: 'Emergency Room Beds', fieldName: 'Emergency_Beds__c' },
                { label: 'Intensive Care Unit Beds', fieldName: 'ICU_Beds__c' },
                { label: 'Step-Down Beds', fieldName: 'Step_Down_Beds__c' },
                { label: 'Inpatient Beds', fieldName: 'Inpatient_Floor_Beds__c' }
            ];
        }

        if (this.value == 'Mental Health Center - Inpatient Facility') {
            this.columns = [
                { label: 'Facility ID', fieldName: 'Facility_Name__c' },
                { label: 'Short-Term Beds', fieldName: 'Short_Term_Beds__c' },
                { label: 'Long-Term Beds', fieldName: 'Long_Term_Beds__c' }
            ];
        }

        if (this.value == 'Mental Health Center - Outpatient Facility') {
            this.columns = [
                { label: 'Facility ID', fieldName: 'Facility_Name__c' },
                { label: 'Number of Available Beds', fieldName: 'Number_of_available_beds__c' },
                { label: 'Outpatient Program Slots', fieldName: 'Outpatient_Beds__c' }
            ];
        }

        if (this.value == 'Correctional Facility') {
            this.columns = [
                { label: 'Facility ID', fieldName: 'Facility_Name__c' },
                { label: 'Mental Health Ward Beds', fieldName: 'Mental_Health_Beds__c' },
                { label: 'Number of Total Beds', fieldName: 'Number_of_total_beds__c' }
            ];

        }

        if (this.value == 'Homeless Shelter') {
            this.columns = [
                { label: 'Facility ID', fieldName: 'Facility_Name__c' },
                { label: 'Number of Available Beds', fieldName: 'Number_of_available_beds__c' }
            ];
        }

        getAvailableBeds({ facilityType: this.value })
            .then((result) => {
                this.data = result;
                this.showDataTable = true;
                console.log('Data ', JSON.stringify(this.data));
            })
            .catch((error) => {
                console.log(error);
                this.showDataTable = false;
            });
    }

    get isStage1() {
        if (this.stageNo == "1") return true;
        return false;
    }
    get isStage2() {
        if (this.stageNo == "2") return true;
        return false;
    }
    get isStage3() {
        if (this.stageNo == "3") {
            this.isDeesclated = true;
            return true;
        } else {
            return false;
        }
    }
    get isStage4() {
        if (this.stageNo == "4") return true;
        return false;
    }
    get isStage5() {
        if (this.stageNo == "5") return true;
        return false;
    }
}