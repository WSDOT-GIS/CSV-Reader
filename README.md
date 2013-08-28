CSV Reader
==========

An [AMD] JavaScript library for parsing CSV. 
A sample application is available [here](http://wsdot-gis.github.io/CSV-Reader-Demo/) ([source](https://github.com/wsdot-gis/CSV-Reader-Demo/)).

## Components ##

### main.js ###
This is the main module that contains the CSV parsing code.

### csvArcGis.js ###
This is intended for use with the [ArcGIS API for JavaScript]. Functions available for converting a CSV point coordinates and converting it into [Graphic objects](https://developers.arcgis.com/en/javascript/jsapi/graphic-amd.html).

### csvHtml.js ###
Contains functions for converting CSV to HTML tables.

## Documentation ##
The JavaScript files contain [JSDoc] comments. This is currently the only documentation available.


## Acknowledgements ##

* [CSV Parsing code from StackOverflow] by [Kirtan]

[ArcGIS API for JavaScript]:http://js.arcgis.com/
[CSV Parsing code from StackOverflow]:http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
[JSDoc]:http://usejsdoc.org/
[Kirtan]:http://stackoverflow.com/users/83664/kirtan
[require.js]:http://requirejs.org/
[AMD]:https://github.com/amdjs/amdjs-api/wiki

## License ##
[The MIT License (MIT)](http://opensource.org/licenses/MIT)

See [LICENSE](LICENSE) file for details.
