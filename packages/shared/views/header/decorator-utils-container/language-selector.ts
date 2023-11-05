import clsx from 'clsx';
import html from '../../../html';
import { AvailableLanguage } from '../../../params';
import { DownChevronIcon, GlobeIcon } from '../../icons';
import cls from './language-selector.module.css';

export type LanguageSelectorProps = {
  availableLanguages: AvailableLanguage[];
};

export const LanguageSelector = ({
  availableLanguages,
}: LanguageSelectorProps) => html`
  <nav
    is="language-selector"
    class="${clsx(cls.languageSelector, {
      [cls.empty]: availableLanguages.length === 0,
    })}"
  >
    <button type="button" class="${cls.button}">
      ${GlobeIcon({ className: cls.icon })}
      <span>
        <span lang="nb">Språk</span>/<span lang="en">Language</span>
      </span>
      ${DownChevronIcon({ className: cls.icon })}
    </button>
  </nav>
`;
