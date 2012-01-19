jQuery populateTable by [RaphaelDDL][rddl]
=============

A jQuery plugin that populate tables in any way user want, including: adding html, concatenating values into a single column, setting default value when key/value is null and other stuff.


### Installation

* Include jQuery library in your page header if you haven't done so. `<script type="text/javascript" src="path/to/jquery-1.7.1.min.js"></script>`. Tested only in 1.7.1, need to check on lower ones.
* Include populateTable .js file in your page header also. `<script type="text/javascript" src="path/to/jquery.populateTable-0.1.4.min.js"></script>`
* This plugin supports [TableSorter by Christian Bach][tbls] so if you want, add it also `<script type="text/javascript" src="path/to/jquery.tablesorter.min.js"></script>`

Currently only JSON objects are supported. I will extend it for XML also. However, while we don't have this option, you can use the epic [jQuery XML to JSON Plugin][xml2json] to transform XML into JSON object.


### Explanation on how use the Options

	$('#yourTable').populateTable( JSON_OBJECT ,{ OPTIONS });

The `JSON_OBJECT` can be obtained by using `$.parseJSON()` in a string containing a json structure or in the most common method, with the xhr object returned by an ajax call.


		tableSorterOpt:{
			widthFixed: true
		}, tableHeads: {
			values: [
				{headText:'User'},
				{headText: 'Tweet'},
				{headText:'Metadata'}
			]
		},tableData: {
			emptyMsg: 'N&atilde;o h&aacute; dados dispon&iacute;veis',
			dataRoot:'results',
			dataRepeat: {
			values: [
				{fieldTxt: '<img src="%{profile_image_url}" style="float:left;width:32px;height:32px;margin:0 10px 5px 0;" alt="" /><strong>%{from_user_name}</strong><br /><a href="http://twitter.com/%{from_user}">@%{from_user}</a>', emptyTxt:'N/D'},
				{fieldTxt: '%{text}', emptyTxt:'N/D'},
				{fieldTxt: '%{metadata.result_type}', emptyTxt:'N/D'}
				]
			}
		}, tablePreCallback: {
			tbCb: testcallback
		}, tableCallback: {
			tbCb: testcallback
		}
	});




### How to use

Considering you already know what is JSON and understand it's structure, let's take Twitter's Search JSON as example (removed some info not needed), since it's well constructed and easy to understand:

	{
	  "page": 1, 
	  "query": "hadouken", 
	  "results": [
	    {
	      "created_at": "Thu, 19 Jan 2012 16:35:44 +0000", 
	      "from_user": "juliamde", 
	      "from_user_id": 109691553, 
	      "from_user_id_str": "109691553", 
	      "from_user_name": "Julia Medeiros", 
	      "geo": null, 
	      "id": 160037737272049664, 
	      "id_str": "160037737272049664", 
	      "iso_language_code": "pt", 
	      "metadata": {
	        "result_type": "recent"
	      }, 
	      "profile_image_url": "http://a0.twimg.com/profile_images/1723656611/P1000839_normal.JPG", 
	      "profile_image_url_https": "https://si0.twimg.com/profile_images/1723656611/P1000839_normal.JPG", 
	      "source": "&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;", 
	      "text": "\u00f3i meu deus meu cachorro deu um  hadouken numa mosca", 
	      "to_user": null, 
	      "to_user_id": null, 
	      "to_user_id_str": null, 
	      "to_user_name": null
	    }, 
	    {
	      "created_at": "Thu, 19 Jan 2012 16:34:34 +0000", 
	      "from_user": "takumi505", 
	      "from_user_id": 99673686, 
	      "from_user_id_str": "99673686", 
	      "from_user_name": "\u0451", 
	      "geo": null, 
	      "id": 160037441795932162, 
	      "id_str": "160037441795932162", 
	      "iso_language_code": "ja", 
	      "metadata": {
	        "result_type": "recent"
	      }, 
	      "profile_image_url": "http://a0.twimg.com/profile_images/1320699394/101120_0036_01_normal.jpg", 
	      "profile_image_url_https": "https://si0.twimg.com/profile_images/1320699394/101120_0036_01_normal.jpg", 
	      "source": "&lt;a href=&quot;http://twtr.jp&quot; rel=&quot;nofollow&quot;&gt;Keitai Web&lt;/a&gt;", 
	      "text": "\u4eca\u5e74\u306f\uff7b\uff8f\uff7f\uff86,\uff8c\uff7c\uff9e\uff9b\uff6f\uff78\u304b\u306bfoo fighters,\uff7b\uff8f\uff7f\uff86\u306b\u306fHADOUKEN!,slipknot,maroon5\u306a\u4e88\u611f\u304c\u3059\u308b blink-182\u3082\u6765\u305d\u3046\u306a\u4e88\u611f\u304c\u3042\u308b", 
	      "to_user": null, 
	      "to_user_id": null, 
	      "to_user_id_str": null, 
	      "to_user_name": null
	    }
	  ], 
	  "results_per_page": 15
	}

We'll use `results` as our root and it's child objects as our data for rows. The aim is create a table with user image, name and @, and the tweet text.

1. Create an empty table somewhere in your page and give it an ID. I recommend not using class as will create tables with the same content. Unless that's what you expect :)

`<table class="zebra-striped" id="tableJSON"></table>`


2. Now get your JSON with your preferred way (AJAX call, for e.g.) and call populateTable in the `success`. (I like to separate the call from populateTable using a function not mess with AJAX but it's up to you).

	$.ajax({
		url: 'http://search.twitter.com/search.json',
		dataType: 'jsonp',
		data: 'q=hadouken',
		error: function(xhr, textStatus, errorThrown){
			console.log('===> Error');
			//some error handler
		},
		success: function(xhr, textStatus, errorThrown) {
			console.log('===> Success');
			
			//Here we call populateTable. As i stated, i let in a function to not mess
			createTableJSON(xhr);
		}
	});
	
	
	function createTableJSON(xhrJson){
		$('#tableJSON').populateTable(xhrJson,{
			tableSorterOpt:{
				widthFixed: true
			}, tableHeads: {
				values: [
					{headText:'User'},
					{headText: 'Tweet'},
					{headText:'Metadata'}
				]
			},tableData: {
				emptyMsg: 'N&atilde;o h&aacute; dados dispon&iacute;veis',
				dataRoot:'results',
				dataRepeat: {
				values: [
					{fieldTxt: '<img src="%{profile_image_url}" style="float:left;width:32px;height:32px;margin:0 10px 5px 0;" alt="" /><strong>%{from_user_name}</strong><br /><a href="http://twitter.com/%{from_user}">@%{from_user}</a>', emptyTxt:'N/D'},
					{fieldTxt: '%{text}', emptyTxt:'N/D'},
					{fieldTxt: '%{metadata.result_type}', emptyTxt:'N/D'}
					]
				}
			}
		});
	}

Let's tear this code into pieces:

	$('#tableJSON').populateTable(xhrJson,{


















[rddl]: http://raphaelddl.com
[tbls]: http://tablesorter.com
[xml2json]: http://www.fyneworks.com/jquery/xml-to-json/