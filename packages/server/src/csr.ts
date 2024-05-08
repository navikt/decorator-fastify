import { AppState, Features } from "decorator-shared/types";
import ContentService from "./content-service";
import { clientEnv } from "./env/server";
import { Handler, HandlerFunction, responseBuilder } from "./lib/handler";
import { renderFooter, renderHeader } from "./render-index";
import { texts } from "./texts";
import { validParams } from "./validateParams";
import { cdnUrl, getManifest } from "./views";

type Providers = {
    contentService: ContentService;
    features: Features;
};

function csrHandlerFunc({
    contentService,
    features,
}: Providers): HandlerFunction {
    const fn: HandlerFunction = async ({ query }) => {
        const data = validParams(query);
        const localTexts = texts[data.language];

        const header$ = renderHeader({
            contentService,
            data,
            texts: localTexts,
        });

        const footer$ = renderFooter({
            contentService,
            data,
            texts: localTexts,
            features,
        });

        const manifest$ = getManifest();

        const [header, footer, manifest] = await Promise.all([
            header$,
            footer$,
            manifest$,
        ]);

        const scripts = [cdnUrl(manifest["src/main.ts"].file)];

        return responseBuilder()
            .json({
                header: header.render(),
                footer: footer.render(),
                data: {
                    texts: localTexts,
                    params: data,
                    features,
                    env: clientEnv,
                } satisfies AppState,
                scripts: scripts,
            })
            .build();
    };

    return fn;
}

export function csrHandler(providers: Providers) {
    const csrHandler: Handler = {
        method: "GET",
        path: "/env",
        handler: csrHandlerFunc(providers),
    };

    return csrHandler;
}
