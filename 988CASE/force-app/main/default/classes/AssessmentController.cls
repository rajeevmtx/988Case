public class AssessmentController {

    @AuraEnabled
    public static Id createAssessment(Id refferalID, String recordType){
        try {
            Assessment__c assessmentRec = new Assessment__c(Case__c = refferalID);
            if(recordType == 'DomesticViolance')
                assessmentRec.RecordTypeId = '0125f000000RMnzAAG';
            else if(recordType == 'SubstanceAbuse')
                assessmentRec.RecordTypeId = '0125f000000RMo4AAG';
            else if(recordType == 'SocialDeterminants')
                assessmentRec.RecordTypeId = '0125f000000RMnpAAG';
            else if(recordType == 'MentalHealth')
                assessmentRec.RecordTypeId = '0125f000000RMnuAAG';
            else if(recordType == 'MedicalAssessment')
                assessmentRec.RecordTypeId = '0125f000000RMnkAAG';
           insert assessmentRec;
            return assessmentRec.Id;
            
        } catch (Exception e) {
            System.debug('Error in Creating Assessment Record '+e.getMessage());
            return null;
        }
    }

    @AuraEnabled
    public static void deleteAssessment(Id assessmentID){
        try {
            Assessment__c assessmentRec = new Assessment__c(Id = assessmentID);
           delete assessmentRec;
        } catch(Exception e) {
            System.debug('Error in Deleting Assessment Record '+e.getMessage());
        }
    }
}