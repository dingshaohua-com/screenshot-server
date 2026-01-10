import Router from '@koa/router';
import captureRouter from './capture.ts';
import rootRouter from './root.ts';

const routers = [rootRouter, captureRouter];
const wrappRouter = new Router({ prefix: '/api' });
routers.forEach((router) => {
	wrappRouter.use(router.routes(), router.allowedMethods());
});

export default wrappRouter;
