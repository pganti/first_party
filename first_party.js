var WebPagetest = require('webpagetest'),
    os         = require('os'),
    url         = require('url'),
    request = require('request-json'),
    http        = require('http');

var wpt = new WebPagetest('localhost');
var fs = require('fs');
var blacklist = fs.readFileSync('blacklist.txt').toString().trim().split("\n");
var regex = new RegExp('('+blacklist.join("|")+')','ig')

var server = http.createServer(function (req, res) {

  var uri = url.parse(req.url, true);
  res.setHeader('Content-Type', 'textplain');
  res.writeHead(200);
  wpt.runTest(uri.query.test_url, {

  	firstViewOnly: true,
	location: 'US_West_wptdriver:Chrome',
	ignoreSSL:true,
	connectivity:'Native',
	runs: 1,
	priority: 0,
	disableOptimization: true,
	disableScreenshot: true,
	keepOriginalUserAgent: true
	},function(err, init_res) {

		function checkStatus() {

		   wpt.getTestStatus(init_res.data.testId, function (err, resp_data) {

			if (!resp_data.data.completeTime) {
				// polling status (every second)
				setTimeout(checkStatus, 1000);
			} else {
				var client = request.newClient('http://localhost/');
				client.get("/domains.php?test="+init_res.data.testId+'&f=json', function(err, resp, body) {
					fv =body.domains.firstView;
					// foreach is synchronous
					fv.forEach(function(obj) {
					   if (uri.query.nobl) {
						res.write(obj.domain+"\n")
					   } else {
						if (obj.domain.search(regex) == -1)  res.write(obj.domain+"\n");
					   }
					});
					res.end();
				});
			}
			});
		}
		checkStatus();
	});
});
  server.listen(5000);
