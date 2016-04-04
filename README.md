# detroit

Detroit

The Detroit platform is a lightweight Model/Controller framework written in Java and JavaScript by way of the <a href='https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino'>Mozilla Rhino</a> Project. 
This is not an MVC in that there is no mechanism for templating, though there may be a future addition.

Tests are handled by the 'detest' wrapper, which loads the Rhino libraries and the JS test files, models, and environment necessary to perform unit tests.

To get started, you will need to install Tomcat.  By cloning this repository into the webapps dir, you should be able to start Detroit with the existing Example files. In order to run tests or to compile the Java source, a file called 'source_this' is included which sets all of the necessary paths and environment variables.





<p><br>

<b>Performance</b>

Extremely preliminary testing, but the following httperf results comparing NodeJS and Rhino/Detroit fetching the same data set:


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
🍺  httperf --server localhost --port 8080 --num-conns 100 --rate 200  --timeout 1 --uri /detroit/api/examples --num-calls=1
httperf --timeout=1 --client=0/1 --server=localhost --port=8080 --uri=/detroit/api/examples --rate=200 --send-buffer=4096 --recv-buffer=16384 --num-conns=100 --num-calls=1
Maximum connect burst length: 1

Total: connections 100 requests 100 replies 100 test-duration 0.497 s

Connection rate: 201.1 conn/s (5.0 ms/conn, <=1 concurrent connections)
Connection time [ms]: min 1.3 avg 1.8 max 3.7 median 1.5 stddev 0.5
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 201.1 req/s (5.0 ms/req)
Request size [B]: 82.0

Reply rate [replies/s]: min 0.0 avg 0.0 max 0.0 stddev 0.0 (0 samples)
Reply time [ms]: response 1.6 transfer 0.0
Reply size [B]: header 109.0 content 5242.0 footer 2.0 (total 5353.0)
Reply status: 1xx=0 2xx=100 3xx=0 4xx=0 5xx=0

CPU time [s]: user 0.11 system 0.38 (user 21.5% system 76.5% total 98.0%)
Net I/O: 1067.0 KB/s (8.7*10^6 bps)

Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0

</pre>
