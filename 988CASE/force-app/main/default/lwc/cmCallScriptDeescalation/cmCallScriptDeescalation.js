import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CmCallScriptDeescalation extends LightningElement {
    @api caseId;
    @track requiredInfo = true;
    @api pathTracker;
    @api stageNo;
    @api prevStageNo;

   
    handleInputChange(event) {
        if (event.target.value)
            this.requiredInfo = false;
        else
            this.requiredInfo = true;
    }
    onNxtBtnClick() {
        this.template.querySelector('lightning-record-edit-form').submit();
        console.log('prevStageNo :>> ', this.prevStageNo);
        const event = new CustomEvent('child', {
            detail: {stageNo:4,prevStageNo:3}
            });
            this.dispatchEvent(event);
    }
    onSaveAndClose() {
        const event = new ShowToastEvent({
            title: 'Saving & Closing Call Script',
            message: 'Please view the details on the Case.',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);

        this.template.querySelector('lightning-record-edit-form').submit();
        window.open(
            "https://mtx988casedemo.lightning.force.com/" + this.caseId,
            "_self"
          );
    }
    onBackBtnClick(){
        this.template.querySelector('lightning-record-edit-form').submit();
        console.log('prevStageNo :>> ', this.prevStageNo);
        const event = new CustomEvent('child', {
            detail: {stageNo:2,prevStageNo:1}
            });
            this.dispatchEvent(event);

    }
}