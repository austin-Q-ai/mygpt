const { MeiliSearch } = require('meilisearch');
const movies = require('./movies.json');

const client = new MeiliSearch({
  host: 'http://50.116.10.156:7700',
  apiKey: '1q2w3e4r5t'
});

async function addMoviesToIndex() {
  try {
    const index = client.index('movies');
    const response = await index.addDocuments(movies);
    console.log(response);
  } catch (error) {
    console.error('err', error);
  }
}

addMoviesToIndex();