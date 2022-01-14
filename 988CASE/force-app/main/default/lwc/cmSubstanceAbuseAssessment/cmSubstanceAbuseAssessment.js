import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CmSubstanceAbuseAssessment extends LightningElement {
    @api recordId;
    @track dontShow = false;
    @track data = {};
    options = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];
    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        console.log(name);
        console.log(value);
        console.log(this.recordId);

        this.data[name] = value;
    }
    handleRadioChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        if (value == "Yes") value = true;
        else if (value == "No") value = false;
        console.log(name);
        console.log(value);
        this.data[name] = value;
        console.log(this.data);
    }
    @api submitAssessment() {
        console.log(JSON.stringify(this.data));
        this.template.querySelector("lightning-record-edit-form").submit();
        const event = new ShowToastEvent({
            title: "Substance Abuse Assessment Submitted",
            message: "Assessment is successfully submitted.",
            variant: "success",
            mode: "dismissable",
        });
        this.dispatchEvent(event);
        setTimeout(function () {
            location.reload();
        }, 1000);
    }
}