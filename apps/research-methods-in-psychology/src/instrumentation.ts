const isProd = process.env.NODE_ENV === "production";
const mockEnabled = process.env.MOCK_ENABLED === "true";
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (isProd) {
      await import("../sentry.server.config");
    }
    if (mockEnabled) {
      const { server } = await import("../tests/mocks/node");
      server.listen({
        onUnhandledRequest: "bypass",
      });
    }
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    if (isProd) {
      await import("../sentry.edge.config");
    }
  }
}

export async function onRequestError() {}
