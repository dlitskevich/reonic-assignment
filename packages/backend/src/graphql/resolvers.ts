import { PrismaClient } from "../../generated/prisma/client";

export interface Context {
  prisma: PrismaClient;
}

export const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",
    users: async (_parent: unknown, _args: unknown, context: Context) => {
      return await context.prisma.user.findMany({
        orderBy: { id: "desc" },
      });
    },
    user: async (_parent: unknown, args: { id: number }, context: Context) => {
      return await context.prisma.user.findUnique({
        where: { id: args.id },
      });
    },
  },
  Mutation: {
    createUser: async (
      _parent: unknown,
      args: { email: string; name?: string },
      context: Context
    ) => {
      return await context.prisma.user.create({
        data: {
          email: args.email,
          name: args.name,
        },
      });
    },
    updateUser: async (
      _parent: unknown,
      args: { id: number; email?: string; name?: string },
      context: Context
    ) => {
      return await context.prisma.user.update({
        where: { id: args.id },
        data: {
          ...(args.email && { email: args.email }),
          ...(args.name !== undefined && { name: args.name }),
        },
      });
    },
    deleteUser: async (
      _parent: unknown,
      args: { id: number },
      context: Context
    ) => {
      await context.prisma.user.delete({
        where: { id: args.id },
      });
      return true;
    },
  },
};
