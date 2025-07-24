import { E } from '../../../../base/render_app/type.js';

export type DocumentWidget<Ctx, State, Config> = {
  meta: { kind: 'document' },
  render: (context: Ctx, state: State, config: Config) => E.Item;
  // TODO move into engine
  createStyle?: any,
  // TODO move into engine
  createContext?: any,
}
