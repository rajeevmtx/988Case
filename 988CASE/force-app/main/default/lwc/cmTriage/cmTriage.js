import { LightningElement, api, track } from "lwc";
import updateTriage from "@salesforce/apex/CallScriptController.updateTriage";
import fetchTriage from "@salesforce/apex/CallScriptController.fetchTriage";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CmTriage extends LightningElement {
    @track showSafety = true;
    @track showMentalHealthStatus = false;
    @track showSubstanceAbuse = false;
    @track showDeEscalation = false;
    @track showLinkageToCare = false;
    @track showIdentifyKeyRisk = false;
    @track flagMentalHeathStatus = false;
    @track flagSubstanceAbuse = false;
    @track flagDeEscalation = false;
    @track flagLinkageToCare = false;
    @track flagIdentifyKeyRish = false;
    @track data = {};
    @track Intend_to_attempt_suicide__c;
    @track Have_thoughts_of_harming_yourself__c;
    step1 = true;
    step2;
    @api stageNo;
    @api prevStageNo;
    q1;
    q2;
    q3;
    q4;
    q5;
    q6;
    q7;
    q8;
    riskOption = "Not needed";
    isOtherRisk = false;
    caseOutcome = "";
    @api caseId;
    @api pathTracker;
    @api isDeesclated;
    @api triageNew;

    connectedCallback() {
        fetchTriage({ caseId: this.caseId })
            .then((result) => {
                console.log("RESULT >> ", result);
                if (
                    result.Is_the_caller_a_danger_to_self_or_others__c == true
                ) {
                    this.q1 = "Yes";
                } else if (
                    result.Is_the_caller_a_danger_to_self_or_others__c ==
                        false &&
                    this.triageNew == false
                ) {
                    this.q1 = "No";
                }
                if (result.Is_the_caller_gravely_disabled__c == true) {
                    this.q2 = "Yes";
                } else if (
                    result.Is_the_caller_gravely_disabled__c == false &&
                    this.triageNew == false
                ) {
                    this.q2 = "No";
                }
                if (this.q1 == "No" && this.q2 == "No")
                    this.flagMentalHeathStatus = true;

                if (result.Has_Altered_Mental_State__c == true) {
                    this.q3 = "Yes";
                }
                if (
                    result.Has_Altered_Mental_State__c == false &&
                    this.triageNew == false
                ) {
                    this.q3 = "No";
                }
                if (this.q3 == "No" && this.q4 == "No")
                    this.flagSubstanceAbuse = true;

                if (result.Psychiatric_hospitalization_Required__c == true) {
                    this.q4 = "Yes";
                }
                if (
                    result.Psychiatric_hospitalization_Required__c == false &&
                    this.triageNew == false
                ) {
                    this.q4 = "No";
                }

                if (result.Have_substance_use_abuse_issue__c == true) {
                    this.q5 = "Yes";
                }
                if (
                    result.Have_substance_use_abuse_issue__c == false &&
                    this.triageNew == false
                ) {
                    this.q5 = "No";
                }

                if (result.Under_the_influence_of_any_substances__c == true) {
                    this.q6 = "Yes";
                }
                if (
                    result.Under_the_influence_of_any_substances__c == false &&
                    this.triageNew == false
                ) {
                    this.q6 = "No";
                }
                if (this.q5 == "No" && this.q6 == "No")
                    this.flagDeEscalation = true;

                if (result.In_need_of_de_escalation__c == true) {
                    this.q7 = "Yes";
                }
                if (
                    result.In_need_of_de_escalation__c == false &&
                    this.triageNew == false
                ) {
                    this.q7 = "No";
                }
                if (this.q7 == "No") this.flagLinkageToCare = true;

                if (result.Provide_Linkage_to_Care__c == true) {
                    this.q8 = "Yes";
                }
                if (
                    result.Provide_Linkage_to_Care__c == false &&
                    this.triageNew == false
                ) {
                    this.q8 = "No";
                }
                if (result.Intend_to_attempt_suicide__c == true) {
                    this.Intend_to_attempt_suicide__c = "Yes";
                    this.data.Intend_to_attempt_suicide__c = true;
                }
                if (result.Have_thoughts_of_harming_yourself__c == true) {
                    this.Have_thoughts_of_harming_yourself__c = "Yes";
                }
                this.riskCheck();
            })
            .catch((error) => {
                console.log("Error >> ", error.message);
                this.error = error.message;
            });
        this.isDeesclated = false;
    }

    get options() {
        return [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
        ];
    }

    handeReadoutChange(event) {
        let name = event.target.name;
        if (event.target.value == "Yes") {
            this.data[name] = true;
        } else if (event.target.value == "No") {
            this.data[name] = false;
        }
        if (
            name == "Intend_to_attempt_suicide__c" &&
            event.target.value == "Yes"
        ) {
            this.template.querySelector("lightning-record-edit-form").submit();
            this.stageNo = 5;
            this.prevStageNo = 2;
            this.isDeesclated = false;
            this.caseOutcome = "Dispatched Emergency Services";
            const event = new CustomEvent("child", {
                detail: {
                    stageNo: this.stageNo,
                    prevStageNo: this.prevStageNo,
                    triageNew: this.triageNew,
                    isDeesclated: this.isDeesclated,
                    caseOutcome: this.caseOutcome,
                },
            });
            this.dispatchEvent(event);
        }
    }

    handleRadioChange(event) {
        console.log(event.target.name);

        console.log(event.target.value);

        if (event.target.name === "q1") {
            this.q1 = event.target.value;
            this.riskCheck();
        }
        if (event.target.name === "q2") {
            this.q2 = event.target.value;
            this.riskCheck();
        }
        if (event.target.name === "q3") {
            this.q3 = event.target.value;
            this.riskCheck();
        }
        if (event.target.name === "q4") {
            this.q4 = event.target.value;
            this.riskCheck();
        }
        if (event.target.name === "q5") {
            this.q5 = event.target.value;
            this.riskCheck();
        }
        if (event.target.name === "q6") {
            this.q6 = event.target.value;
            this.riskCheck();
        }
        if (event.target.name === "q7") {
            this.q7 = event.target.value;
            this.riskCheck();
        }
        if (event.target.name === "q8") {
            this.q8 = event.target.value;
            this.riskCheck();
        }

        if (event.target.name === "q1" || event.target.name === "q2") {
            if (event.target.value == "Yes") {
                this.showSafety = true;
                this.showMentalHealthStatus = false;
                this.showSubstanceAbuse = false;
                this.showDeEscalation = false;
                this.showLinkageToCare = false;
            } else if (
                event.target.value != "Yes" &&
                this.q1 == "No" &&
                this.q2 == "No" &&
                this.flagSubstanceAbuse == false &&
                this.flagDeEscalation == false &&
                this.flagLinkageToCare == false
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = false;
                this.showDeEscalation = false;
                this.showLinkageToCare = false;
                this.flagMentalHeathStatus = true;
            } else if (
                event.target.value != "Yes" &&
                this.q1 == "No" &&
                this.q2 == "No" &&
                this.flagDeEscalation == false &&
                this.flagLinkageToCare == false
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = false;
                this.showLinkageToCare = false;
            } else if (
                event.target.value != "Yes" &&
                this.q1 == "No" &&
                this.q2 == "No" &&
                this.flagLinkageToCare == false
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = true;
                this.showLinkageToCare = false;
            } else if (
                event.target.value != "Yes" &&
                this.q1 == "No" &&
                this.q2 == "No"
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = true;
                this.showLinkageToCare = true;
            }
        } else if (event.target.name === "q3" || event.target.name === "q4") {
            if (event.target.value == "Yes") {
                this.showSafety = false;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = false;
                this.showDeEscalation = false;
                this.showLinkageToCare = false;
            } else if (
                event.target.value != "Yes" &&
                this.q3 == "No" &&
                this.q4 == "No" &&
                this.flagDeEscalation == false &&
                this.flagLinkageToCare == false
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = false;
                this.showLinkageToCare = false;
                this.flagSubstanceAbuse = true;
            } else if (
                event.target.value != "Yes" &&
                this.q3 == "No" &&
                this.q4 == "No" &&
                this.flagLinkageToCare == false
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = true;
                this.showLinkageToCare = false;
            } else if (
                event.target.value != "Yes" &&
                this.q3 == "No" &&
                this.q4 == "No"
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = true;
                this.showLinkageToCare = true;
            }
        } else if (event.target.name === "q5" || event.target.name === "q6") {
            if (event.target.value == "Yes") {
                this.showSafety = false;
                this.showMentalHealthStatus = false;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = false;
                this.showLinkageToCare = false;
            } else if (
                event.target.value != "Yes" &&
                this.q5 == "No" &&
                this.q6 == "No" &&
                this.flagLinkageToCare == false
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = true;
                this.showLinkageToCare = false;
                this.flagDeEscalation = true;
            } else if (
                event.target.value != "Yes" &&
                this.q5 == "No" &&
                this.q6 == "No"
            ) {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = true;
                this.showLinkageToCare = true;
            }
        } else if (event.target.name === "q7") {
            if (event.target.value == "Yes") {
                this.showSafety = false;
                this.showMentalHealthStatus = false;
                this.showSubstanceAbuse = false;
                this.showDeEscalation = true;
                this.showLinkageToCare = false;
            } else {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = true;
                this.showLinkageToCare = true;
                this.flagLinkageToCare = true;
            }
        } else if (event.target.name === "q8") {
            if (event.target.value == "Yes") {
                this.showSafety = false;
                this.showMentalHealthStatus = false;
                this.showSubstanceAbuse = false;
                this.showDeEscalation = false;
                this.showLinkageToCare = true;
            } else {
                this.showSafety = true;
                this.showMentalHealthStatus = true;
                this.showSubstanceAbuse = true;
                this.showDeEscalation = true;
                this.showLinkageToCare = true;
            }
        }
    }

    riskCheck() {
        console.log("Risk Check");
        if (
            this.q1 === "No" &&
            this.q2 === "No" &&
            this.q3 === "No" &&
            this.q4 === "No" &&
            this.q5 === "No" &&
            this.q6 === "No" &&
            this.q7 === "No" &&
            this.q8 === "No" &&
            this.triageNew == false
        ) {
            this.step2 = true;
            this.showSafety = true;
            this.showMentalHealthStatus = true;
            this.showSubstanceAbuse = true;
            this.showDeEscalation = true;
            this.showLinkageToCare = true;
        } else if (
            (this.q1 === "Yes" || this.q2 === "Yes") &&
            this.q3 === "No" &&
            this.q4 === "No" &&
            this.q5 === "No" &&
            this.q6 === "No" &&
            this.q7 === "No" &&
            this.q8 === "No" &&
            this.triageNew == false
        ) {
            this.step2 = false;
            this.showSafety = true;
            this.showMentalHealthStatus = false;
            this.showSubstanceAbuse = false;
            this.showDeEscalation = false;
            this.showLinkageToCare = false;
        } else if (
            this.q1 === "No" &&
            this.q2 === "No" &&
            (this.q3 === "Yes" || this.q4 === "Yes") &&
            this.q5 === "No" &&
            this.q6 === "No" &&
            this.q7 === "No" &&
            this.q8 === "No" &&
            this.triageNew == false
        ) {
            this.step2 = false;
            this.showSafety = false;
            this.showMentalHealthStatus = true;
            this.showSubstanceAbuse = false;
            this.showDeEscalation = false;
            this.showLinkageToCare = false;
        } else if (
            this.q1 === "No" &&
            this.q2 === "No" &&
            this.q3 === "No" &&
            this.q4 === "No" &&
            (this.q5 === "Yes" || this.q6 === "Yes") &&
            this.q7 === "No" &&
            this.q8 === "No" &&
            this.triageNew == false
        ) {
            this.step2 = false;
            this.showSafety = false;
            this.showMentalHealthStatus = false;
            this.showSubstanceAbuse = true;
            this.showDeEscalation = false;
            this.showLinkageToCare = false;
        } else if (
            this.q1 === "No" &&
            this.q2 === "No" &&
            this.q3 === "No" &&
            this.q4 === "No" &&
            this.q5 === "No" &&
            this.q6 === "No" &&
            this.q7 === "Yes" &&
            this.q8 === "No" &&
            this.triageNew == false
        ) {
            this.step2 = false;
            this.showSafety = false;
            this.showMentalHealthStatus = false;
            this.showSubstanceAbuse = false;
            this.showDeEscalation = true;
            this.showLinkageToCare = false;
        } else if (
            this.q1 === "No" &&
            this.q2 === "No" &&
            this.q3 === "No" &&
            this.q4 === "No" &&
            this.q5 === "No" &&
            this.q6 === "No" &&
            this.q7 === "No" &&
            this.q8 === "Yes" &&
            this.triageNew == false
        ) {
            this.step2 = false;
            this.showSafety = false;
            this.showMentalHealthStatus = false;
            this.showSubstanceAbuse = false;
            this.showDeEscalation = false;
            this.showLinkageToCare = true;
        } else if (
            this.q1 === "No" &&
            this.q2 === "No" &&
            this.q3 === "No" &&
            this.q4 === "No" &&
            this.q5 === "No" &&
            this.q6 === "No" &&
            this.q7 === "No" &&
            this.q8 === "No" &&
            this.triageNew == false
        ) {
            this.step2 = true;
            this.showSafety = false;
            this.showMentalHealthStatus = false;
            this.showSubstanceAbuse = false;
            this.showDeEscalation = false;
            this.showLinkageToCare = false;
        } else if (
            this.q1 === "No" &&
            this.q2 === "No" &&
            this.q3 === "No" &&
            this.q4 === "No" &&
            this.q5 === "No" &&
            this.q6 === "No" &&
            this.q7 === "No" &&
            this.q8 === "No"
        ) {
            this.step2 = true;
        } else {
            console.log("Stage Switch");
            this.step2 = false;
        }

        this.caseoutcomeCheck();
    }

    caseoutcomeCheck() {
        if (this.q1 === "Yes" || this.q2 === "Yes") {
            this.caseOutcome = "Dispatched Emergency Services";
            this.stageNo = 5;
            this.prevStageNo = 2;
            this.isDeesclated = false;
        } else if (
            this.q3 === "Yes" ||
            this.q4 === "Yes" ||
            this.q5 === "Yes" ||
            this.q6 === "Yes"
        ) {
            this.caseOutcome = "Dispatched Crisis Response Team";
            this.stageNo = 5;
            this.prevStageNo = 2;
            this.isDeesclated = false;
        } else if (this.q7 === "Yes") {
            this.caseOutcome = "Performed De-escalation Services";
            this.stageNo = 3;
            this.prevStageNo = 2;
            this.isDeesclated = true;
        } else if (this.q8 === "Yes") {
            this.caseOutcome = "Provided Linkage to Care";
            this.stageNo = 4;
            this.prevStageNo = 2;
            this.isDeesclated = false;
        } else {
            this.caseOutcome = "";
            this.isDeesclated = false;
        }
    }

    get riskOptions() {
        return [
            { label: "Not needed", value: "Not needed" },
            { label: "Finance", value: "Finance" },
            { label: "Healthcare", value: "Healthcare" },
            { label: "Mental health", value: "Mental health" },
            { label: "Food or housing", value: "Food or housing" },
            { label: "Other referrals", value: "Other referrals" },
        ];
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
    onBackClick() {
        const event = new CustomEvent("child", {
            detail: { stageNo: 1, prevStageNo: 1 ,stepNo : 2 },
        });
        this.dispatchEvent(event);
    }
    onNextClick() {
        console.log("onNextClick");
        console.log(
            "q1> ",
            this.q1,
            "q2> ",
            this.q2,
            "q3> ",
            this.q3,
            "q4> ",
            this.q4,
            "q5> ",
            this.q5,
            "q6> ",
            this.q6,
            "q7> ",
            this.q7,
            "q8> ",
            this.q8
        );
        this.template.querySelector("lightning-record-edit-form").submit();
        updateTriage({
            caseId: this.caseId,
            q1: this.q1,
            q2: this.q2,
            q3: this.q3,
            q4: this.q4,
            q5: this.q5,
            q6: this.q6,
            q7: this.q7,
            q8: this.q8,
        })
            .then((result) => {
                console.log("Updated Triage RESULT >> ", result);
            })
            .catch((error) => {
                console.log("Triage Error >> ", error.message);
                this.error = error.message;
            });
        this.triageNew = false;
        if (this.caseOutcome === "" || this.caseOutcome === undefined) {
            console.log("Case OUtcome is NULL or Undefined");
            const event = new ShowToastEvent({
                title: "Saving & Closing Call Script",
                message: "Please view the details on the Case.",
                variant: "success",
                mode: "dismissable",
            });
            this.dispatchEvent(event);
            window.open(
                "https://mtx988casedemo.lightning.force.com/" + this.caseId,
                "_self"
            );
            console.log("Before Query Submitter");
            this.template.querySelector("lightning-record-edit-form").submit();
            console.log("After Query Submitter");
        } else {
            console.log(
                "Redirecting_>> ",
                this.stageNo,
                " >> ",
                this.prevStageNo
            );
            const event = new CustomEvent("child", {
                detail: {
                    stageNo: this.stageNo,
                    prevStageNo: this.prevStageNo,
                    triageNew: this.triageNew,
                    isDeesclated: this.isDeesclated,
                    caseOutcome: this.caseOutcome,
                },
            });
            this.dispatchEvent(event);
            console.log("Before Query Submitter");
            this.template.querySelector("lightning-record-edit-form").submit();
            console.log("After Query Submitter");
        }

        console.log(
            "End Onclick stageNo >> ",
            this.stageNo,
            " >> prev Stage >> ",
            this.prevStageNo
        );
    }
}