import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import createIntake from "@salesforce/apex/IntakeController.createIntake";
import deleteIntake from "@salesforce/apex/IntakeController.deleteIntake";
import createHouseholds from "@salesforce/apex/IntakeController.createHouseholds";
// import getHouseholdMember from "@salesforce/apex/IntakeController.getHouseholdMember";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import AwayClient from "@salesforce/schema/Household_Member__c.Aware_of_Client_s_HIV_Status_Y_N_NA__c";
import HIVStatus from "@salesforce/schema/Household_Member__c.HIV_Status_or_unknown__c";
import SexStatus from "@salesforce/schema/Household_Member__c.Sex__c";


export default class CmIntakeContainer extends LightningElement {
    @api recordId;
    isModalOpen = false;
    intakeID;
    houseHoldId;

    @track adultData;
    @track adultsList;
    @track childData;
    @track childList;
    @track otherData;
    @track otherList;

    hasRecordAdult = false;
    hasRecordChild = false;
    hasRecordOther = false;
    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: AwayClient,
    })
    AwayClientOption;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: HIVStatus,
    })
    HIVStatusOption;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: SexStatus,
    })
    SexStatusOption;


    get showSpinner() {
        if (
            this.HIVStatusOption.data != null &&
            this.HIVStatusOption.data.values != null &&
            this.AwayClientOption.data != null &&
            this.AwayClientOption.data.values != null &&
            this.SexStatusOption.data != null &&
            this.SexStatusOption.data.values != null

        )
            return false;
        return true;
    }

    get hasRecordAdultList() {
        if (this.adultsList.length > 0) {
            return true;
        }
        return false;
    }

    //recordchild
    get hasRecordChildList() {
        if (this.childList.length > 0) {
            return true;
        }
        return false;
    }

    get hasRecordOtherList() {
        if (this.otherList.length > 0) {
            return true;
        }
        return false;
    }

    connectedCallback() {
        this.adultsList = [];
        this.childList = [];
        this.otherList = [];
        this.adultData = {};
    }
    openModal(event) {
        createIntake({ refferalID: this.recordId })
            .then((result) => {
                console.log("Intake ID ", result);
                this.intakeID = result;
                this.error = undefined;
            })
            .catch((error) => {
                console.log("Error", error);
                this.error = error;
                this.intakeID = undefined;
            });

        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
        this.adultsList = [];
        this.childList = [];
        this.otherList = [];
        deleteIntake({ intakeID: this.intakeID })
            .then((result) => {
                console.log("Record deleted");
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    handleChange(event) {
        console.log("On-Change Called ", event.target.name);
        console.log("On-Change Called ", event.target.value);
    }
    handleChangeAdult(event) {
        var name = event.target.name;
        var value = event.target.value;
        console.log("name,value :>> ", name, value);
        this.adultData[name] = value;
        console.log("adultData :>> ", this.adultData);
    }

    // ChangeChild
    handleChangeChild(event) {
        var name = event.target.name;
        var value = event.target.value;
        console.log("name,value :>> ", name, value);
        this.childData[name] = value;
        console.log("childData :>> ", this.childData);
    }

    // ChangeOther
    handleChangeOther(event) {
        var name = event.target.name;
        var value = event.target.value;
        console.log("name,value :>> ", name, value);
        this.otherData[name] = value;
        console.log("otherData :>> ", this.otherData);
    }

    handleAddAdult() {
        this.hasRecordAdult = true;
        this.adultData = {};
    }

    // Addchild
    handleAddChild() {
        this.hasRecordChild = true;
        this.childData = {};
    }

    // AddOther
    handleAddOther() {
        this.hasRecordOther = true;
        this.otherData = {};
    }
    //cancel
    handleCancel(event) {
        var name = event.target.dataset.id;
        if (name === 'Adults') {
            this.hasRecordAdult = false;
            this.adultData = {};
        }
        if (name === 'Children') {
            this.hasRecordChild = false;
            this.childData = {};
        }
        if (name === 'Other') {
            this.hasRecordOther = false;
            this.otherData = {};
        }
    }



    //saveAdult
    saveAdult(event) {
        var name = event.target.dataset.id;
        console.log('name :>> ', name);
        if (this.adultData.Name != undefined) {
            const keyIndex = this.adultsList.length;
            this.adultData["Intake_Request"] = this.intakeID;
            this.adultData["keyIndex"] = keyIndex;
            this.adultData["recordLabel"] = name;
            this.adultsList.push(this.adultData);
        }
        this.hasRecordAdult = false;
    }

    // saveChild
    saveChild(event) {
        var name = event.target.dataset.id;
        console.log('name :>> ', name);
        if (this.childData.Name != undefined) {
            const keyIndex = this.childList.length;
            this.childData["Intake_Request"] = this.intakeID;
            this.childData["keyIndex"] = keyIndex;
            this.childData["recordLabel"] = name;

            this.childList.push(this.childData);
        }
        this.hasRecordChild = false;
        console.log('object :>> ', this.adultsList);
    }

    // saveOther
    saveOther(event) {
        var name = event.target.dataset.id;
        if (this.otherData.Name != undefined) {
            const keyIndex = this.otherList.length;
            this.otherData["Intake_Request"] = this.intakeID;
            this.otherData["keyIndex"] = keyIndex;
            this.otherData["recordLabel"] = name;
            this.otherList.push(this.otherData);
        }
        this.hasRecordOther = false;
    }
    createHouseHold() {
        const householdList = [...this.adultsList, ...this.childList, ...this.otherList];
        console.log('list :>> ', JSON.stringify(householdList));
        createHouseholds({ data: JSON.stringify(householdList) })
            .then((result) => {
                console.log("Data from backend", result);
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }
    onSubmitClick() {
        console.log("On-Submit BEFORE");
        this.template.querySelector("lightning-record-edit-form").submit();
        console.log("On-Submit AFTER");
        this.createHouseHold();

        this.isModalOpen = false;
        this.adultsList = [];
        this.childList = [];
        this.otherList = [];

        const evt = new ShowToastEvent({
            title: "Success",
            message:
                "Intake Created Created Successfully !! Refresh to view changes !!",
            variant: "success",
        });
        this.dispatchEvent(evt);
    }
}