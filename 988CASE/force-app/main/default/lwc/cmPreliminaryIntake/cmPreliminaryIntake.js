import { LightningElement, wire, api, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import USER_ID from "@salesforce/user/Id";
import NAME_FIELD from "@salesforce/schema/User.Name";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getCaseDetails from "@salesforce/apex/CallScriptController.getCaseDetails";

export default class CmPreliminaryIntake extends LightningElement {
    isEmergency = false;
    agentName;
    phoneError;
    step1 = true;
    step2 = true;

    @api stageNo;
    @api prevStageNo;
    @api stepNo;
    @api caseId;
    @track check;
    emergencyQvalue;
    phoneValue;
    langVal;
    concentVal;
    caseResults;
    @api pathTracker = [];
    @track addressData = {
        Street_Address__c: "",
        Province__c: "",
        City__c: "",
        County__c: "",
        Zip_Code__c: "",
    };

    @wire(getRecord, {
        recordId: USER_ID,
        fields: [NAME_FIELD],
    })
    wireuser({ error, data }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.agentName = data.fields.Name.value;
        }
    }

    connectedCallback() {
        this.check = true;
        if (this.stepNo == 1) {
            this.step1 = true;
            this.step2 = true;
        } else if (this.stepNo == 2) {
            this.step2 = true;
            this.step1 = true;
        }
        console.log("stepNo ", this.stepNo);

        console.log("CaseId from Parent ", this.caseId);
        this.emergencyQvalue = "false";
        this.phoneError = false;
        console.log("Child PathTracker >> ", this.pathTracker);
        this.getCaseData();
    }

    getCaseData() {
        this.check = true;
        getCaseDetails({
            caseId: this.caseId,
        })
            .then((result) => {
                this.addressData = JSON.parse(JSON.stringify(result));
                console.log(
                    "this.addressData :>> ",
                    JSON.stringify(this.addressData)
                );
                this.check = false;
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }
    get showSpinner() {
        return this.check;
    }

    get options() {
        return [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
        ];
    }

    get stateOptions() {
        return [
            { label: "AL", value: "AL" },
            { label: "CA", value: "CA" },
            { label: "FL", value: "FL" },
            { label: "GA", value: "GA" },
        ];
    }

    get cityOptions() {
        return [
            { label: "Huntsville", value: "Huntsville" },
            { label: "Birmingham", value: "Birmingham" },
            { label: "Montgomery", value: "Montgomery" },
            { label: "AlturasCounty", value: "AlturasCounty" },
            { label: "Artesia", value: "Artesia" },
            { label: "Brentwood", value: "Brentwood" },
            { label: "Campbell", value: "Campbell" },
            { label: "Alford", value: "Alford" },
            { label: "Boca Raton", value: "Boca Raton" },
            { label: "Chiefland", value: "Chiefland" },
            { label: "Davenport", value: "Davenport" },
            { label: "Ambrose", value: "Ambrose" },
            { label: "Berlin", value: "Berlin" },
            { label: "Boston", value: "Boston" },
            { label: "Canon", value: "Canon" },
            { label: "Jacksonville", value: "Jacksonville" },
        ];
    }

    get langVal() {
        this.langVal = this.caseResults.Preferred_Language__c;
    }

    handleRadioChange(event) {
        if (event.detail.value == "true") {
            this.isEmergency = true;
            this.emergencyQvalue = "true";
        }
        if (event.detail.value == "false") {
            this.isEmergency = false;
            this.emergencyQvalue = "false";
        }
    }

    handlephoneChange(event) {
        this.phoneValue = event.detail.value;
        console.log("Phone ", this.phoneValue);
        console.log("Phone ", this.phoneValue.length);
        console.log("Pattern Matching ", this.phoneValue.match(/^[0-9]+$/));

        if (this.phoneValue.length > 10) {
            this.phoneError = true;
        } else if (this.phoneValue.length > 0 && this.phoneValue.length < 10) {
            this.phoneError = true;
        } else if (
            this.phoneValue.length == 10 &&
            this.phoneValue.match(/^[0-9]+$/) === null
        ) {
            this.phoneError = true;
        } else {
            this.phoneError = false;
        }
    }

    handlelangChange(event) {
        this.langVal = event.detail.value;
    }

    handleConsentChange(event) {
        console.log(event.target.checked);
        this.concentVal = event.target.checked;
    }

    handleStateChange(event) {
        console.log(event.detail.value);
    }

    handleCityChange(event) {
        console.log(event.detail.value);
    }

    onBtnClick(event) {
        if (this.phoneError == false) {
            this.phoneError = false;
            this.template.querySelector("lightning-record-edit-form").submit();
            this.step2 = true;
            this.step1 = false;
            const event = new CustomEvent("child", {
                detail: { stageNo: 1, prevStageNo: 1, stepNo: 2 },
            });
            this.dispatchEvent(event);
        }
    }

    onNxtBtnClick() {
        this.getCaseData();
        this.step1 = true;
        this.step2 = true;
        this.template.querySelector("c-cm-triage").onNextClick();
        this.template.querySelector("lightning-record-edit-form").submit();
        const event = new CustomEvent("child", {
            detail: { stageNo: 2, prevStageNo: 1 },
        });
        this.dispatchEvent(event);
    }
    onBackBtnClick() {
        this.step2 = true;
        this.step1 = true;
        this.template.querySelector("lightning-record-edit-form").submit();
        const event = new CustomEvent("child", {
            detail: { stageNo: 0, prevStageNo: 1 },
        });
        this.dispatchEvent(event);
    }
    handleSuccess() {
        const event = new ShowToastEvent({
            title: "Details Submitted",
            message: "Details Submitted Successfully!!",
            variant: "success",
            mode: "dismissable",
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
        console.log("street :>> ", JSON.stringify(this.addressData));
    }
}