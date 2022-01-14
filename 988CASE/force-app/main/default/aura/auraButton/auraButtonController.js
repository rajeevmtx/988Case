({
    openCaseCloneTab:function(component, event)
    {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openSubtab({
            pageReference: {
                "type": "standard__component",
                "attributes": {
                    "componentName": "c__auraSubtabComponent"
                    //second aura component
                },
                "state": {
                    c__crecordId: component.get("v.recordId")
                }
            },
            focus: true
        }).then(function(subtabId){
            workspaceAPI.setTabLabel({
                tabId: subtabId,
                label: "Call Script"
            });
            workspaceAPI.setTabIcon({
                tabId: subtabId,
                icon: "action:log_a_call",
                iconAlt: "Call Script"
            });
        }).catch(function(error) {
            console.log(error);
        });
    },
    
})