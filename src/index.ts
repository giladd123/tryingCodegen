import "graphql-import-node";
import fastify from "fastify";
import {
  Request,
  renderGraphiQL,
  shouldRenderGraphiQL,
  processRequest,
  getGraphQLParameters,
} from "graphql-helix";
import { schema } from "./schema";
async function main() {
  const server = fastify();
  server.route({
    method: ["POST", "GET"],
    url: "/graphql",
    handler: async (req, reply) => {
      const request: Request = {
        headers: req.headers,
        method: req.method,
        query: req.query,
        body: req.body,
      };
      if (shouldRenderGraphiQL(request)) {
        reply.header("Content-Type", "text/html");
        reply.send(renderGraphiQL({ endpoint: "/graphql" }));
        return;
      }
      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        request,
        schema,
        operationName,
        query,
        variables,
      });

      if (result.type === "RESPONSE") {
        reply.send(result.payload);
      } else {
        reply.send({ error: "Stream not supported at the moment" });
      }
    },
  });
  server.listen(3000, "0.0.0.0", () => {
    console.log(`server is running on http://localhost:3000/`);
  });
}
main();
