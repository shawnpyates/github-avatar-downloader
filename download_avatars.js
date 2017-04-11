const request = require('request');
const fs = require('fs');
const GITHUB_USER = "shawnpyates";
const GITHUB_TOKEN = require('./import').githubToken;

console.log("Welcome to the Github Avatar Downloader!");


//obtain information from GitHub API
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
  // wait for all data chunks to load, and then parse them at the end
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

// accept standard input from user
const argForOwner = process.argv[2];
const argForRepo = process.argv[3];

// for each user in the API, extract their avatar URL for downloading
// and save the image under a name that contains their login name
getRepoContributors(argForOwner, argForRepo, (err, result) => {
  if (!(argForOwner && argForRepo)){
    console.log("Please specify an owner and repository name.");
  }
  if(err) {
    console.error('Something went wrong: ', err.message);
    return;
  }
  for (let i = 0; i < result.length; i++) {
    downloadImageByURL(result[i]['avatar_url'], `./avatarsFolder/${result[i]['login']}.jpg`);
  }
});

// download each image and write a file for it to be saved in
function downloadImageByURL(url, filePath) {
  request
    .get(url)
    .on('error', (err) => {
      console.error("Error: ", err.message);
    })
    .on('response', (response) => {
      if (response.statusCode !== 200) {
        console.error("Something went wrong: ", response.statusCode);
      }
    })
    .on('end', () => {
      console.log("Download complete.");
    })
    .pipe(fs.createWriteStream(filePath));
}



