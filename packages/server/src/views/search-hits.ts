import html from 'decorator-shared/html';
import { SearchResult } from 'decorator-shared/types';
import { SearchShowMore } from './search-show-more';
import cls from 'decorator-client/src/styles/search-hits.module.css';

export type SearchHitsProps = {
  results: SearchResult;
  word: string;
};

export const SearchHits = ({ results, word }: SearchHitsProps) => html`
  <ul class="${cls.searchHitList}">
    ${results.hits.map(
      (hit) => html`
        <li>
          <search-hit>
            <h2 slot="title">${hit.displayName}</h2>
            <p slot="description">${hit.highlight}</p>
          </search-hit>
        </li>
      `,
    )}
  </ul>
  ${SearchShowMore({
    word,
    total: results.total,
  })}
`;
