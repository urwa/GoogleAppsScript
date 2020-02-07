function addMembersFromSheet() {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("YOUR_SHEET_NAME");
  var emails = sheet.getRange(1,1,sheet.getLastRow()-1,1).getValues();
  var group = GroupsApp.getGroupByEmail("group.name@yourcompany.com");
  
  for(i = 0; i < emails.length; i++) {    try {
      addMember(emails[i][0], group);
    }
    catch(e) {
      console.error(e);
      continue;
    }   
  }
}

function addMember(email, group) {
  
  var hasMember = group.hasUser(email);
  Utilities.sleep(1000);
  
  if(!hasMember) {
    var newMember = {email: email, 
                     role: "MEMBER",
                     delivery_settings: "NONE"};
    AdminDirectory.Members.insert(newMember, GROUP_ID);
  }
}
