import { v } from "convex/values";
import { mutation, MutationCtx, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized")
    return await ctx.storage.generateUploadUrl()
})


export const createPost = mutation({
    args: {
        caption: v.optional(v.string()),
        storageId: v.id("_storage")
    },

    handler: async (ctx, args) => {

        const currentUser = await getAuthenticatedUser(ctx)

        const imageUrl = await ctx.storage.getUrl(args.storageId)

        if (!imageUrl) throw new Error("Image not found")


        const postId = await ctx.db.insert("posts", {
            userId: currentUser._id,
            imageUrl,
            storageId: args.storageId,
            caption: args.caption,
            likes: 0,
            comments: 0,
        })

        await ctx.db.patch(currentUser._id, {
            posts: currentUser.posts + 1
        })

        return postId
    }
})


export const getFeedPosts = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx)

        const posts = await ctx.db.query("posts").order("desc").collect()

        if (posts.length === 0) return []


        const postsWithInfo = await Promise.all(
            posts.map(async (post) => {
                const postAuthor = (await ctx.db.get(post.userId))!

                const like = await ctx.db.query("likes").withIndex("by_user_and_post", (q) =>
                    q.eq("userId", currentUser._id).eq("postId", post._id)
                ).first()

                const bookmark = await ctx.db.query("bookmarks").withIndex("by_user_and_post", (q) =>
                    q.eq("userId", currentUser._id).eq("postId", post._id)
                ).first()


                return {
                    ...post,
                    author: {
                        _id: postAuthor?._id,
                        username: postAuthor?.username,
                        image: postAuthor?.image,
                    },
                    isLiked: !!like,
                    isBookmarked: !!bookmark,

                }
            })
        )


        return postsWithInfo
    }
})

export const toggleLike = mutation({
    args: {
        postId: v.id("posts"),
    },

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)

        const existing = await ctx.db.query("likes").withIndex("by_user_and_post", (q) => q.eq("userId", currentUser._id).eq("postId", args.postId)).first()

        const post = await ctx.db.get(args.postId)
        if (!post) throw new Error("Post not found")

        if (existing) {
            await ctx.db.delete(existing._id);
            await ctx.db.patch(args.postId, { likes: post.likes - 1 });

            return false
        } else {
            await ctx.db.insert("likes", {
                userId: currentUser._id,
                postId: args.postId
            })
            await ctx.db.patch(args.postId, { likes: post.likes + 1 });


            if (currentUser._id !== post.userId) {
                await ctx.db.insert("notifications", {
                    receiverId: post.userId,
                    senderId: currentUser._id,
                    type: "like",
                    postId: args.postId
                })
            }

            return true
        }


    }
})



export const deletePost = mutation({
    args: {
        postId: v.id("posts"),
    },

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)



        const post = await ctx.db.get(args.postId)
        if (!post) throw new Error("Post not found")


        if (currentUser._id !== post.userId) throw new Error("Not authorized to delete post")

        const likes = await ctx.db.query("likes").withIndex("by_post", (q) => q.eq("postId", args.postId)).collect()

        for (let like of likes) {
            await ctx.db.delete(like._id)
        }

        const comments = await ctx.db.query("comments").withIndex("by_post", (q) => q.eq("postId", args.postId)).collect()

        for (let comment of comments) {
            await ctx.db.delete(comment._id)
        }

        const bookmarks = await ctx.db.query("bookmarks").withIndex("by_post", (q) => q.eq("postId", args.postId)).collect()

        for (let bookmark of bookmarks) {
            await ctx.db.delete(bookmark._id)
        }

        const notifications = await ctx.db.query("notifications").withIndex("by_post", (q) => q.eq("postId", args.postId)).collect()

        for (let notification of notifications) {
            await ctx.db.delete(notification._id)
        }


        await ctx.storage.delete(post.storageId)
        await ctx.db.delete(args.postId)

        await ctx.db.patch(currentUser._id, {
            posts: Math.max(0, (currentUser.posts || 1) - 1)
        })

    }
})



export const getPostsByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        const posts = await ctx.db
            .query("posts")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        return posts;
    },
});

