import express from "express";
import mustacheExpress from "mustache-express";
import { Context, Params, parseParams } from "./params";
import cors from "cors";
import { capitalizeFirstLetter } from "./utils";

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", `${__dirname}/views`);

app.use(cors());
app.use(express.static("public"));

function getContextKey(context: Context)  {
    return capitalizeFirstLetter(context)
}

// How should we handle if the params are invalid?
app.use((req, res, next) => {
 const result = parseParams(req.query);
  if (result.success) {
    req.decorator = result.data;
  }

  next();
})

const getTexts = async (params: Params): Promise<object> => {
  interface Node {
    children: Node[];
    displayName: string;
  }

  const get = (node: Node, path: string): Node | undefined => {
    if (path.includes(".")) {
      return path
        .split(".")
        .reduce<Node>((prev, curr) => get(prev, curr)!, node);
    }
    return node.children.find(({ displayName }) => displayName === path);
  };

  const texts: { [lang: string]: { [key: string]: string } } = {
    nb: {
      share_screen: "Del skjerm med veileder",
      to_top: "Til toppen",
      menu: "Meny",
      close: "Lukk",
    },
    en: {
      share_screen: "Share screen with your counsellor",
      to_top: "To the top",
      menu: "Menu",
      close: "Close",
    },
    se: {
      share_screen: "Del skjerm med veileder",
      to_top: "Til toppen",
      menu: "Meny",
      close: "Lukk",
    },
  };

  const menu = {
    children: await fetch("https://www.nav.no/dekoratoren/api/meny").then(
      (response) => response.json()
    ),
    displayName: "",
  };

  const contextKey = getContextKey(params.context);

  const key: { [key: string]: string } = {
    en: "en.Footer.Columns",
    se: "se.Footer.Columns",
    nb: `no.Footer.Columns.${contextKey}`,
    "": "no.Footer.Columns.Privatperson",
  };

  const footerLinks = get(menu, key[params.language])?.children;
  const mainMenu = get(menu, "no.Header.Main menu")?.children;
  const personvern = get(menu, "no.Footer.Personvern")?.children;
  const headerMenuLinks = get(
    menu,
    `no.Header.Main menu.${contextKey}`
  )?.children;
  return {
    footerLinks,
    mainMenu: mainMenu?.map((contextLink) => {
      return {
        styles:
          contextLink.displayName.toLowerCase() === params.context
            ? "font-bold border-[#3386e0]"
            : "border-transparent hover:border-gray-300 text-color-gray-700",
        context: contextLink.displayName.toLowerCase(),
        ...contextLink,
      };
    }),
    personvern,
    headerMenuLinks,
    ...texts[params.language],
  };
};

app.use("/footer", async (req, res) => {
  const params = parseParams(req.query);

  if (params.success) {
    res.render("footer", {
      simple: params.data.simple,
      innlogget: false,
      ...(await getTexts(params.data)),
    });
  } else {
    res.status(400).send(params.error);
  }
});

app.use("/", async (req, res) => {
  const params = parseParams(req.query);

  if (params.success) {
    res.render("index", {
      simple: params.data.simple,
      lang: { [params.data.language]: true },
      breadcrumbs: params.data.breadcrumbs.map((b, i, a) => ({
        ...b,
        last: a.length - 1 === i,
      })),
      ...(await getTexts(params.data)),
    });
  } else {
    res.status(400).send(params.error);
  }
});

app.listen(3000, function () {
  console.log("Server started");
});
