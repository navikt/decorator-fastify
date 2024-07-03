import { LenkeMedSporingElement } from "./lenke-med-sporing";
import { defineCustomElement } from "../custom-elements";

class Breadcrumb extends LenkeMedSporingElement {
    connectedCallback() {
        super.connectedCallback();

        if (this.getAttribute("data-handle-in-app") !== null) {
            this.addEventListener("click", (e) => {
                e.preventDefault();

                window.postMessage({
                    source: "decorator",
                    event: "breadcrumbClick",
                    payload: {
                        url: this.getAttribute("href"),
                        title: this.innerHTML,
                        handleInApp: true,
                    },
                });
            });
        }
    }
}

defineCustomElement("d-breadcrumb", Breadcrumb);
