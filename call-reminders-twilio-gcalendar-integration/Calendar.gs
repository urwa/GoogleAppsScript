function getCal() {
 
  deleteTriggers();
  
  var emailId = Session.getActiveUser().getEmail();
  var cal = CalendarApp.getCalendarById(emailId);
  
  var now = new Date();
  var keyWord = "YOUR_KEY_WORD";
  
  var events = cal.getEventsForDay(now, {search: keyWord});
  
  for(var i = 0; i < events.length; i++) {
    
    var eTitle = events[i].getTitle();
      
    if(eTitle.indexOf("Cancel") <= -1) {
      
      var eDateCreated = events[i].getDateCreated();
      var eStartTime = events[i].getStartTime();
    }
        
    var TEN_MINUTES = 10 * 60 * 1000;
    var eTriggerTime = new Date(eStartTime.getTime() - TEN_MINUTES);
    
    if(eTriggerTime > now) {
      
      var eTrigger = createEventTrigger(eTitle, eTriggerTime);
      
    }
  }
}

function deleteTriggers() {
  
  var allTriggers = ScriptApp.getProjectTriggers();
  
  for (var i = 0; i < allTriggers.length; i++) {
    
    if (allTriggers[i].getHandlerFunction() !== "getCal") {
      ScriptApp.deleteTrigger(allTriggers[i]);
    }
  }
}

function createEventTrigger(eTitle, eTriggerTime) {
  
  var newTrigger = ScriptApp.newTrigger('makePhoneCall')
  .timeBased()
  .at(eTriggerTime)
  .create()
  
  return newTrigger;
}
