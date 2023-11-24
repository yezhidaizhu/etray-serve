import Koa from "koa";
import Router from "koa-router";

const app = new Koa();
const router = new Router();
router.prefix("/api");

let redoCount = 0; // 记录手动启动次数

export default function createServer() {
  router.get("/redoCount", async (ctx) => {
    ctx.body = { success: true, redoCount };
  });

  app.use((ctx) => {
    ctx.body = `打印服务启动成功`;
  });

  redoCount++;
}

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
