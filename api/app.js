import Koa from "koa";
import cors from "@koa/cors";
import router from "./router";

const app = new Koa();

app.use(cors());
// error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (ex) {
    // todo: log exception
    ctx.status = 500;
  }
});
app.use(router.middleware());

app.listen(process.env.PORT || 3000);
