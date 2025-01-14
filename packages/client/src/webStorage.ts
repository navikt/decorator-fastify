import Cookies from "js-cookie";
import { createEvent } from "./events";
import {
    getAllowedStorage,
    awaitDecoratorData,
    getCurrentConsent,
} from "@navikt/nav-dekoratoren-moduler";
import { ConsentAction, Consent } from "decorator-shared/types";

export class WebStorageController {
    currentConsentVersion: number = 1;
    consentKey: string = "navno-consent";

    constructor() {
        this.initEventListeners();
        this.checkAndTriggerConsentBanner();

        console.log("WebStorageController initialized");
    }

    // Default consent object ensures that nothing is allowed until user has
    // given and explicit consent.
    private buildDefaultConsent = () => {
        return {
            consent: {
                analytics: false,
                surveys: false,
            },
            userActionTaken: false,
            meta: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: this.currentConsentVersion,
            },
        };
    };

    private buildConsentObject = (consent: ConsentAction) => {
        // User either consent or refuse all for now. Differentiate between analytics and surveys
        // in order to be scalable in the future.
        const analytics = consent === "CONSENT_ALL_WEB_STORAGE";
        const surveys = consent === "CONSENT_ALL_WEB_STORAGE";

        const currentConsent =
            getCurrentConsent() ?? this.buildDefaultConsent();

        return {
            ...currentConsent,
            consent: {
                ...currentConsent.consent,
                analytics,
                surveys,
            },
            userActionTaken: true,
            meta: {
                createdAt:
                    currentConsent.meta?.createdAt ?? new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: this.currentConsentVersion,
            },
        };
    };

    private handleConsentAllWebStorage = () => {
        const consentObject = JSON.stringify(
            this.buildConsentObject("CONSENT_ALL_WEB_STORAGE"),
        );

        Cookies.set(this.consentKey, consentObject, {
            expires: 90,
        });
    };

    private refuseOptionalWebStorage = () => {
        const consentObject = JSON.stringify(
            this.buildConsentObject("REFUSE_OPTIONAL_WEB_STORAGE"),
        );

        Cookies.set(this.consentKey, consentObject, {
            expires: 90,
        });

        this.clearKnownStorage();
    };

    // Initialize event listeners
    private initEventListeners() {
        window.addEventListener(
            "consentAllWebStorage",
            this.handleConsentAllWebStorage,
        );
        window.addEventListener(
            "refuseOptionalWebStorage",
            this.refuseOptionalWebStorage,
        );
    }

    private async clearKnownStorage() {
        await awaitDecoratorData();
        const allowedStorage = getAllowedStorage();

        const optionalStorage = allowedStorage.filter(
            (storage) => storage.optional,
        );

        const storedCookies = document.cookie.split(";").map((cookie) => {
            const [name, value] = cookie.trim().split("=");
            return { name, value };
        });

        optionalStorage.forEach((storage) => {
            const optionalStorageBase = storage.name.replace("*", "");
            const storedCookie = storedCookies.find((cookie) =>
                cookie.name.startsWith(optionalStorageBase),
            );

            if (storedCookie?.name.startsWith(optionalStorageBase)) {
                console.log(`Deleting ${storedCookie.name}`);
                Cookies.remove(storedCookie.name);
            }
        });
    }

    private checkAndTriggerConsentBanner() {
        const { userActionTaken, meta } = this.checkConsent();
        const { version } = meta;

        if (!userActionTaken || version < this.currentConsentVersion) {
            window.dispatchEvent(createEvent("showConsentBanner", {}));
            this.clearKnownStorage();
        }
    }

    public checkConsent(): Consent {
        const currentConsent = getCurrentConsent();
        return currentConsent ?? this.buildDefaultConsent();
    }

    // Cleanup when no longer needed
    destroy() {
        window.removeEventListener(
            "consentAllWebStorage",
            this.handleConsentAllWebStorage,
        );
        window.removeEventListener(
            "refuseOptionalWebStorage",
            this.refuseOptionalWebStorage,
        );
    }
}
