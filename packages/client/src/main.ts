/// <reference types="./client.d.ts" />
import { formatParams } from "decorator-shared/json";
import { type Context, type ParamKey } from "decorator-shared/params";
import Cookies from "js-cookie";
import "vite/modulepreload-polyfill";
import { initAnalytics } from "./analytics/analytics";
import { initAuth } from "./auth";
import { initLogoutWarning } from "./logout-warning";
import { createEvent, initHistoryEvents } from "./events";
import { addFaroMetaData } from "./faro";
import "./main.css";
import { env, param, updateDecoratorParams } from "./params";
import { useLoadIfActiveSession } from "./screensharing";
import { getHeadAssetsProps } from "decorator-shared/head";
import { buildHtmlElement } from "./helpers/html-element-builder";
import { cdnUrl } from "./helpers/urls";
import { initCustomElements } from "./custom-elements";

import.meta.glob("./styles/*.css", { eager: true });
import.meta.glob(["./views/**/*.ts", "!./views/**/*.test.ts"], { eager: true });

updateDecoratorParams({});

window.addEventListener("paramsupdated", (e) => {
    if (e.detail.params.language) {
        Promise.all(
            ["header", "footer"].map((key) =>
                fetch(
                    `${env("APP_URL")}/${key}?${formatParams(window.__DECORATOR_DATA__.params)}`,
                ).then((res) => res.text()),
            ),
        ).then(([header, footer]) => {
            const headerEl = document.getElementById("decorator-header");
            const footerEl = document.getElementById("decorator-footer");
            if (headerEl && footerEl) {
                headerEl.outerHTML = header;
                footerEl.outerHTML = footer;
                init();
            }
        });
    }
});

const msgSafetyCheck = (message: MessageEvent) => {
    const { origin, source } = message;
    // Only allow messages from own window
    return window.location.href.startsWith(origin) && source === window;
};

window.addEventListener("message", (e) => {
    if (!msgSafetyCheck(e)) {
        return;
    }
    if (e.data.source === "decoratorClient" && e.data.event === "ready") {
        window.postMessage({ source: "decorator", event: "ready" });
    }
    if (e.data.source === "decoratorClient" && e.data.event == "params") {
        const payload = e.data.payload;

        (
            [
                "breadcrumbs",
                "availableLanguages",
                "utilsBackground",
                "language",
                "chatbotVisible",
            ] satisfies ParamKey[]
        ).forEach((key) => {
            if (payload[key] !== undefined) {
                updateDecoratorParams({
                    [key]: payload[key],
                });
            }
        });

        if (e.data.payload.context) {
            const context = e.data.payload.context;
            if (
                ["privatperson", "arbeidsgiver", "samarbeidspartner"].includes(
                    context,
                )
            ) {
                window.dispatchEvent(
                    createEvent("activecontext", {
                        bubbles: true,
                        detail: { context },
                    }),
                );
            } else {
                console.warn("Unrecognized context", context);
            }
        }
    }
});

window.addEventListener("activecontext", (event) => {
    updateDecoratorParams({
        context: (event as CustomEvent<{ context: Context }>).detail.context,
    });
});

// @TODO: Refactor loaders
window.addEventListener("load", () => {
    useLoadIfActiveSession({
        userState: Cookies.get("psCurrentState"),
    });
    addFaroMetaData();
});

const injectHeadAssets = () => {
    getHeadAssetsProps(cdnUrl).forEach((props) => {
        const element = buildHtmlElement(props);
        document.head.appendChild(element);
    });
};

const init = () => {
    injectHeadAssets();
    initCustomElements();
    initHistoryEvents();

    if (param("maskHotjar")) {
        document.documentElement.setAttribute("data-hj-suppress", "");
    }

    initAuth().then((auth) => {
        initAnalytics(auth);
    });

    if (param("logoutWarning")) {
        initLogoutWarning();
    }
};

const enableMocking = async () => {
    if (process.env.NODE_ENV !== "development") {
        return;
    }

    if (window.location.origin !== env("APP_URL")) {
        console.log(
            "Skipping mock worker as current origin is not decorator origin",
        );
        return;
    }

    const { worker } = await import("./mocks");

    return worker.start({
        onUnhandledRequest: "bypass",
    });
};

enableMocking().then(() => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
});
