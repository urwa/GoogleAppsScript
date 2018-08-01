function doGet() {
  var html = HtmlService.createTemplateFromFile("index").evaluate();
  html.setTitle("CLEAN DRIVE");
  return html; 
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}


function deleteEverything(){
  deleteFiles();
  deleteFolders();
  Drive.Files.emptyTrash();
  return ;
}

function deleteFiles() {
  // Get all files in Drive
  var files = DriveApp.getFiles();

  // Delete every file
  while (files.hasNext()) {
    var file = files.next();
    if(file!= "DeleteAllDrive"){ 
      if(file.getOwner().getEmail() == 'ADD_YOUR_GMAIL_ID_HERE'){
        // Delete File
        Logger.log('Deleting file: '+ file.getName() + "..........." );
        Drive.Files.remove(file.getId());
      }    
    }
   }
}


function deleteFolders(){
  // Get all folder in Drive
  var folders = DriveApp.getFolders();
  
  // Delete every folder
  while (folders.hasNext()){
    var folder = folders.next();
    if(folder.getOwner().getEmail() == 'ADD_YOUR_GMAIL_ID_HERE'){
      // Delete Folder
      Logger.log('Deleting file: '+ folder.getName() + "..........." );
      folder.setTrashed(true);
    }
  }
}
