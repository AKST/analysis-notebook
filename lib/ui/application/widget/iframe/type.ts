import { E } from '../../../../base/render_app/type.js';

export type IframeWidget<Ctx, State, Config> = {
  meta: { kind: 'iframe' },
  title: string,
  path: string,
  header?: E.Item | undefined;
  normaliseMessage?(message: ParentToChildMessage<Config, State>): Generator<any>;
};

export type ParentToChildMessage<Cfg, St> =
  | { kind: 'push', config: Cfg, state: St }
