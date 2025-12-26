export type MenuItem =
  | [string, string, MenuItem[]]
  | [string, string];

export type AppFeatureFlags = {
  research: boolean,
  debug: boolean,
  papers: boolean,
  onlyEcon: boolean,
};

