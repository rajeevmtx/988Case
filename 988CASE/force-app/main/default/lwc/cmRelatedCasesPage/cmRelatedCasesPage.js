import { LightningElement ,api ,track } from 'lwc';
import getCaseDetails from '@salesforce/apex/RelatedCasesController.getRelatedCase'

export default class CmRelatedCasesPage extends LightningElement {
   @api recordId;
   @api RecordType;
    @track caseId;
    isCallRecord = false;
    isReferral = false;

    @track fields = ['CaseNumber','OwnerId','ParentId','Type_of_Referral__c','Program__c','RecordTypeId','ContactId','Notes__c','Referral_Outcome__c','CreatedById','LastModifiedById' ];

    connectedCallback(){
        if(this.RecordType ==='X988')
        {
             this.isCallRecord = true;
              this.isReferral = false;
        }

        if(this.RecordType ==='Referral'){
            this.isReferral = true;
            this.isCallRecord = false;
        }

        console.log('RECORD ID',this.recordId ,'Record Type >> ',this.RecordType);
        getCaseDetails({contactId : this.recordId, recordType : this.RecordType})
        .then(result=>{
            console.log('Case ID',result);
            this.caseId = result;
        })
        .catch(error=>{
            this.error=error.message;
            console.log('Error fetching Case',error);
            
            this.isCallRecord = false;
            this.isReferral = false;
        });
    }
}