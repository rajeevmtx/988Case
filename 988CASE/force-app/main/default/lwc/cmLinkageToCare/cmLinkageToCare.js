import { LightningElement, track, api } from "lwc";
import sendEmai from "@salesforce/apex/CallScriptController.sendEmai";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CmLinkageToCare extends LightningElement {
  @track todayDate = "";
  @track informationRequested = "";
  @track informationProvided = "";
  @track email = "";
  @api caseId;
  @track showModal = false;
  @api prevStageNo;
  @api stageNo;
  @api pathTracker;
  

  connectedCallback() {
    console.log("caseId from Parent: ", this.caseId);
    var today = new Date();
    this.todayDate = today.toISOString();
    console.log('Child PathTracker >> ',this.pathTracker);
  }

  handleInputChange(event) {
    if (event.target.name == "informationRequested")
      this.informationRequested = event.target.value;
    if (event.target.name == "informationProvided")
      this.informationProvided = event.target.value;
    if (event.target.name == "emailId") this.email = event.target.value;
  }

  sendEmailMethod() {
    sendEmai({
      emailId: this.email,
      informationProvided: this.informationProvided,
      informationRequested: this.informationRequested,
    })
      .then((result) => {
          const event = new ShowToastEvent({
            title: 'Email Sent',
            message: 'Please check your mailbox!',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
      })
      .catch((error) => {
        console.log("Send Email Error: ", error);
      });
  }

  handleCreateReferral() {
      const event = new CustomEvent("child", {
        detail: { stageNo: 5, prevStageNo: 4 },
      });
      this.dispatchEvent(event);
  }

  handleModal() {
    if (this.showModal == false) this.showModal = true;
    else this.showModal = false;
  }

  handleBackButton() {
    console.log('Stage No >> ',this.stageNo , ' Previous Stage >> ', this.prevStageNo );
   
    this.template.querySelector("lightning-record-edit-form").submit();
    const event = new CustomEvent("child", {
      detail: { stageNo:this.prevStageNo },
    });
    this.dispatchEvent(event);
  }
  handleClose() {
    const event = new ShowToastEvent({
      title: 'Saving & Closing Call Script',
      message: 'Please view the details on the Case.',
      variant: 'success',
      mode: 'dismissable'
  });
  this.dispatchEvent(event);
    this.template.querySelector("lightning-record-edit-form").submit();
    window.open(
      "https://mtx988casedemo.lightning.force.com/" + this.caseId,
      "_self"
    );
  }
}