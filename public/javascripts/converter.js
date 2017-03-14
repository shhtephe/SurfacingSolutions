//
//  converter.js
//  Mr-Data-Converter
//
//  Created by Shan Carter on 2010-09-01.
//



function DataConverter(nodeId) {
  //---------------------------------------
  // PUBLIC PROPERTIES
  //---------------------------------------

  this.nodeId                 = nodeId;
  this.node                   = $("#"+nodeId);

  this.outputDataType         = "json";

  this.columnDelimiter        = "\t";
  this.rowDelimiter           = "\n";

  this.importInputTextArea    = {};
  this.outputTextArea         = {};

  this.inputHeader            = {};
  this.outputHeader           = {};
  this.dataSelect             = {};

  this.inputText              = "";
  this.outputText             = "";

  this.newLine                = "\n";
  this.indent                 = "  ";

  this.commentLine            = "//";
  this.commentLineEnd         = "";
  this.tableName              = "MrDataConverter"

  this.useUnderscores         = true;
  this.headersProvided        = true;
  this.downcaseHeaders        = true;
  this.upcaseHeaders          = false;
  this.includeWhiteSpace      = true;
  this.useTabsForIndent       = false;

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function(w,h, _gaq) {
  var self = this;

  //build HTML for converter
  this.importInputHeader = $('<div class="importGroupHeader" id="importInputHeader"><p class="importGroupHeadline">Copy and Paste Excel Data below:</p></div>');
  this.importInputTextArea = $('<textarea class="importTextInputs" id="dataInput"></textarea>');
  this.node.append(this.importInputHeader);
  this.node.append(this.importInputTextArea);


  /*$("#insertSample").bind('click',function(evt){
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
    _gaq.push(['_trackEvent', 'SampleData','InsertGeneric']);
  });*/

  //$("#dataInput").keyup(function() {self.convert()});
  $("#dataInput").change(function() {
    self.convert();
    _gaq.push(['_trackEvent', 'DataType',self.outputDataType]);
  });

  $("#dataSelector").bind('change',function(evt){
       self.outputDataType = $(this).val();
       self.convert();
     });

  this.resize(w,h);
}

DataConverter.prototype.resize = function(w,h) {

  var paneWidth = (w-90)/2-20;;
  var paneHeight = (h-90)/2-20;

  this.node.css({width:paneWidth});
  this.importInputTextArea.css({width:paneWidth-20,height:paneHeight});

}

DataConverter.prototype.convert = function() {

  this.inputText = this.importInputTextArea.val();
  this.outputText = "";

  //make sure there is input data before converting...
  if (this.inputText.length > 0) {

    if (this.includeWhiteSpace) {
      this.newLine = "\n";
      // console.log("yes")
    } else {
      this.indent = "";
      this.newLine = "";
      // console.log("no")
    }

    CSVParser.resetLog();
    var parseOutput = CSVParser.parse(this.inputText, true, "tab", false, false);

    var dataGrid = parseOutput.dataGrid;
    var headerNames = parseOutput.headerNames;
    var headerTypes = parseOutput.headerTypes;
    var errors = parseOutput.errors;

    this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine);
  
    var jsonArray = {
        data : "",
        errors : ""
      };

    jsonArray.data = JSON.parse(this.outputText);
    console.log(jsonArray.data)
    var columnToCheck = ["manufacturer", "distributor", "materialType", "colourGroup", "description", "matCollection", "itemCode", "thickness", "length", "width", "quarterSheet", "halfSheet", "fullSheet1", "fullSheet5", "fullSheet21", "isa", "sale"];

    if (jsonArray.data.length !== 0) {
      for (var i = columnToCheck.length - 1; i >= 0; i--) {
        if (typeof jsonArray[0].data[columnToCheck[i]] === "undefined"){
          if (jsonArray.errors == "") {
            jsonArray.errors += "The following Columns are missing: \n";
          };
          jsonArray.errors += columnToCheck[i] + "\n"
        };
      };
    } else {
      jsonArray.errors += "Excel data invalid, please clear text and try again.";
    };

    if(jsonArray.errors !== "") {
      console.log("There are errors: \n" + jsonArray.errors);
    } else
    {
      console.log("All Columns are accounted for!");
    };
    console.log(jsonArray)
    return jsonArray;

//    this.outputTextArea.val(errors + this.outputText);

  }; //end test for existence of input text
};


