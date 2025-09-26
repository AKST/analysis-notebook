import { E } from '../../../../base/render_app/type.js';

export type IframeWidget<Ctx, State, Config, Event> = {
  meta: { kind: 'iframe' },
  title: string,
  path: string,
  header?: E.Item | undefined;
  initialise?(): Generator<any>;
  normaliseSend?(message: ParentToChildMessage<Config, State>): Generator<any>;
  normaliseRecv?(message: any): Generator<NormalisedRecv<Event>>;
};

export type NormalisedRecv<E> =
  | ['dispatch', E]
  | ['reply', any];

export type ParentToChildMessage<Cfg, St> =
  | { kind: 'push', config: Cfg, state: St }
