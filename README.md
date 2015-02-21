# first_party
Given any website, generate a list of domains that we consider as "first-party"  i.e exclude third party domains 

# Pre-Requisites
This code assumes you have a working instance of WebPageTest running (you can always fall back to the public one)

# Basic WorkFlow

We take a URL and ask WPT to run it for us on a chrome browser. Then we interrogate the WPT server to give us the domains that make up the page which then are subsequently filtered by looking up a third party blacklist.

# Usage
curl http://<your_wpt_server>:5000?url=[input_url_to_test]

