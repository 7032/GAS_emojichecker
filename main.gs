//========================================================================================
//  Written by Naomitsu Tsugiiwa/7032 https://github.com/7032
//  This source is under MIT license. Please read LICENSE.
//  (C)2023 Naomitsu Tsugiiwa all rights reserved.
//========================================================================================
//----------------------------------------------------------------------------------------
//  local functions
//----------------------------------------------------------------------------------------
function  _SendMessageToSlack(propName,message) {
  const propService = PropertiesService.getScriptProperties();
  const url  = propService.getProperty(propName);
  try {
    var response  = UrlFetchApp.fetch(
                      //  URL stored in the property
                      url,
                      //  Options set to header and payload
                      {
                        "method" :            "POST",
                        "headers":            { "Content-Type" : "application/json", },
                        "payload":            JSON.stringify({ "text" : message }),
                        "muteHttpExceptions": true
                      }
                    );
  }
  catch (e) {
    console.log("[Slack:WebHook error]"+JSON.stringify(e)+"\nURL:"+url);
  }
}

//========================================================================================
//  Entry when POST was sent
//========================================================================================
function  doPost(e) {
  const rowData = e.postData.getDataAsString();
  const jsonData = JSON.parse(rowData);
  //  check event
  if (jsonData["event"]) {
    if (jsonData["event"]["type"]) {
      switch(jsonData.event.type) {
      //  EMOJI
      case  "emoji_changed": {
        //  Add EMOJI
        const emojiName = jsonData.event.name;
        const emojiVal  = jsonData.event.value;
        const emojiAli  = "alias:";
        var   strMessage= "*[New EMOJI]* :"+emojiName+": is added as *`:"+emojiName+":`* !!!\n";
        if (emojiVal.slice(0,emojiAli.length) == emojiAli) {
          const emojiOrginal  = emojiVal.slice(emojiAli.length);
          strMessage  +=  "This is just an *alias* of *`:"+emojiOrginal+":`* :"+emojiOrginal+":";
        } else {
          strMessage  +=  "Original picture is "+emojiVal;
        }
        _SendMessageToSlack("Webhook-EMOJI",strMessage);
        }
        break;
      }
    }
  }

  //  return a response as HTML to confirm the challenge
  if (jsonData['challenge']) {
    const output = ContentService.createTextOutput(jsonData['challenge']);
    output.setMimeType(ContentService.MimeType.TEXT);
    return output;
  }
  const output = ContentService.createTextOutput("ok");
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}
