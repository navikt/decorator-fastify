import { RequestHandler } from 'express';

import { buildDataStructure } from '@/utils';
import { DecoratorEnv } from '@/views/decorator-env';
import { DecoratorLens } from '@/decorator-lens';
import { Footer } from '@/views/footer';
import { Header } from '@/views/header';
import { HeaderMenuLinks } from '@/views/header-menu-links';
import { Index } from '@/views/index';
import { env } from '../env/server';

const entryPointPath = 'client/main.ts';
const isProd = process.env.NODE_ENV === 'production';

const host = env.HOST ?? `http://localhost:${env.PORT}`;

const script = (src: string) => `<script type="module" src="${src}"></script>`;

const getResources = async () => {
  const resources = (
    (await import('../../dist/manifest.json', { assert: { type: 'json' } }))
      .default as {
      [entryPointPath]: { file: string; css: string[] };
    }
  )[entryPointPath];

  console.log(resources);

  if (isProd) {
    return {
      scripts: script(`${host}/${resources.file}`),
      styles: [
        ...resources.css.map(
          (href: string) =>
            `<link type="text/css" rel="stylesheet" href="${host}/${href}"></link>`,
        ),
      ].join(''),
    };
  }

  return {
    styles: '',
    scripts: [
      'http://localhost:5173/@vite/client',
      `http://localhost:5173/${entryPointPath}`,
    ]
      .map(script)
      .join(''),
  };
};

const resources = await getResources();

export const headerHandler: RequestHandler = async (req, res) => {
  const params = req.decoratorParams;
  const data = await buildDataStructure(params);
  return res.status(200).send(
    HeaderMenuLinks({
      headerMenuLinks: data.headerMenuLinks,
    }),
  );
};

export const footerHandler: RequestHandler = async (req, res) => {
  const params = req.decoratorParams;
  // Maybe make into middleware
  const data = await buildDataStructure(params);

  return res.status(200).send(
    Footer({
      simple: req.decoratorParams.simple,
      personvern: data.personvern,
      footerLinks: data.footerLinks,
      feedback: req.decoratorParams.feedback,
      texts: data.texts,
    }),
  );
};

export const indexHandler: RequestHandler = async (req, res) => {
  const data = await buildDataStructure(req.decoratorParams);
  const fullUrl = req.protocol + '://' + req.get('host');

  res.status(200).send(
    Index({
      scripts: resources.scripts,
      links: resources.styles,
      language: req.decoratorParams.language,
      header: Header({
        texts: data.texts,
        mainMenu: data.mainMenu,
        headerMenuLinks: data.headerMenuLinks,
        innlogget: false,
        isNorwegian: true,
        breadcrumbs: req.decoratorParams.breadcrumbs,
        utilsBackground: req.decoratorParams.utilsBackground,
        availableLanguages: req.decoratorParams.availableLanguages,
        myPageMenu: data.myPageMenu,
        simple: req.decoratorParams.simple,
      }),
      footer: Footer({
        texts: data.texts,
        personvern: data.personvern,
        footerLinks: data.footerLinks,
        simple: req.decoratorParams.simple,
        feedback: req.decoratorParams.feedback,
      }),
      env: DecoratorEnv({
        origin: fullUrl,
        env: req.decoratorParams,
      }),
      lens: DecoratorLens({
        origin: fullUrl,
        env: req.decoratorParams,
        query: req.query,
      }),
    }),
  );
};
