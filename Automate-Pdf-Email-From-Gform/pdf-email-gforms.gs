var DOC_FOLDER = ''; // Folder where DOC files will be saved
var PDF_FOLDER = ''; // Folder where PDF files will be saved
var MAIN_FOLDER = '';// Main Folder where project is residing // In my case, one step higher than DOC_FOLDER and PDF_FOLDER

var docTemplate = "TEMPLATE_NAME"; // *** replace with your template ID ***
var docName = "AoA"; // For naming DOC and PDF files

var EMAIL_BODY = '<html><body><h3> ***PLEASE DO NOT REPLY TO THIS EMAIL*** </h3> <p> ADD EMAIL BODY </br> SIGNATURE </p> </body></html>';
var EMAIL_SUBJ = "Form Received";

var userEmail = Session.getEffectiveUser().getEmail();

var pdfAcc = 'EMAIL_ID_TO_GENERATE_PDFS'; // Your email account to run the script
var emailAcc = 'EMAIL_ID_FROM_WHICH_EMAIL_IS_TO_BE_SENT'; // Email id from which user will receive confirmation email

// When Form Gets submitted
function onFormSubmit(e) {
    // Get information from form and set as variables
    var timestamp=e.values[0];
    var emailAddr=e.values[1];
    var firstName=e.values[2];
    var lastName=e.values[3];
    var phone=e.values[4];
    var date = Utilities.formatDate(new Date(timestamp),"GMT","MM/dd/yyyy");
    
    Logger.log(e);
    
    
    if(userEmail == pdfAcc){
    // Get document template, copy it as a new temp doc, and save the Doc’s id
    var copyFileName = docName + '_' + lastName;
    var copyId = DriveApp.getFileById(docTemplate).makeCopy(copyFileName).getId();
    // Open the temporary document
    var copyDoc = DocumentApp.openById(copyId);
    // Get the document’s body section
    var copyBody = copyDoc.getActiveSection();
    
    // Replace place holder keys,in our google doc template
    copyBody.replaceText('keyFirstName',firstName);
    copyBody.replaceText('keyLastName',lastName);
    copyBody.replaceText('keyTelephoneNumber',phone);
    copyBody.replaceText('keyTimestamp',timestamp);
    copyBody.replaceText('keyDate',date);
    // Save and close the temporary document
    copyDoc.saveAndClose();
    
    // Convert temporary document to PDF
    var pdf = DriveApp.getFileById(copyId).getAs('application/pdf');
    pdf.setName(copyDoc.getName() + ".pdf");
    var file = DriveApp.createFile(pdf);
    var fileId = file.getId();
    var pdfFolder = DriveApp.getFolderById(PDF_FOLDER);
    pdfFolder.addFile(file);
    DriveApp.getFileById(fileId).getParents().next().removeFile(file);
    
    // Delete temp file
    var docFolder = DriveApp.getFolderById(DOC_FOLDER);
    var srcFolder = DriveApp.getFolderById(MAIN_FOLDER);
    var docFile = DriveApp.getFileById(copyId);
    docFolder.addFile(docFile);
    srcFolder.removeFile(docFile);

  }
  
  if(userEmail == emailAcc){
    // Sending email
    var quota = MailApp.getRemainingDailyQuota();
    if(quota > 0 && emailAddr){
      MailApp.sendEmail(emailAddr, EMAIL_SUBJ, "", {htmlBody: EMAIL_BODY}); 
    }
  }
}
