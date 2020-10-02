export async function notFoundHandler(ctx) {
  ctx.notFound({
    message: `Nothing here: ${ctx.request.method} ${ctx.request.path}`
  });
}
