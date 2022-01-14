import { LightningElement ,track , api} from 'lwc';

export default class CmDomesticViolence extends LightningElement {
    @api recordId;
    @track data = {};
    options = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];

    handleChange(event) {
        let name = event.target.name;
        this.data[name] = event.target.value;
    }
    handlePicklistChange(event){
        let name = event.target.name;
        this.data[name] = event.target.value;
    }
    handleRadioChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        if (value == "Yes") value = true;
        else if (value == "No") value = false;
        this.data[name] = value;
    }
    @api submitAssessment() {
        this.template.querySelector("lightning-record-edit-form").submit();
        const event = new ShowToastEvent({
            title: "Domestic Violence Assessment Submitted",
            message: "Assessment is successfully submitted.",
            variant: "success",
            mode: "dismissable",
        });
        this.dispatchEvent(event);
        setTimeout(function () {
            location.reload();
        }, 2000);
    }
}