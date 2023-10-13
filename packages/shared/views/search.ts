import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { IconButton } from 'decorator-shared/views/components/icon-button';
import { SearchIcon } from 'decorator-shared/views/icons/search';

// @fix typescript error
import utilClasses from 'decorator-client/src/styles/utils.module.css';
import utilCls from 'decorator-shared/utilities.module.css';
import classes from 'decorator-client/src/styles/search.module.css';
import dropdownClasses from 'decorator-client/src/styles/dropdown-menu.module.css';
import clsx from 'clsx';

export default function Search({ texts }: { texts: Texts }) {
  return html`
    <dropdown-menu>
      ${IconButton({
        Icon: SearchIcon({
          menuSearch: true,
        }),
        text: texts.search,
        className: classes.searchButton,
      })}
      <div
        class="${clsx(
          utilCls.contentContainer,
          classes.dropdown,
          dropdownClasses.dropdownMenuContent,
        )}"
      >
        <label for="${classes.searchInput}" class="${utilClasses.bigLabel}"
          >${texts.sok_knapp_sokefelt}</label
        >
        <div class="${classes.searchInputWrapper}">
          <input class="${classes.searchInput}" type="text" />
          ${IconButton({
            Icon: SearchIcon({}),
            text: texts.search,
            className: classes.blueBgIcon,
          })}
        </div>
        <div id="search-hits">
          <ul class="${classes.searchHitList}"></ul>
          <div id="show-more"></div>
        </div>
      </div>
    </dropdown-menu>
  `;
}
