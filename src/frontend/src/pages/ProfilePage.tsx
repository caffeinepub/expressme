import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Edit2, ImagePlus, Loader2, Settings, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InitialsAvatar from "../components/InitialsAvatar";
import PostCard from "../components/PostCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerProfile,
  useGetUserPosts,
  useUpdateProfile,
} from "../hooks/useQueries";

const PROFILE_SKELETON_KEYS = ["ps-a", "ps-b", "ps-c"];

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal() ?? null;
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetCallerProfile();
  const { data: userPosts, isLoading: postsLoading } =
    useGetUserPosts(principal);
  const updateProfile = useUpdateProfile();

  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setBio(profile?.bio ?? "");
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditMode(true);
  };

  const handleAvatarSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      let avatar: ExternalBlob | null = null;
      if (avatarFile) {
        const arrayBuffer = await avatarFile.arrayBuffer();
        avatar = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
      }
      await updateProfile.mutateAsync({ bio, avatar });
      toast.success("Profile updated!");
      setEditMode(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl shadow-card p-10 text-center max-w-sm w-full"
            data-ocid="profile.modal"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Sign In to View Profile
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Create an account or log in to access your personal profile and
              posts.
            </p>
            <Button
              asChild
              className="rounded-pill w-full"
              data-ocid="profile.login.primary_button"
            >
              <Link to="/login">Log In</Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl shadow-card p-6 sm:p-8 mb-8"
            data-ocid="profile.card"
          >
            {profileLoading ? (
              <div className="flex items-center gap-6">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-4 w-48 rounded" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  {editMode ? (
                    <>
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <InitialsAvatar
                          name={profile?.username ?? "?"}
                          size="lg"
                          avatarUrl={profile?.avatar?.getDirectURL()}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-card hover:opacity-90 transition-opacity"
                        aria-label="Change avatar"
                        data-ocid="profile.upload_button"
                      >
                        <ImagePlus className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <InitialsAvatar
                      name={profile?.username ?? "?"}
                      size="lg"
                      avatarUrl={profile?.avatar?.getDirectURL()}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  {editMode ? (
                    <>
                      <p className="font-bold text-lg text-foreground mb-2">
                        {profile?.username}
                      </p>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell others about yourself..."
                        rows={3}
                        className="resize-none text-sm rounded-xl border-border mb-3"
                        data-ocid="profile.textarea"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={updateProfile.isPending}
                          className="rounded-pill"
                          data-ocid="profile.save_button"
                        >
                          {updateProfile.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditMode(false)}
                          className="rounded-pill"
                          data-ocid="profile.cancel_button"
                        >
                          <X className="w-3.5 h-3.5 mr-1.5" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="font-bold text-xl text-foreground">
                        {profile?.username ?? "Unknown User"}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        {profile?.bio ||
                          "No bio yet — add one to let others know who you are!"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={startEdit}
                          className="rounded-pill border-primary/30 text-primary hover:bg-primary/5"
                          data-ocid="profile.edit_button"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                          Edit Profile
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarSelect(file);
            }}
          />

          {/* My Posts */}
          <div data-ocid="profile.list">
            <h2 className="text-xl font-bold text-foreground mb-5">My Posts</h2>

            {postsLoading ? (
              <div className="space-y-4">
                {PROFILE_SKELETON_KEYS.map((k) => (
                  <div
                    key={k}
                    className="bg-card rounded-2xl shadow-card p-5 space-y-3"
                  >
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                ))}
              </div>
            ) : userPosts && userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post, i) => (
                  <PostCard
                    key={post.id.toString()}
                    post={post}
                    index={i}
                    currentPrincipal={principal}
                  />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-14 text-muted-foreground"
                data-ocid="profile.empty_state"
              >
                <p className="font-medium">No posts yet</p>
                <p className="text-sm mt-1 mb-4">
                  Share your first thought with the community!
                </p>
                <Button
                  className="rounded-pill"
                  onClick={() => navigate({ to: "/upload" })}
                  data-ocid="profile.primary_button"
                >
                  Write a Post
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
