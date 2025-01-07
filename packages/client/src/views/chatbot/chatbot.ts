import type { ClientParams, Context, Language } from "decorator-shared/params";
import Cookies from "js-cookie";
import loadExternalScript from "../../helpers/load-external-script";
import { cdnUrl } from "../../helpers/urls";
import { env, param } from "../../params";
import { defineCustomElement } from "../custom-elements";
import i18n from "../i18n";
import cls from "./chatbot.module.css";
import frida from "./frida.svg";

type CustomEventMap = {
    conversationIdChanged: CustomEvent<{ conversationId?: string }>;
    chatPanelClosed: CustomEvent<undefined>;
    setFilterValue: CustomEvent<{ filterValue: string[]; nextId?: number }>;
};

export type BoostConfig = ReturnType<typeof buildBoostConfig>;

export type BoostClient = {
    chatPanel: {
        show: () => void;
        addEventListener: <K extends keyof CustomEventMap>(
            type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void,
        ) => void;
        dispatchEvent: (event: CustomEventMap[keyof CustomEventMap]) => void;
        setFilterValues: (filterValues: string[]) => void;
        triggerAction: (actionId: number) => void;
    };
};

class Chatbot extends HTMLElement {
    private readonly button: HTMLButtonElement;
    private readonly cookieName = "nav-chatbot:conversation";
    private boost?: BoostClient;

    constructor() {
        super();

        this.button = document.createElement("button");
        this.button.addEventListener("click", () =>
            this.getBoost().then((boost) => boost?.chatPanel.show()),
        );
        this.button.id = "chatbot-frida-knapp";
        this.button.setAttribute(
            "aria-label",
            i18n("open_chat").render(window.__DECORATOR_DATA__.params),
        );
        this.button.classList.add(cls.button);

        const div = document.createElement("div");
        div.classList.add(cls.chatbotWrapper);
        const img = document.createElement("img");
        img.src = cdnUrl(frida);
        img.alt = "";
        img.classList.add(cls.frida);
        div.appendChild(img);

        this.button.appendChild(div);
    }

    connectedCallback() {
        window.addEventListener("paramsupdated", this.paramsUpdatedListener);
        this.update(window.__DECORATOR_DATA__.params);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.paramsUpdatedListener);
    }

    private paramsUpdatedListener = (event: CustomEvent) =>
        this.update(event.detail.params);

    private update = ({ chatbot, chatbotVisible }: Partial<ClientParams>) => {
        if (
            !window.__DECORATOR_DATA__.features["dekoratoren.chatbotscript"] ||
            chatbot === false
        ) {
            this.innerHTML = "";
        } else if (chatbot) {
            this.appendChild(this.button);
        }

        const isVisible = chatbotVisible || !!this.getCookie();
        this.button.classList.toggle(cls.visible, isVisible);

        if (isVisible) {
            loadScript();
        }
    };

    private getBoost = async (): Promise<BoostClient | undefined> => {
        if (this.boost) {
            return this.boost;
        }

        return loadScript().then(() => {
            if (!window.boostInit) {
                console.error("Boost init function not found!");
                return undefined;
            }

            this.boost = window.boostInit(
                env("BOOST_ENV"),
                buildBoostConfig({
                    conversationId: this.getCookie(),
                    context: param("context"),
                    language: param("language"),
                }),
            );

            this.boost?.chatPanel.addEventListener(
                "conversationIdChanged",
                (event) =>
                    event.detail.conversationId
                        ? this.setCookie(event.detail.conversationId)
                        : this.removeCookie(),
            );

            this.boost?.chatPanel.addEventListener(
                "setFilterValue",
                (event) => {
                    this.boost?.chatPanel.setFilterValues(
                        event.detail.filterValue,
                    );
                    if (event.detail.nextId) {
                        this.boost?.chatPanel.triggerAction(
                            event.detail.nextId,
                        );
                    }
                },
            );

            this.boost?.chatPanel.addEventListener("chatPanelClosed", () =>
                this.removeCookie(),
            );

            return this.boost;
        });
    };

    private getCookie = () => Cookies.get(this.cookieName);

    private setCookie = (value: string) =>
        Cookies.set(this.cookieName, value, {
            expires: 1,
            domain: location.hostname.includes("nav.no")
                ? ".nav.no"
                : undefined,
        });

    private removeCookie = () =>
        Cookies.remove(this.cookieName, {
            domain: location.hostname.includes("nav.no")
                ? ".nav.no"
                : undefined,
        });
}

const buildBoostConfig = ({
    conversationId,
    context,
    language,
}: {
    conversationId?: string;
    context: Context;
    language: Language;
}) => {
    return {
        chatPanel: {
            settings: {
                removeRememberedConversationOnChatPanelClose: true,
                conversationId,
                openTextLinksInNewTab: true,
            },
            styling: { buttons: { multiline: true } },
            header: {
                filters: {
                    filterValues:
                        context === "arbeidsgiver"
                            ? "arbeidsgiver"
                            : language === "nn"
                              ? "nynorsk"
                              : "bokmal",
                },
            },
        },
    };
};

const loadScript = () =>
    loadExternalScript(
        `https://${env("BOOST_ENV")}.boost.ai/chatPanel/chatPanel.js`,
    );

defineCustomElement("d-chatbot", Chatbot);
