import clsx from "clsx";
import cls from "decorator-client/src/styles/decorator-utils.module.css";
import utilsCls from "decorator-client/src/styles/utilities.module.css";
import html from "decorator-shared/html";
import {
    AvailableLanguage,
    Breadcrumb,
    UtilsBackground,
} from "decorator-shared/params";
import { Breadcrumbs } from "decorator-shared/views/breadcrumbs";
import { LanguageSelector } from "./language-selector";
import i18n from "../i18n";

export type DecoratorUtilsProps = {
    breadcrumbs: Breadcrumb[];
    availableLanguages: AvailableLanguage[];
    utilsBackground: UtilsBackground;
    frontPageUrl: string;
};

export const DecoratorUtils = ({
    breadcrumbs,
    availableLanguages,
    utilsBackground,
    frontPageUrl,
}: DecoratorUtilsProps) => {
    return html`
        <decorator-utils
            class="${clsx(cls.decoratorUtils, {
                [cls.hidden]:
                    availableLanguages.length === 0 && breadcrumbs.length === 0,
                [cls.white]: utilsBackground === "white",
                [cls.gray]: utilsBackground === "gray",
            })}"
        >
            <div
                class="${clsx(
                    cls.decoratorUtilsContent,
                    utilsCls.contentContainer,
                )}"
            >
                <d-breadcrumbs
                    >${Breadcrumbs({
                        breadcrumbs,
                        label: i18n("breadcrumbs"),
                        frontPageUrl,
                    })}</d-breadcrumbs
                >
                ${LanguageSelector({ availableLanguages })}
            </div>
        </decorator-utils>
    `;
};
