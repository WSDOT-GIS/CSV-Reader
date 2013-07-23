Alternate CSV parsing method (Unfinished)
=========================================

Below is an alternate CSV parsing method that I was working on before finding the [CSV Parsing code from StackOverflow] by [Kirtan].  

It still needs work, as it simply skips blank entries, resulting in subsequent items being placed in the wrong columns.

```javascript

	/** Converts a line from a CSV file into an array of strings.
	@returns {String[]}
	*/
	function csvLineToArray(/*String*/ line) {
		var output = [], elementRe = /(?:("(?:[^"]|"{2})+"))|([^,]+)/gi, match, i, l, textContent = /^("?)(.+)\1$/i, element;
		elementRe = /(?:("(?:[^"]|"{2})+"))|([^,]+)|(,{2})/gi
		match = line.match(elementRe);

		for (i = 0, l = match.length; i < l; i += 1) {
			// Remove surrounding quotes (if applicable).
			element = match[i].match(textContent)[2];
			// Replace escapted quotes.
			element = element.replace(/"{2}/g, '"');
			output.push(element);
		}

		return output;
	}

	/** Converts a CSV table string into an array of arrays.
	* @returns {String[][]}
	*/
	function csvToArray(/*String*/ csv) {
		var lineRe = /^.+$/gim, lines, output = [], i, l;
		/*string[]*/ lines = csv.match(lineRe);

		for (i = 0, l = lines.length; i < l; i += 1) {
			output.push(csvLineToArray(lines[i]));
		}

		return output;
		
	}
```

[CSV Parsing code from StackOverflow]:http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
[Kirtan]:http://stackoverflow.com/users/83664/kirtan