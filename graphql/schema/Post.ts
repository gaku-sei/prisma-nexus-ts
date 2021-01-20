import { extendType, nonNull, objectType, stringArg } from "nexus"

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("title", {
      description: "The title of the post",
    })
    t.string("content", {
      description: "The content of the post",
    })
    t.nonNull.boolean("published", {
      description: "When this value is false, the post is draft",
    })
    t.nonNull.field("author", {
      type: "User",
      description: "The author of the post",
    })
  },
})

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createPost", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        content: stringArg(),
        authorEmail: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        return ctx.db.post.create({
          data: {
            title: args.title,
            content: args.content,
            author: { connect: { email: args.authorEmail } },
          },
          select: {
            content: true,
            id: true,
            published: true,
            title: true,
            author: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        })
      },
    })
  },
})

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("drafts", {
      type: "Post",
      async resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({
          where: { published: false },
          select: {
            content: true,
            id: true,
            published: true,
            title: true,
            author: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        })
      },
    })
  },
})
