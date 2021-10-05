import { PrismaClient } from "@prisma/client";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";
import { Resolvers } from "../build";
const prisma = new PrismaClient();
const resolvers: Resolvers = {
  Query: {
    allPeople: async (parent: unknown, args: {}) => {
      let persons = await prisma.person.findMany();
      return persons;
    },
    info: () => {
      return "this is a test";
    },
  },
  Mutation: {},
};

// const resolvers = {
//   Query: {
//     allPeople: async (parent: unknown, args: {}) => {
//       let persons = await prisma.person.findMany();
//       return persons;
//     },
//     info: () => {
//       return "this is a try for codegen";
//     },
//   },
//   Mutation: {
//     addPerson: async (
//       parent: unknown,
//       args: { name: string; age: number; city: string }
//     ) => {
//       const person = await prisma.person.create({ data: { ...args } });
//       return person;
//     },
//     removePerson: async (parent: unknown, args: { id: number }) => {
//       const person = await prisma.person.findUnique({
//         where: { id: +args.id },
//       });
//       if (!person) {
//         return new Error("no such person");
//       }
//       let index = person.id;
//       await prisma.person.delete({ where: { id: index } });
//       return person;
//     },
//   },
// };
export const schema = makeExecutableSchema({ typeDefs, resolvers });
