
function getConfig(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();
  
  config
    .newTextInput()
    .setId('apikey')
    .setName('Enter airtable api key')
    .setHelpText('You can find api key at airtable.com/account')
    .setPlaceholder('')
    .setAllowOverride(true);
  
  config
    .newTextInput()
    .setId('baseid')
    .setName('Enter id of airtable base')
    .setHelpText('e.g. apphp10uEyLZkBvpM')
    .setPlaceholder('apphp10uEyLZkBvpM')
    .setAllowOverride(true);

  config
    .newTextInput()
    .setId('tablename')
    .setName('Enter name of table in above airtable base')
    .setHelpText('e.g. Design Projects')
    .setPlaceholder('Design Projects ')
    .setAllowOverride(true);
  return config.build();
}

function getFields() {
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  fields
    .newDimension()
    .setId('id')
    .setName('Id')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('title')
    .setName('Title')
    .setType(types.TEXT);

  fields
    .newMetric()
    .setId('count')
    .setName('Count')
    .setType(types.NUMBER);
  
  return fields; 
}

function getSchema(request) {
  return {schema: getFields().build()};
}

function getData(request) {
  var requestedFieldIds = request.fields.map(function(field) {Logger.log(request.fields);
    return field.name;
  });

  var requestedFields = getFields().forIds(requestedFieldIds);

  var API_KEY = request.configParams.apikey;
  var BASE_ID = request.configParams.baseid;
  var TABLE_NAME = request.configParams.tablename;
  
  var url = [
    'https://api.airtable.com/v0/',
    BASE_ID,
    '/',
    encodeURIComponent(TABLE_NAME),
    '?api_key=',
    API_KEY
  ];
  var rawResponse = UrlFetchApp.fetch(url.join(''), {muteHttpExceptions: true})
  var response = JSON.parse(rawResponse);
  var records = response.records;
        
  var data = [];
  
  records.forEach(function(record) {
    var values = [];
    requestedFields.asArray().forEach(function(field) {
      
      switch(field.getId()) {
        case 'id':
          values.push(record.id)
          break;
        case 'title':
          values.push(record.fields.Name);
          break;
        case 'count':
          values.push(1);
          break;
        default:
          values.push('');
      }
    });
    Logger.log(data);
    data.push({values: values});
  });
    
  return {
    schema: requestedFields.build(),
    rows: data
  };
}   


function getAuthType() {
  var cc = DataStudioApp.createCommunityConnector();
  return cc.newAuthTypeResponse()
    .setAuthType(cc.AuthType.NONE)
    .build();
}

//function resetAuth() {
//  var userProperties = PropertiesService.getUserProperties();
//  userProperties.deleteProperty('dscc.key');
//}
//
//function isAuthValid() {
//  var userProperties = PropertiesService.getUserProperties();
//  var key = userProperties.getProperty('dscc.key');
//  return validateKey(key);
//}
//
//function setCredentials(request) {
//  var key = request.key;
//
//  var userProperties = PropertiesService.getUserProperties();
//  userProperties.setProperty('dscc.key', key);
//  return {
//    errorCode: 'NONE'
//  };
//}
//
//function validateKey(key) {
//  var url = [
//    'https://api.airtable.com/v0/apphp10uEyLZkBvpM/Design%20Projects?api_key=',
//    key
//  ];
//  var response = JSON.parse(
//    UrlFetchApp.fetch(url.join(''), {muteHttpExceptions: true})
//  );
//
//  return response.status == 'OK';
//}
//
//function checkForValidKey(key) {
//  return true;
//}

function isAdminUser() {
  return true;
}
