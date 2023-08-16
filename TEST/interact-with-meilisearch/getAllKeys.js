const { MeiliSearch } = require('meilisearch');

const client = new MeiliSearch({
  host: 'http://50.116.10.156:7700',
  apiKey: '1q2w3e4r5t'
});

async function getApiKeys() {
    try {
        const response = await client.getKeys();
        console.log(response);
    } catch (error) {
        console.log('err', error);
    }
}

getApiKeys();