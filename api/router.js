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
    const results = await crawler.getParsedResults(ctx.query.q);
    ctx.body = results;
    ctx.status = 200;
  }
});
router.route({
  method: "get",
  path: "/healthcheck",
  handler: async ctx => {
    let test = await crawler.search("test");
    ctx.status = test.length === 8 ? 200 : 404;
  }
});

export default router;
