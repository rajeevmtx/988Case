import { LightningElement, track, api } from "lwc";
import createAssessment from "@salesforce/apex/AssessmentController.createAssessment";
import deleteAssessment from "@salesforce/apex/AssessmentController.deleteAssessment";

export default class CmAssessmentContainer extends LightningElement {
    isModalOpen = false;
    @track showMedicalAssessment = false;
    @track showMentalHealthAssesment = false;
    @track showSocialAssignment = false;
    @track showDomesticViolance = false;
    @track showSubstaceAbuse = false;
    assessmentID;
    @api recordId;

    connectedCallback() {}

    openModal(event) {
        createAssessment({
            refferalID: this.recordId,
            recordType: event.target.name,
        })
            .then((result) => {
                console.log("Assessment ID ", result);
                this.assessmentID = result;
                this.error = undefined;
            })
            .catch((error) => {
                console.log("Error", error);
                this.error = error;
                this.assessmentID = undefined;
            });
        console.log("&&" + event.target.name);
        this.isModalOpen = true;
        var name = event.target.name;
        if (name == "MedicalAssessment") {
            this.showMedicalAssessment = true;
            this.showMentalHealthAssesment = false;
            this.showSocialAssignment = false;
            this.showDomesticViolance = false;
            this.showSubstaceAbuse = false;
        } else if (name == "MentalHealth") {
            this.showMedicalAssessment = false;
            this.showMentalHealthAssesment = true;
            this.showSocialAssignment = false;
            this.showDomesticViolance = false;
            this.showSubstaceAbuse = false;
        } else if (name == "SocialDeterminants") {
            this.showMedicalAssessment = false;
            this.showMentalHealthAssesment = false;
            this.showSocialAssignment = true;
            this.showDomesticViolance = false;
            this.showSubstaceAbuse = false;
        } else if (name == "DomesticViolance") {
            this.showMedicalAssessment = false;
            this.showMentalHealthAssesment = false;
            this.showSocialAssignment = false;
            this.showDomesticViolance = true;
            this.showSubstaceAbuse = false;
        } else if (name == "SubstanceAbuse") {
            this.showMedicalAssessment = false;
            this.showMentalHealthAssesment = false;
            this.showSocialAssignment = false;
            this.showDomesticViolance = false;
            this.showSubstaceAbuse = true;
        }
    }
    closeModal() {
        this.isModalOpen = false;
        deleteAssessment({ assessmentID: this.assessmentID })
            .then((result) => {
                console.log("Record deleted");
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }
    submitDetails() {
        this.isModalOpen = false;
        if (this.showMedicalAssessment == true) {
            console.log("hello");
            this.template
                .querySelector("c-cm-medical-assessment")
                .submitAssessment();
            console.log(
                "Medical Assessment for ",
                this.assessmentID,
                " submitted."
            );
            this.showMedicalAssessment = false;
        }
        if (this.showSocialAssignment == true) {
            this.template
                .querySelector("c-cm-social-assignment")
                .submitAssessment();
            this.showSocialAssignment = false;
            console.log("Social for ", this.assessmentID, " submitted.");
        }
        if (this.showMentalHealthAssesment == true) {
            this.template
                .querySelector("c-cm-mental-health")
                .submitAssessment();
            this.showMentalHealthAssesment = false;
            console.log("mental health for ", this.assessmentID, " submitted.");
        }
        if (this.showDomesticViolance == true) {
            this.template
                .querySelector("c-cm-domestic-violence")
                .submitAssessment();
            this.showDomesticViolance = false;
            console.log("Domestic ", this.assessmentID, " submitted.");
        }
        if (this.showSubstaceAbuse == true) {
            this.template
                .querySelector("c-cm-substance-abuse-assessment")
                .submitAssessment();
            this.showSubstaceAbuse = false;
            console.log("Sustance Abuse  ", this.assessmentID, " submitted.");
        }
    }
}