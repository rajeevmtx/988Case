trigger CaseTrigger on Case (after update) {
    if(Trigger.isAfter){
        if(Trigger.isUpdate){
         //  CaseTriggerHandler.updateContact(Trigger.newMap, Trigger.OldMap);
        }
    }
    
}