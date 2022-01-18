import { LightningElement, track, api } from 'lwc';

export default class CmNewLinkageToCare extends LightningElement {
    @track isStageDeescalation;
    @track isStageCare;
    @track isOtherRisk;
    @track riskOption;
    @api caseId;
    @track requiredInfo = true;
    @track q1;
    @track q2;
    @api pathTracker;
    @api stageNo;
    @api prevStageNo;

    connectedCallback() {
        this.isStageDeescalation = false;
        this.isStageCare = false;
        this.isOtherRisk = false;
        console.log('this.caseId :>> ', this.caseId);
    }
    disconnectedCallback() {
        this.template.querySelector('lightning-record-edit-form').submit();
    }
    get options() {
        return [
            { label: "Yes", value: true },
            { label: "No", value: false },
        ];
    }
    handleStageChange(event) {
        var stageNo = event.detail.stageNo;
        var prevStageNo = event.detail.prevStageNo;
        console.log('stage no  :>> ', stageNo);
        console.log('prevStageNo :>> ', prevStageNo);
        const newevent = new CustomEvent('child', {
            detail: { stageNo: stageNo, prevStageNo: prevStageNo }
        });
        this.dispatchEvent(newevent);
    }
    handleRadioChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        console.log('value,name :>> ', value, name);
        if (value == false && name == 'q1') {
            this.isStageDeescalation = false;
            this.q1 = false;

        }
        if (value == false && name == 'q2') {
            this.isStageCare = false;
            this.q2 = false;

        }
        if (name == 'q1' && value == true) {
            this.isStageDeescalation = true;
            this.q1 = true;
        }
        if (name == 'q2' && value == true) {
            this.isStageCare = true;
            this.q2 = true;

        }

    }

    onNxtBtnClick() {
        this.template.querySelector('lightning-record-edit-form').submit();
        console.log('prevStageNo :>> ', this.prevStageNo);
        const event = new CustomEvent('child', {
            detail: { stageNo: 5, prevStageNo: 1 }
        });
        this.dispatchEvent(event);
    }
    onBackBtnClick() {
        this.template.querySelector('lightning-record-edit-form').submit();
        console.log('prevStageNo :>> ', this.prevStageNo);
        const event = new CustomEvent('child', {
            detail: { stageNo: 1, prevStageNo: 2 }
        });
        this.dispatchEvent(event);

    }
    handleRiskChange(event) {
        console.log(event.detail.value);
        if (event.detail.value === "Other referrals") {
            this.isOtherRisk = true;
        } else {
            this.isOtherRisk = false;
        }
        this.riskOption = event.detail.value;
    }
}