import { arg, extendType, nonNull, objectType, stringArg } from "nexus"

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("email", {
      description: "Email address of the user",
    })
    t.string("name", {
      description: "Full name of the user",
    })
  },
})

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createUser", {
      type: "User",
      args: {
        email: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        return ctx.db.user.create({
          data: {
            email: args.email,
            name: args.name,
          },
        })
      },
    })
  },
})

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      async resolve(_root, _args, ctx) {
        return ctx.db.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
          },
        })
      },
    })
  },
})
