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
  request.get(options)
         .on('error', (err) => {
           cb;
         })
         .on('response', (response) => {
           console.log(`Response code: ${response.statusCode}\n`);
           console.log(`Response message: ${response.statusMessage}\n`);
           console.log(`Content type: ${response.headers['content-type']}\n`);
         })
         .on('data', (data) => {
           responseString += data;
         })
         .on('end', () => {
         let parsedResponse = JSON.parse(responseString);
         cb(parsedResponse);
         });
}

getRepoContributors("jquery", "jquery", (result) => {
  for (let i = 0; i < result.length; i++) {
    console.log(result[i]['avatar_url']);
  }
});