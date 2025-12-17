import { E } from '../../../../base/dsl_dom/type.js';
import { Renderer, ProjectionConstraint } from '../../../canvas_2d/type.ts';

export type RenderContextInit = {
  renderer: Renderer;
  viewport: any;
}

export type RenderWidgetMeta = {
  kind: 'Canvas2d';
  proj: ProjectionConstraint;
  pure: boolean;
};

export type RenderWidget<Ctx, State, Config> = {
  meta: RenderWidgetMeta;
  createContext: (init: RenderContextInit) => Ctx;
  render: (context: Ctx, state: State, config: Config) => void;
  header?: E.Item | undefined;
}
