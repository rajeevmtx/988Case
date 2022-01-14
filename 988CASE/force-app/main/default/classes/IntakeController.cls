public with sharing class IntakeController {

    @AuraEnabled
    public static Id createIntake(Id refferalID){
        try {
            Intake_Request__c intakeAssignment = new Intake_Request__c(Case__c = refferalID);
            insert intakeAssignment;
            return intakeAssignment.Id;
            
        } catch (Exception e) {
            System.debug('Error in Creating Intake Record '+e.getMessage());
            return null;
        }
    }

    @AuraEnabled
    public static void deleteIntake(Id intakeID){
        try {
            Intake_Request__c intakeAssignment = new Intake_Request__c(Id = intakeID);
            delete intakeAssignment;
        } catch(Exception e) {
            System.debug('Error in Deleting Assessment Record '+e.getMessage());
        }
    }
    @AuraEnabled
    public static List<Household_Member__c> createHouseholds(String data){
        try {
            List<HouseholdWrapper> wrapperList = (List<HouseholdWrapper>)JSON.deserialize(data, List<HouseholdWrapper>.class);
            List<Household_Member__c> adultNewList = new List<Household_Member__c>(); 
            for (HouseholdWrapper adultList : wrapperList) {
                Household_Member__c houseHoldAssignment = new Household_Member__c();
                //common
                //to get recordtype id
                houseHoldAssignment.RecordTypeId = Schema.SObjectType.Household_Member__c.getRecordTypeInfosByName().get(adultList.recordLabel).getRecordTypeId();
                houseHoldAssignment.Intake_Request__c = adultList.Intake_Request;
                houseHoldAssignment.Name__c = adultList.Name;
                houseHoldAssignment.Relationship__c = adultList.Relationship != null ? adultList.Relationship : '';
                houseHoldAssignment.HIV_Status_or_unknown__c = adultList.HIV_Status_or_unknown != null ? adultList.HIV_Status_or_unknown : '';
                // houseHoldAssignment.Age__c = Integer.valueOf(adultList.Age != null ? adultList.Age : '');
                houseHoldAssignment.Age__c = adultList.Age != null ? adultList.Age : null;
                houseHoldAssignment.Aware_of_Client_s_HIV_Status_Y_N_NA__c = adultList.Aware_of_Client_s_HIV_Status_Y_N_NA != null ? adultList.Aware_of_Client_s_HIV_Status_Y_N_NA : '';
                //child
                // houseHoldAssignment.DOB__c = Date.valueOf(adultList.DOB != null ? adultList.DOB : '');
                houseHoldAssignment.DOB__c = adultList.DOB != null ? adultList.DOB : null;
                houseHoldAssignment.Sex__c = adultList.Sex != null ? adultList.sex : '';
                houseHoldAssignment.School_Grade__c = adultList.School_Grade != null ? adultList.School_Grade : '';
                //others
                houseHoldAssignment.Whereabouts__c = adultList.Whereabouts != null ? adultList.Whereabouts : '';

                adultNewList.add(houseHoldAssignment);

            }
            insert adultNewList;
            return adultNewList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // @AuraEnabled
    // public static Household_Member__c getHouseholdMember(Id intakeID){
    //     try {
    //         // List<Household_Member__c> newHouseList = new List<Household_Member__c>();
    //         // newHouseList = 'SELECT Id,Rel/ationship__c,Name__c,HIV_Status_or_unknown__c,Age__c,Intake_Request__c FROM Household_Member__c WHERE Intake_Request__c  =:intakeID'; 
    //         system.debug('>>>House List');
    //         return ([SELECT Id,Relationship__c,Name__c,HIV_Status_or_unknown__c,Age__c,Intake_Request__c,Aware_of_Client_s_HIV_Status_Y_N_NA__c FROM Household_Member__c WHERE Intake_Request__c  =:intakeID]); 
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
    public class HouseholdWrapper{
        //adult
        @AuraEnabled public Id Id;
        @AuraEnabled public String recordLabel;
        @AuraEnabled public Integer Age;
        @AuraEnabled public String Relationship;
        @AuraEnabled public String HIV_Status_or_unknown;
        @AuraEnabled public Id Intake_Request;
        @AuraEnabled public String Name;
        @AuraEnabled public String Aware_of_Client_s_HIV_Status_Y_N_NA;
        //child 
        @AuraEnabled public Date DOB;
        @AuraEnabled public String Sex;
        @AuraEnabled public String School_Grade;
        //other
        @AuraEnabled public String Whereabouts;
        
    }
}