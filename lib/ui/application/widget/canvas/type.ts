import { E } from '../../../../base/render_app/type.js';
import { ProjectionConstraint } from '../../../../2d/type.ts';
import { Renderer } from '../../../../2d/type.ts';

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
