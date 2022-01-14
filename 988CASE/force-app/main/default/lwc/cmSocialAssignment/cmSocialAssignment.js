import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CmSocialAssignment extends LightningElement {
    // @api assessmentID;
    @api recordId;
    @track data = {
        'Monthly_Employment_income__c': 0,
        'Monthly_Social_Security_income__c': 0,
        'Monthly_Alimony_income__c': 0,
        'Monthly_income_from_Child_Support__c': 0,
        'Monthly_Short_Term_Disability_income__c': 0,
        'Monthly_Survivor_Benefits_income__c': 0,
        'Rent_Supplement__c': 0,
        'Veteran_s_Assistance__c': 0,
        'Pension__c': 0,
        'Long_Term_Disability__c': 0,
        'Workman_s_Compensation__c': 0,
        'Monthly_Unemployment_stipend__c': 0,
        'Food_Stamps__c': 0,
        'Additional_monthly_income_from_household__c': 0
    };

    options = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];
    connectedCallback() {
        // console.log('anuall :>> ',this.totalannualincome);
    }
    handleChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        // console.log('name,value :>> ', name, '--', value);
        this.data[name] = value;
        // console.log('social data :>> ', JSON.stringify(this.data));
    }
    handleRadio(event) {
        var name = event.target.name;
        var value = event.target.value;
        if (value == 'Yes') {
            value = true;
        }
        if (value == 'No') {
            value = false;
        }
        this.data[name] = value;
        // console.log('social data :>> ', JSON.stringify(this.data));
    }
    @api submitAssessment() {
        this.template.querySelector("lightning-record-edit-form").submit();
        this.showToast("Success", "Social Determinants of Health Data saved", "success");
        window.location.reload();
    }
    get totalPersonalMonthlyIncome() {
        var total = parseInt(this.data.Monthly_Employment_income__c) +
            parseInt(this.data.Monthly_Social_Security_income__c) +
            parseInt(this.data.Monthly_Alimony_income__c) +
            parseInt(this.data.Monthly_income_from_Child_Support__c) +
            parseInt(this.data.Monthly_Short_Term_Disability_income__c) +
            parseInt(this.data.Monthly_Survivor_Benefits_income__c) +
            parseInt(this.data.Rent_Supplement__c) +
            parseInt(this.data.Veteran_s_Assistance__c) +
            parseInt(this.data.Pension__c) +
            parseInt(this.data.Long_Term_Disability__c) +
            parseInt(this.data.Workman_s_Compensation__c) +
            parseInt(this.data.Monthly_Unemployment_stipend__c) +
            parseInt(this.data.Food_Stamps__c);
        return total;
    }
    get totalmonthlyhouseholdincome() {
        var total = parseInt(this.totalPersonalMonthlyIncome) +
            parseInt(this.data.Additional_monthly_income_from_household__c)
        return total;
    }
    get totalannualincome() {
        var total = parseInt(this.totalmonthlyhouseholdincome) * 12;
        return total;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}