import React from 'react';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const searchClient = instantMeiliSearch(
  'http://50.116.10.156:7700',
  '2306d45c66453e622b9178211e215f15c72568cd6d89c2eec74ea51270a3df89'
);

const App = () => (
  <InstantSearch
    indexName="movies"
    searchClient={searchClient}
  >
    <SearchBox />
    <Hits hitComponent={Hit} />
  </InstantSearch>
);

const Hit = ({ hit }) => <Highlight attribute="title" hit={hit} />;

export default App