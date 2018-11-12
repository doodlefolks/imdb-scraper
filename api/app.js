import Koa from "koa";
import router from "./router";

const app = new Koa();

app.use(router.middleware());

app.listen(process.env.PORT || 3000);
