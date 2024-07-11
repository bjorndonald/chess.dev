import { THEME_COLOR_DARK, THEME_COLOR_LIGHT } from "@/constants";
import { colorMetaTags } from "@/utils/metadata";

export const Meta = () => {
  return (
    <>
      <meta httpEquiv={"x-ua-compatible"} content={"ie=edge"} />
      <link rel="shortcut icon" href="/brand/favicon-32x32.png" />
      <link rel="apple-touch-icon" href="/brand/apple-icon-57x57.png" />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="/brand/apple-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/brand/apple-icon-114x114.png"
      />

      <link
        rel={"apple-touch-icon-precomposed"}
        href={"/brand/favicon-32x32.png"}
      />
      <link rel={"icon"} sizes={"32x32"} href={"/brand/favicon-32x32.png"} />
      <meta
        name={"msapplication-TileImage"}
        content={"/brand/favicon-32x32.png"}
      />

      {/* <link
                rel={'alternate'}
                href={'/feed.xml'}
                type={'application/rss+xml'}
                title={'Bjorn-Donald Basser (RSS)'}
            /> */}

      {colorMetaTags.map(tag => (
        <meta key={tag} name={tag} content={"transparent"} />
      ))}

      <meta
        name={"theme-color"}
        media={"(prefers-color-scheme: light)"}
        content={THEME_COLOR_LIGHT}
      />
      <meta
        name={"theme-color"}
        media={"(prefers-color-scheme: dark)"}
        content={THEME_COLOR_DARK}
      />
      <meta name={"view-transition"} content={"same-origin"} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="twitter:image:width" content="1200" />
      <meta property="twitter:image:height" content="630" />
    </>
  );
};
