import { LightningElement, track, wire } from 'lwc';
import getAvailableBeds from '@salesforce/apex/AvailableBedsController.getAvailableBeds';
import bed from '@salesforce/resourceUrl/bed';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import FACILITY from '@salesforce/schema/Available_Beds__c.Facility_Type__c';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import BEDS_OBJECT from '@salesforce/schema/Available_Beds__c';

export default class CmAvailableBeds extends LightningElement {

    bed = bed;
    @track columns;
    @track data;
    @track value = '';
    isModalOpen = false;
    showDataTable = false;
    @track facilityValues;


    @track columns;
    @wire(getObjectInfo, { objectApiName: BEDS_OBJECT })
    bedsInfo;

    @wire(getPicklistValues, { recordTypeId: '$bedsInfo.data.defaultRecordTypeId', fieldApiName: FACILITY })
    facilityValues;

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

    openModal() {
        this.isModalOpen = true;
        this.showDataTable = false;
    }

    closeModal(event) {
        this.isModalOpen = false;
        this.showDataTable = false;
        this.value = '';
        console.log('Disconnecting with Value', this.value);
    }
}