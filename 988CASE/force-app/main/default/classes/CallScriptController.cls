public with sharing class CallScriptController {

    @AuraEnabled
    //Create a Case on the IntroSubmit
    public static Id createCase(Id contactID){

        Contact con = [Select Id,Phone,FirstName,LastName from Contact where Id = :contactID LIMIT 1];

        Case c = new Case();
        c.Status = 'New';
        c.Origin ='Phone';
        c.RecordTypeId ='0125f000000R8hCAAS';
        c.First_Name__c  = con.FirstName;
        c.Last_Name__c = con.LastName;
        c.Contact_Number__c = con.Phone;
        c.ContactId =con.Id;

        try{
            insert c;
            System.debug('CS ID '+c.Id);
            return c.Id;
        }
        catch(Exception e){
            System.debug('An Error has occurred'+e);
            return null;
        }
    }

    @AuraEnabled
    public static string sendEmai(String emailId, String informationProvided, String informationRequested, String todayDate){
        try {
            Messaging.SingleEmailMessage semail = new Messaging.SingleEmailMessage();
            String[] sendingTo = new String[] {emailId};
            semail.setToAddresses(sendingTo);
            semail.setSubject('Linkage to Care - Requested Information');
            semail.setPlainTextBody('Hello \n'+'Information Request: '+informationRequested+'\nHere is your Information: '+informationProvided+'\nThank you \n988 Case Management');
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] {semail});

            return 'EMAIL SENT SUCCESSFULLY';
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

     @AuraEnabled
    public static String updateCaseDetails(){

        Case c = new Case();
        try{
            update c;
            return 'Success';
        }
        catch(Exception e){
            System.debug('An Error has occurred'+e);
            return 'FailedUpdate';
        }
    }

    @AuraEnabled
    public static Case getCaseDetails(Id caseId){
        Case c  = [SELECT CaseNumber,City__c,Contact_Number__c,
        County__c,Description,First_Name__c,
        Has_the_Caller_Consented__c,Id,
        IsEscalated,Is_Medical_Emergency__c,
        Last_Name__c,MasterRecordId,Middle_Name__c,
        Nature_of_Crisis__c,Origin,ParentId,
        Preferred_Language__c,RecordTypeId,
        Relation_to_the_person_in_need__c,State__c,
        Status,Street_Address__c,Subject,Information_Provided__c,
         Information_Requested__c,Province__c,Zip_Code__c
         FROM Case WHERE Id =:caseId LIMIT 1];
        return c;
    }

    @AuraEnabled
    public static Case createReferral(Id caseId,String programValue,String refOutcome,String referalNotes,String referralValue){

        Case c = new Case();
        c.ParentId = caseId;
        c.RecordTypeId = '0125f000000R8hHAAS';
        c.Type_of_Referral__c = referralValue;
        c.Notes__c = referalNotes;
        c.Referral_Outcome__c =refOutcome;
        c.Program__c = programValue;
        if(referralValue == 'Inbound'){
            c.OwnerId = '00G5f000000inVn';
        }
      
        try{
            insert c;
            return c;
        }
        catch(Exception e){
            System.debug('Error Orccured Creating Referral');
            return null;
        }
    }

    @AuraEnabled
    public static List<Case> getReferral(Id caseId){
        return ([SELECT Id,CaseNumber,ParentId,RecordTypeId,Type_of_Referral__c,Notes__c,Referral_Outcome__c,Program__c FROM Case WHERE ParentId =:caseId]);
    }

    @AuraEnabled
    public static void updateTriage(Id caseId,String q1, String q2,String q3,String q4,String q5,String q6,String q7,String q8){

        System.debug('CAESE ID TRIAGE >> '+caseId +'TRIAGE RESPONSE >> '+q1 +' '+q2 +' '+q3 +' '+q4 +' '+q5 +' '+q6+q7 +' '+q8);
        if(caseId != null){
       
        Case c = new Case();
        c.Id = caseId;

        if(q1 =='Yes'){
            c.Is_the_caller_a_danger_to_self_or_others__c = true;
        }
        if(q1 == 'No'){
            c.Is_the_caller_a_danger_to_self_or_others__c = false;
        }

        if(q2 == 'Yes'){
            c.Is_the_caller_gravely_disabled__c = true;
        }
        if(q2 == 'No'){
            c.Is_the_caller_gravely_disabled__c = false;
        }

        if(q3 == 'Yes'){
            c.Has_Altered_Mental_State__c = true;
        }
        if(q3 == 'No'){
            c.Has_Altered_Mental_State__c = false;
        }

        if(q4 == 'Yes'){
            c.Psychiatric_hospitalization_Required__c = true;
        }
        if(q4 == 'No'){
            c.Psychiatric_hospitalization_Required__c = false;
        }

        if(q5 == 'Yes'){
            c.Have_substance_use_abuse_issue__c = true;
        }
        if(q5 == 'No'){
            c.Have_substance_use_abuse_issue__c = false;
        }

        if(q6 == 'Yes'){
            c.Under_the_influence_of_any_substances__c = true;
        }
        if(q6 == 'No'){
            c.Under_the_influence_of_any_substances__c = false;
        }

        if(q7 == 'Yes'){
            c.In_need_of_de_escalation__c = true;
        }
        if(q7 == 'No'){
            c.In_need_of_de_escalation__c = false;
        }

        if(q8 == 'Yes'){
            c.Provide_Linkage_to_Care__c = true;
        }
        if(q8 == 'No'){
            c.Provide_Linkage_to_Care__c = false;
        }

        try{
            update c;
        }
        catch(Exception e){
            System.debug('Error Updating Triage '+e);
        }
    }
    }

    @AuraEnabled
    public static Case fetchTriage(Id caseId){
        System.debug('CAESE ID FETCH TRIAGE >> '+caseId);
        return ([SELECT Id,Is_the_caller_a_danger_to_self_or_others__c,
                        Is_the_caller_gravely_disabled__c,
                        Has_Altered_Mental_State__c,
                        Psychiatric_hospitalization_Required__c,
                        Have_substance_use_abuse_issue__c,
                        Under_the_influence_of_any_substances__c,
                        In_need_of_de_escalation__c,
                        Provide_Linkage_to_Care__c, Have_thoughts_of_harming_yourself__c, Intend_to_attempt_suicide__c FROM Case WHERE Id =:caseId]);
    }
}