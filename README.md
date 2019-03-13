### Introduction

##### GeoGebra Script and limitations

GeoGebra offers powerful ways to interact with its API via its own scripting language "GeoGebra Script". Many great learning materials were made using this technique. When things get a little more complex, however, the built-in editor lacks basic development tools like syntax highlighting, autocompletion, linting and basic debugging helpers.

The scripting language also lacks basic features like loops and conditionals or they are hard to implement.

##### GeoGebra and JavaScript

It is also possible to create more complex worksheets by using JavaScript to interact with the API. When written in the editor provided by GeoGebra, many of the above mentioned problems occur as well.

But it is also possible to communicate with the API using JavaScript when GeoGebra apps embed in an ordinary HTML page. This offers many interesting possibilities.

*   First and foremost, it is possible to write the logic in a professional editor that provides the features that the built-in editor lacks. This greatly simplifies the development of resources.
*   Secondly, many learning resources that require user input, lack basic input validation. This is hard to achieve, when developing within the app itself. When using the approach presented here, all user inputs can be done within the html and can easily be validated via JavaScript. Very often, if the applet is not used EXACTLY as intended by its creator, its functionality breaks. Depending on the context (Think of exams in GeoGebra), this might be a problem. For this, a more robust approach is needed.
*   Last but not least this technique offers powerful ways of interaction between the DOM and GeoGebra. The DOM can be manipulated based on what is happening in the applet. Input fields, buttons and other DOM-Elements can be made visible only when they are needed. Because JavaScript is used to communicate with the Api many things get possible. We can communicate with databases to save results, or communicate with other apes like Moodle, or other things. Of course, JavaScript frameworks can be used for simplified DOM manipulation or extended features within JavaScript itself.