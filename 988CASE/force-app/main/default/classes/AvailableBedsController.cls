public with sharing class AvailableBedsController {
   
    @AuraEnabled
    public static List<Available_Beds__c> getAvailableBeds(String facilityType){
        try {
            return [SELECT Emergency_Beds__c,Facility_Name__c,ICU_Beds__c,Id,Inpatient_Floor_Beds__c,Long_Term_Beds__c,Mental_Health_Beds__c,Name,Outpatient_Beds__c,Short_Term_Beds__c,Step_Down_Beds__c,Facility_Type__c,Number_of_available_beds__c,Number_of_total_beds__c FROM Available_Beds__c WHERE Facility_Type__c = :facilityType LIMIT 100];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}