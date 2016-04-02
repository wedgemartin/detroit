# detroit

Detroit

The Detroit platform is a lightweight Model/Controller framework written in Java and JavaScript by way of the <a href='https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino'>Mozilla Rhino</a> Project. 
This is not an MVC in that there is no mechanism for templating, though there may be a future addition.

Tests are handled by the 'detest' wrapper, which loads the Rhino libraries and the JS test files, models, and environment necessary to perform unit tests.

To get started, you will need to install Tomcat.  By cloning this repository into the webapps dir, you should be able to start Detroit with the existing Example files. In order to run tests or to compile the Java source, a file called 'source_this' is included which sets all of the necessary paths and environment variables.

