public class RelatedCasesController {
   @AuraEnabled
   public static Id getRelatedCase(Id contactId,String recordType){
       try {
           if(recordType =='X988'){
            return ([SELECT Id,CreatedDate FROM Case WHERE 
            ContactId = :contactId AND
            RecordType.DeveloperName = :recordType 
            ORDER BY CreatedDate DESC LIMIT 1].Id);
           }
            else if(recordType =='Referral'){
            return ([SELECT Id,CreatedDate FROM Case WHERE Parent.ContactId = :contactId
             AND RecordType.DeveloperName = :recordType
            ORDER BY CreatedDate DESC LIMIT 1].Id);
           }
           else{
               return null;
           }

       } catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
       }
   }
}