/*
 * jQuery populateTable v0.1.3
 * http://raphaelddl.com
 * 
 * Copyright (c) 2012 Raphael "DDL" Oliveira
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License (CC BY-NC-SA 3.0) 
 * http://creativecommons.org/licenses/by-nc-sa/3.0/
 * 
 * This script supports TableSorter by Christian Bach ( http://tablesorter.com ) 
 *
 * ===============
 * TODO
 * ===============
 * - Support to TableSorter plugin 'tablesorterPager' ( http://tablesorter.com/docs/example-pager.html )
 * - Support TableSorter widget 'jFilterSelect' by Jordi Gironés ( http://www.jordigirones.com/131-filtros-desplegables-con-tablesorter.html )
 * - Try to not rely on 'jQuery XML to JSON Plugin' ( http://www.fyneworks.com/jquery/xml-to-json/ ) for XML
 * 
 * ===============
 * Special thanks to:
 * - Queness and it's jQuery Plugin Tutorial ( http://www.queness.com/post/112/a-really-simple-jquery-plugin-tutorial )
 * - All people who helped jQuery be what is.
 *
 * ===============
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ===============
 */
(function($){
	/* ===============
	// $(tableElem).populateTable({opts});
	// =============== */
    $.fn.extend({
        populateTable: function(options) {
            var defaults = {
            	tableSorter: {
					applyTS: false,
					tableSorterOpt: null
				},
                tableHeads: null,
                tablePreCallback: null,
                tableCallback: null,
                tableData: {
					data: null,
					emptyMsg: 'No data available.',
					loadMsg: 'Loading..',
					dataRoot:null,
					dataRepeat: null
				}
            }
            var options =  $.extend(defaults, options);
 
            return this.each(function() {
				/* ----Script Start---- */
                var o = options;
                var theTable = $(this);
                
                //lifting some empty vars
                var headList = '', footList = '', finalHeader = '', tableInsertData = '', dataInserted = '';
                
                /* ===============
				// Adding Loading msg
				// while JS works
				// =============== */
				if($.type(o.tableData.data) == 'object'){
					$(theTable).html('<tr><td style="vertical-align:middle;text-align:center;padding:5px 0;">'+o.tableData.loadMsg+'</td></tr>');
				}
                
               	/* ===============
				// Creating the 
				// THEAD and TFOOT
				// =============== */
				if($.type(o.tableHeads) == 'object'){

					$.each(o.tableHeads.values,function(i){
						var headTxt = o.tableHeads.values[i].headText;
						
						
						//TODO: jFilterSelect tableSorter widget support
						
						/*var headFilter = o.tableHeads.values[i].jFilterSelect;

						if($.type(headFilter) == 'boolean' && headFilter == true){
							headList = headList+'<th jFilterSelect="1">'+headTxt+'</th>';
						}else{*/
							headList = headList+'<th>'+headTxt+'</th>';
						/*}*/
						footList = footList+'<th>'+headTxt+'</th>';
					});
					
					/*
					pretty but will fuck up loading
					$(theTable).append('<thead/><tfoot/>');
					$(theTable).find('thead').append('<tr>'+headList+'</tr>');
					$(theTable).find('tfoot').append('<tr><td>'+footList+'</td></tr>');*/
					
					finalHeader = '<thead>'+
						'<tr>'+
							headList+
						'</tr>'+
					'</thead>'+
					'<tfoot>'+
						'<tr>'+
							footList+
						'</tr>'+
					'</tfoot>';
				}

				/* ===============
				// The Magic is here.
				// Lets populate, dood!
				// Warning: crappy code below
				// =============== */
				if($.type(o.tableData.data) == 'object'){
					var dataObj = o.tableData['data'];
					var dataRt = o.tableData['dataRoot'];
					var dataInfo = dataObj[dataRt];
					var dataValues = o.tableData.dataRepeat.values;
					
					if($.type(dataInfo) != "null"){
						tableInsertData = '<tbody>';
				
						if(o.tableHeads.values.length != o.tableData.dataRepeat.values.length){
							tableInsertData = tableInsertData+'<tr><td style="vertical-align:middle;text-align:center;" colspan="'+o.tableHeads.values.length+'">WARNING: Number of headers ('+o.tableHeads.values.length+') differs from number of data columns ('+o.tableData.dataRepeat.values.length+').<br />Check your script again.</td></tr>';
						}

						$.each(dataInfo,function(rowInd){
						//Each new TR
							tableInsertData = tableInsertData+'<tr id="'+dataRt+'-r'+rowInd+'">';
							
							$.each(dataValues, function(valInd,dtVal){
							//Each new TD of the current TR
								
								var insertEmpty = dtVal.emptyTxt;
								var dataContents = dtVal.fieldTxt;
								
								if($.type(dataContents) == 'string' && $.type(dataContents) != "null"){
									var regToFind = /%\{(.*?)\}/ig;
									var regResult = dataContents.match(regToFind);
									
										$.each(regResult,function(indx,foundField){
										//Each found %{nn}, replace with data values
											
											var dataField = foundField.replace(regToFind,"$1");
											
											//split dots to see if user is asking for object child
											var checkChild = dataField.split('.');
											
											if(checkChild.length > 1){
												toReplaceWith = 'dataInfo[rowInd]';
												for(i=0;i<checkChild.length;i++){
													toReplaceWith = toReplaceWith+'[\''+checkChild[i]+'\']';
												}
												toReplaceWith = eval(toReplaceWith); //lol@this eval
											}else{
												var toReplaceWith = dataInfo[rowInd][dataField];
											}

											if($.type(toReplaceWith) != "null" && $.type(toReplaceWith) != 'object'){
												//Found key asked by user, replacing with value
												dataContents = dataContents.replace(foundField,toReplaceWith);
											}else{
												//Key asked by user not found, print insertEmpty
												dataContents = dataContents.replace(foundField,insertEmpty);
											}
										});
									var dataValueInserted = dataContents;
								}
								tableInsertData = tableInsertData+'<td id="'+dataRt+'-r'+rowInd+'-c'+valInd+'">';
								tableInsertData = tableInsertData+dataValueInserted;
								tableInsertData = tableInsertData+'</td>';
							});
							
							tableInsertData = tableInsertData+'</tr>';
						});
						tableInsertData = tableInsertData+'</tbody>';
					}else{
						var tableIsEmpty = '<tbody><tr><td style="vertical-align:middle;text-align:center;" colspan="'+o.tableHeads.values.length+'">'+o.tableData.emptyMsg+'</td></tr></tbody>';
						$(theTable).append(tableIsEmpty);
					}
					
					
				}

				/* ===============
				// Inserting all data
				// =============== */
				if($.type(o.tableData.data) != "null"){
					$(theTable).html(''); //Clear Loading
					$(theTable).prepend(finalHeader);
					$(theTable).append(tableInsertData);
				}
				/* ===============
				// Calling any function before
				// finishing table (dateFormatter
				// or something, for e.g.)
				// =============== */
				if($.type(o.tablePreCallback) != "null" && $.type(o.tablePreCallback.tbCb) == 'function'){
					var preCallbackFnk = o.tablePreCallback.tbCb;
					preCallbackFnk.call(this);
				}
				
				setTimeout(function(){
					if($(theTable).find("tbody").find("tr").size() > 0){
						//Table is not empty
						
						if($.type(o.tableSorter) == 'object' && o.tableSorter.applyTS == true){
						//Apply tablesorter to table
							if($.type(o.tableSorterOpt) == 'object'){
								$(theTable).tablesorter(o.tableSorterOpt);
							}else{
								$(theTable).tablesorter();
							}
						}
					}else{
						//Table is empty
						$(theTable).append('<tbody><tr><td style="vertical-align:middle;text-align:center;" colspan="'+o.tableHeads.values.length+'">'+o.tableData.emptyMsg+'</td></tr></tbody>');
					}
					
					
					/* ===============
					// Calling any function after
					// finishing table (applying
					// binds, hover or something, for e.g.)
					// =============== */
					if($.type(o.tableCallback) != "null" && $.type(o.tableCallback.tbCb) == 'function'){
						var CallbackFnk = o.tableCallback.tbCb;
						CallbackFnk.call(this);
					}
					
				},1);

				/* ----Script End---- */
            });//return each
        }//populateTable
    });
})(jQuery);