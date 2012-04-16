/**
 * Test is the main control interface for Neustar Web Performance Management scripts. It is
 * exposed here as the global variable 'test'.  This object is effectively the "starting
 * point", as it serves as the interface for interacting with web sites (via
 * test.openBrowser() and test.openHttpClient() as well as the mechanism for controlling
 * transactions and steps (via test.beginTransaction() and test.beginStep(String)).
 *
 * For full documentation, see: http://docs.wpm.neustar.biz/testscript-api/
 **/

// Open the browser and return a WebDriver instance that allows the browser to be
// controlled.
var webDriver = test.openBrowser();

// Get the HTTP request interface used by the browser
var c = webDriver.getHttpClient();

// By default SSL Certificates are not validated.
// If you turn SSL Certificates Validation on, trying to connect
// to a Server that returns an invalid SSL Certificate will throw an exception.
// To turn SSL Certificate validation ON, uncomment the following line:
// c.setCheckValidSSL(true);

// Blacklist requests made to sites like Google Analytics and DoubleClick.  See the
// HttpClient.blacklistCommonUrls() documentation for a list of URLs currently blocked by
// this function.
c.blacklistCommonUrls();

// Because this script runs in a cloud network with much higher throughput than the
// average internet user has, the following settings will throttle throughput to simulate
// a business DSL line. Adjust these numbers to reflect different network conditions.
test.setDownstreamKbps(1024);   // 1 Mbps (max 6500 Kbps RBU, 1000 Kbps VU)
test.setUpstreamKbps(384);      // 384 Kbps (max 6500 Kbps RBU, 1000 Kbps VU)
test.setLatency(50);            // 50 ms latency

// Start logging HTTP traffic and timings
test.beginTransaction();

// Begin a new step, setting the step timeout to 15 seconds.  If the site takes longer than
// this to load the script will halt and an error will be reported.
test.beginStep("Check Website", 15000);

// Navigate the browser to the website
var r = webDriver.get("http://bgmaps.explosion-team.spb.ru/");
// Wait up to 15 seconds for all network traffic to complete.  2 seconds of idle time is
// required before continuing.  The 2 seconds wait will not contribute to your page load
// time.
test.waitForNetworkTrafficToStop(2000, 15000);

// End the step
test.endStep();

test.beginStep("Go to random place", 15000);

var selenium = webDriver.getSelenium();
var count = selenium.getXpathCount("//ul/li");
var selected = Math.floor(Math.random() * count) + 1;
selenium.click("//ul/li[" + selected + "]/a");
selenium.waitForPageToLoad(5000);

test.waitForNetworkTrafficToStop(2000, 15000);

// End the step
test.endStep();

// Finish the transaction.  For monitoring only the last transaction is recorded.  An
// error will be reported if no content was downloaded (or if only an error page was
// loaded).
test.endTransaction();
