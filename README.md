# detroit


The Detroit platform is a lightweight Model/Controller framework written in Java and JavaScript by way of the <a href='https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino'>Mozilla Rhino</a> Project. 
This is not an MVC in that there is no mechanism for templating; this is by design.

Tests are handled by the 'detest' wrapper, which loads the Rhino libraries and the JS test files, models, and environment necessary to perform unit tests.

To get started, you will need to install Tomcat.  By cloning this repository into the webapps dir, you should be able to start Detroit with the existing Example files. In order to run tests or to compile the Java source, a file called 'source_this' is included which sets all of the necessary paths and environment variables.



<p>

<b>History</b>
<p>
Detroit started out as a 'fun' project at <a href='http://badgeville.com'>Badgeville</a> to see if we could build part or all of our 'next generation' platform on it.  It was never implemented in production, and sat on the shelf for long enough to have its components obsoleted.  The current incarnation is a complete rewrite using most of the same tools, namely:  <a href='http://mongodb.org'>MongoDB</a>, <a href='https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino'>Rhino</a>, and Apache <a href='https://commons.apache.org/proper/commons-io/'>Commons IO</a>.  The name 'Detroit' came from the fact that we were naming each revision of our API based upon cities in alphabetical order, and the next version ( after Cairo ) would've been a 'D' city.


<p>
<b>Development</b>
<p>

Development and test cycles in Detroit are extremely fast; during development, hitting any API endpoint with the 'debug=true' flag set in the query params will cause all of the JS code to be re-evaluated on the fly. With the example JS files out of the box, the difference in API response time is 5-10ms per API call depending on the underlying hardware.
<p>
After sourcing the 'source_this' file, in order to get started quickly, you can simply type:
<pre>
   bash$  detonate somename
</pre>
This will create a model, controller, and associated tests for the class 'somename' which can then be edited as needed.

<p>
<b>Routes</b>
<p>
Routes are configured as a global in the JavaScript scope and are made up of a hash of entries with regular expressions as keys.  Values can be a single hash, or an array of hashes, should the key match for multiple HTTP commands.
<p>
Example:

<pre>

routes = {
  "/blog/posts": new Array( { command: "GET", method: "BlogController.index" }, { command: "POST", method: "BlogController.create" } ),
  "/blog/posts/(.*)": { command: "GET", method: "BlogController.show", param_labels: [ 'blogpost_id' ] },
}

</pre>

<br>



<p>
<b>Testing</b>
<p>

As previously mentioned, tests are run via the 'detest' test harness. For example:
<pre>
🍺  detest tests/models/example_test.js 
Running tests: tests/models/example_test.js
Running command: java org.mozilla.javascript.tools.shell.Main -f js/routes.js -f js/api.js -f tests/detroit_tester.js -f js/models/base.js -f js/models/example.js -f tests/models/example_test.js -f tests/finalize.js
DetroitTester: Beginning tests...
DetroitTester: Initializing tester...
Can instantiate example: Passed
Can save and reload: Passed</font>
Printing summary:
   Passed: 2
   Failed: 0
</pre>




<p><br>

<b>Performance</b>

Extremely preliminary testing, but the following httperf results comparing NodeJS and Detroit fetching the same data set:


<b>NodeJS</b>
<pre>
🍺  httperf --server localhost --port 8888 --num-conns 100 --rate 200  --timeout 1 --num-calls=1
httperf --timeout=1 --client=0/1 --server=localhost --port=8888 --uri=/ --rate=200 --send-buffer=4096 --recv-buffer=16384 --num-conns=100 --num-calls=1
Maximum connect burst length: 1

Total: connections 100 requests 100 replies 100 test-duration 0.500 s

Connection rate: 199.9 conn/s (5.0 ms/conn, <=13 concurrent connections)
Connection time [ms]: min 2.6 avg 22.2 max 67.9 median 15.5 stddev 19.7
Connection time [ms]: connect 0.2
Connection length [replies/conn]: 1.000

Request rate: 199.9 req/s (5.0 ms/req)
Request size [B]: 62.0

Reply rate [replies/s]: min 0.0 avg 0.0 max 0.0 stddev 0.0 (0 samples)
Reply time [ms]: response 22.0 transfer 0.0
Reply size [B]: header 133.0 content 3908.0 footer 2.0 (total 4043.0)
Reply status: 1xx=0 2xx=100 3xx=0 4xx=0 5xx=0

CPU time [s]: user 0.04 system 0.40 (user 7.4% system 79.8% total 87.1%)
Net I/O: 801.2 KB/s (6.6*10^6 bps)

Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0
[wedge@zaphod bg:0 cm:970 08:42:18 /usr/local/tomcat/webapps/detroit]

</pre>

<b>Detroit</b>
<pre>
🍺  httperf --timeout=1 --client=0/1 --server=localhost --port=8080 --uri=/detroit/api/examples --rate=300 --send-buffer=4096 --recv-buffer=16384 --num-conns=100 --num-calls=2
httperf --timeout=1 --client=0/1 --server=localhost --port=8080 --uri=/detroit/api/examples --rate=300 --send-buffer=4096 --recv-buffer=16384 --num-conns=100 --num-calls=2
Maximum connect burst length: 1

Total: connections 100 requests 200 replies 200 test-duration 0.335 s

Connection rate: 298.2 conn/s (3.4 ms/conn, <=4 concurrent connections)
Connection time [ms]: min 2.2 avg 3.7 max 11.1 median 2.5 stddev 1.8
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 2.000

Request rate: 596.5 req/s (1.7 ms/req)
Request size [B]: 82.0

Reply rate [replies/s]: min 0.0 avg 0.0 max 0.0 stddev 0.0 (0 samples)
Reply time [ms]: response 1.7 transfer 0.0
Reply size [B]: header 108.0 content 5137.0 footer 1.0 (total 5246.0)
Reply status: 1xx=0 2xx=200 3xx=0 4xx=0 5xx=0

CPU time [s]: user 0.04 system 0.28 (user 12.4% system 84.1% total 96.5%)
Net I/O: 3103.5 KB/s (25.4*10^6 bps)

Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0
</pre>
