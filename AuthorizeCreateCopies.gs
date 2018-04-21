function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom')
      .addItem('Authorize', 'authorize')
      .addItem('Create 30 Copies', 'createCopy')
      .addToUi();
}

function authorize(){
  var userProp = PropertiesService.getUserProperties();
  var user = Session.getActiveUser().getEmail();
  var msg = "Hi, " + user + "\nThanks for authorizing."
  userProp.setProperty('AuthTo', user);
  SpreadsheetApp.getUi().alert(msg);
  addNote();
}

function createCopy(){
    var dashboardId = "";
    var folderId = "";
  
    var sheet = SpreadsheetApp.openById(dashboardId); 
    var folder = DriveApp.getFolderById(folderId); 
    var files = folder.getFiles();

    for(i=1; i<=30; i++){
      var fileName = "SUP_" + i;
      DriveApp.getFileById(sheet.getId()).makeCopy(fileName, folder);
    }
  
    var leagueTable = SpreadsheetApp.openById("");
    var leagueTableSS = leagueTable.getSheetByName("FilesList");
    leagueTableSS.getRange("A:B").clear();
  
    var list = [];
    list.push(["File Name", "File Url"]);
    while (files.hasNext()){
       file = files.next();
       list.push([file.getName(),file.getUrl()]);
    }
   leagueTableSS.getRange(1,1,list.length,list[0].length).setValues(list);
}
