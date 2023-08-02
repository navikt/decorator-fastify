import "vite/modulepreload-polyfill";
import "./main.css";
import { Context, UtilsBackground } from "../params";
import { FeedbackSuccess } from "../views/feedback";
import { Breadcrumbs } from "../views/breadcrumbs";
import { getContentData } from "./utils";
import { HeaderMenuLinks } from "@/views/header-menu-links";

window.addEventListener("message", (e) => {
  if (e.data.source === "decoratorClient" && e.data.event === "ready") {
    window.postMessage({ source: "decorator", event: "ready" });
  }
  if (e.data.source === "decoratorClient" && e.data.event == "params") {
    if (e.data.payload.breadcrumbs) {
      const breadcrumbsWrapperEl = document.getElementById(
        "breadcrumbs-wrapper",
      );
      if (breadcrumbsWrapperEl) {
        breadcrumbsWrapperEl.outerHTML = Breadcrumbs({
          breadcrumbs: e.data.payload.breadcrumbs,
          utilsBackground: breadcrumbsWrapperEl.getAttribute(
            "data-background",
          ) as UtilsBackground,
        });
      }
    }
  }
});

window.addEventListener("message", (e) => {
  if (e.data.source === "decoratorClient") {
    console.log("message:", e.data);
  }
});

const menuButton = document.getElementById("menu-button");
const menuBackground = document.getElementById("menu-background");

function toggleActive(el: HTMLElement) {
  el.classList.toggle("active");
}

function purgeActive(el: HTMLElement) {
  el.classList.remove("active");
}

menuButton?.addEventListener("click", () => {
  const menu = document.getElementById("menu");

  [menuButton, menuBackground, menu].forEach((el) => el && toggleActive(el));
});

menuBackground?.addEventListener("click", () => {
  console.log("click");
  const menu = document.getElementById("menu");

  [menuButton, menuBackground, menu].forEach((el) => el && purgeActive(el));
});

const contextLinks = document.querySelectorAll(".context-link");

function removeClassFromElements(
  elements: NodeListOf<Element>,
  className: string,
) {
  for (const element of elements) {
    element.classList.remove(className);
  }
}

for (const contextLink of contextLinks) {
  contextLink.addEventListener("click", async (e) => {
    const targetContext = contextLink.getAttribute("data-context");

    const newParams = {
      context: targetContext as Context,
    };

    const newHeaderMenuLinks = await getContentData("headerMenuLinks", {
      context: targetContext as Context,
    });

    const html = HeaderMenuLinks({ headerMenuLinks: newHeaderMenuLinks });

    removeClassFromElements(contextLinks, "active");
    contextLink.classList.add("active");

    const headerMenuLinksEl = document.getElementById("header-menu-links");
    if (headerMenuLinksEl) {
      headerMenuLinksEl.innerHTML = html;
    }
  });
}

// @TODO:  Create a wrapper function around fetch that handles passing search params

const buttons = document.querySelectorAll(".feedback-content button");

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const feedbackContent = document.querySelector(".feedback-content");
    if (feedbackContent) {
      feedbackContent.innerHTML = FeedbackSuccess();
    }
  });
});

function attachAmplitudeLinks() {
  const amplitudeLinks = document.querySelectorAll(".amplitude-link");

  document.body.addEventListener("click", (e) => {
    console.log("click");
    if ((e.target as Element).classList.contains("amplitude-link")) {
      alert("Found an ampltidude link");
    }
    if (
      (e.target as Element).parentNode?.classList.contains("amplitude-link")
    ) {
      alert("Found an ampltidude link");
    }
  });
}

attachAmplitudeLinks();
