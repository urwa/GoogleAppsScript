function emailLabeling() {
  var DUPLICATE = _getLabel();
  var labels = GmailApp.getUserLabelByName("Label A");
  if(labels != null){
    var threads = labels.getThreads();
    for (var i = 0; i < threads.length; i++){
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++){
        var message = messages[j];
        for (var k = i; k < threads.length; k++){
        var messages_check = threads[k].getMessages();
          for (var l = j; l < messages_check.length; l++){
            var message_check = messages_check[l];
            if(message_check.getBody() == message.getBody()){
              if(i !=  k || j != l){
                Logger.log(i +""+ j +""+ k +""+ l);
                DUPLICATE.addToThread(threads[i]);
                labels.removeFromThread(threads[i]);
                GmailApp.moveThreadToArchive(threads[i]);
              }
            }
          }
        }
      }
    }
  }
  else{
    Logger.log("Label Not Found!");
  }
}

function _getLabel() {
  var label_text = "Label B";
  var label = GmailApp.getUserLabelByName(label_text);
  if (label == null) {
    var label = GmailApp.createLabel(label_text);
  }
  return label;
}
