import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Principal } from "@icp-sdk/core/principal";
import { Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PostView } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddComment, useLikePost, useUnlikePost } from "../hooks/useQueries";
import { timeAgo } from "../lib/timeago";
import InitialsAvatar from "./InitialsAvatar";

const PASTEL_COLORS = [
  "bg-pastel-peach",
  "bg-pastel-mint",
  "bg-pastel-lavender",
  "bg-pastel-butter",
  "bg-pastel-pink",
];

interface PostCardProps {
  post: PostView;
  index?: number;
  compact?: boolean;
  currentPrincipal?: Principal | null;
}

export default function PostCard({
  post,
  index = 0,
  compact = false,
  currentPrincipal,
}: PostCardProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [expanded, setExpanded] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [contentExpanded, setContentExpanded] = useState(false);
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const addCommentMutation = useAddComment();

  const pastelClass = PASTEL_COLORS[index % PASTEL_COLORS.length];
  const isLiked = currentPrincipal
    ? post.likes.some((p) => p.toString() === currentPrincipal.toString())
    : false;

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like posts");
      return;
    }
    try {
      if (isLiked) {
        await unlikeMutation.mutateAsync(post.id);
      } else {
        await likeMutation.mutateAsync(post.id);
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to comment");
      return;
    }
    if (!commentText.trim()) return;
    try {
      await addCommentMutation.mutateAsync({
        postId: post.id,
        content: commentText.trim(),
      });
      setCommentText("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const isLong = post.content.length > 180;
  const displayContent =
    contentExpanded || !isLong
      ? post.content
      : `${post.content.slice(0, 180)}...`;

  return (
    <article
      className={cn(
        "rounded-2xl shadow-card transition-shadow hover:shadow-card-hover",
        pastelClass,
      )}
      data-ocid={`forum.item.${index + 1}`}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <InitialsAvatar name={post.author} size="md" />
            <div>
              <p className="font-semibold text-sm text-foreground">
                {post.author}
              </p>
              <p className="text-xs text-muted-foreground">
                {timeAgo(post.timestamp)}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="More options"
            className="p-1.5 rounded-lg hover:bg-black/5 text-muted-foreground transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground leading-relaxed mb-3">
          {displayContent}
          {isLong && !contentExpanded && (
            <button
              type="button"
              onClick={() => setContentExpanded(true)}
              className="ml-1 text-primary font-medium hover:underline text-sm"
            >
              See more
            </button>
          )}
        </p>

        {/* Image */}
        {post.image && (
          <div className="mb-3 rounded-xl overflow-hidden">
            <img
              src={post.image.getDirectURL()}
              alt="Post attachment"
              className="w-full max-h-60 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Actions */}
        {!compact && (
          <div className="flex items-center gap-4 pt-2 border-t border-black/5">
            <button
              type="button"
              onClick={handleLike}
              disabled={likeMutation.isPending || unlikeMutation.isPending}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                isLiked
                  ? "text-like-red"
                  : "text-muted-foreground hover:text-like-red",
              )}
              aria-label={isLiked ? "Unlike post" : "Like post"}
              data-ocid={`forum.item.${index + 1}.toggle`}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-like-red")} />
              <span>{post.likes.length}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please log in to comment");
                  return;
                }
                setCommentOpen((v) => !v);
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle comments"
              data-ocid={`forum.item.${index + 1}.button`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length}</span>
            </button>
          </div>
        )}
      </div>

      {/* Comments Section */}
      {!compact && commentOpen && (
        <div className="px-4 sm:px-5 pb-4 border-t border-black/5">
          {post.comments.length > 0 && (
            <div className="pt-3 space-y-3 mb-3">
              {post.comments
                .slice(0, expanded ? undefined : 2)
                .map((comment) => (
                  <div key={comment.id.toString()} className="flex gap-2">
                    <InitialsAvatar name={comment.author} size="sm" />
                    <div className="bg-white/60 rounded-xl px-3 py-2 flex-1">
                      <p className="text-xs font-semibold text-foreground">
                        {comment.author}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              {post.comments.length > 2 && !expanded && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  See all {post.comments.length} comments
                </button>
              )}
            </div>
          )}

          {/* Comment Input */}
          {isAuthenticated && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
                className="flex-1 text-sm rounded-pill bg-white/70 border-border h-9"
                data-ocid={`forum.item.${index + 1}.input`}
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={addCommentMutation.isPending || !commentText.trim()}
                className="rounded-pill h-9 px-3"
                data-ocid={`forum.item.${index + 1}.submit_button`}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card shadow-card p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
    </div>
  );
}
