const request = require('request');
const GITHUB_USER = "shawnpyates";
const GITHUB_TOKEN = "51e91f5f725a8afeecea8212f548fd42c8b665b4";

console.log("Welcome to the Github Avatar Downloader!");


function getRepoContributors(repoOwner, repoName, cb) {
  let requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN
                 + '@api.github.com/repos/' + repoOwner + '/'
                 + repoName + '/contributors';
  console.log(requestURL);
  let options = {
    url: requestURL,
    headers: {
      'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    }
  }
  let responseString = "";
  request
    .get(options)
    .on('error', (err) => {
       cb(err);
    })
    .on('data', (data) => {
      responseString += data;
    })
    .on('end', function() {
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseString);
      } catch(ex) {
        return cb(ex);
      }
      if(this.response.statusCode !== 200) {
        return cb(new Error(parsedResponse.message));
      }
      cb(null, parsedResponse);
    });
}

getRepoContributors("jquery", "jquery", (err, result) => {
  if(err) {
    console.error('Something went wrong: ', err.message);
    return;
  }
  for (let i = 0; i < result.length; i++) {
    console.log(result[i]['avatar_url']);
  }
});

