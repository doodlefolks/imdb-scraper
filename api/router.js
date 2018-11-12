import Router from "koa-joi-router";
import crawler from "./crawlers/imdbCrawler";

const Joi = Router.Joi;
const router = Router();
router.route({
  method: "get",
  path: "/imdb",
  validate: {
    query: Joi.object().keys({
      q: Joi.string().required()
    })
  },
  handler: async ctx => {
    ctx.body = await crawler.search(ctx.query.q);
    ctx.status = 404;
  }
});

export default router;