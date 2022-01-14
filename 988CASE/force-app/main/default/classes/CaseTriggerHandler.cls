public class CaseTriggerHandler {  
    public static void updateContact(Map<Id,Case> mNewMap,Map<Id,Case> mOldMap){
        List<Contact> lContact = new List<Contact>();
        for(Id csId :mNewMap.keyset()){
            Contact c = new Contact();
            c.Id = mNewMap.get(csId).ContactId;
            if(mNewMap.get(csId).Last_Name__c != mOldMap.get(csId).Last_Name__c){
                c.LastName = mNewMap.get(csId).Last_Name__c;
            }
            if(mNewMap.get(csId).First_Name__c != mOldMap.get(csId).First_Name__c){
                c.FirstName = mNewMap.get(csId).First_Name__c;
            }
            if(mNewMap.get(csId).Contact_Number__c != mOldMap.get(csId).Contact_Number__c){
                c.Phone  = mNewMap.get(csId).Contact_Number__c;
            }
            if(mNewMap.get(csId).Preferred_Language__c  != mOldMap.get(csId).Preferred_Language__c ){
                c.Preffered_Language__c  = mNewMap.get(csId).Preferred_Language__c ;
            }
            if(mNewMap.get(csId).Middle_Name__c  != mOldMap.get(csId).Middle_Name__c ){
                c.Middle_Name__c  = mNewMap.get(csId).Middle_Name__c ;
            }
            if(mNewMap.get(csId).Street_Address__c  != mOldMap.get(csId).Street_Address__c ){
                c.Street_Address__c  = mNewMap.get(csId).First_Name__c;
            }
            if(mNewMap.get(csId).Apt_Suite_Unit_Building__c  != mOldMap.get(csId).Apt_Suite_Unit_Building__c ){
                c.Apt_Suite_Unit_Building__c  = mNewMap.get(csId).First_Name__c;
            }
            if(mNewMap.get(csId).State__c  != mOldMap.get(csId).State__c ){
                c.State__c  = mNewMap.get(csId).State__c ;
            }
            if(mNewMap.get(csId).City__c  != mOldMap.get(csId).City__c ){
                c.City__c  = mNewMap.get(csId).City__c ;
            }
             if(mNewMap.get(csId).County__c   != mOldMap.get(csId).County__c  ){
                c.County__c   = mNewMap.get(csId).County__c  ;
            }
             if(mNewMap.get(csId).Zip_Code__c   != mOldMap.get(csId).Zip_Code__c  ){
                c.Zip_Code__c   = mNewMap.get(csId).Zip_Code__c  ;
            }
            lContact.add(c);
        }
        
        try{
            update lContact;
        }catch(Exception e){
            System.debug('Error Occured while Updating Contact'+e);
        }
        
    }

}