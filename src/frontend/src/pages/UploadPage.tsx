import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@tanstack/react-router";
import { ImagePlus, Loader2, PenLine, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreatePost } from "../hooks/useQueries";

export default function UploadPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error("Please write something first!");
      return;
    }
    try {
      let externalBlob: ExternalBlob | null = null;
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        externalBlob = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
      }
      await createPost.mutateAsync({
        content: content.trim(),
        image: externalBlob,
      });
      toast.success("Post shared successfully! 🎉");
      navigate({ to: "/forum" });
    } catch {
      toast.error("Failed to post. Please try again.");
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
            data-ocid="upload.modal"
          >
            <PenLine className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Login to Share
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Join ExpressMe to share your thoughts and ideas with students
              around the world.
            </p>
            <Button
              asChild
              className="rounded-pill w-full"
              data-ocid="upload.login.primary_button"
            >
              <Link to="/login">Log In</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-pill w-full mt-3 border-primary/30 text-primary"
              data-ocid="upload.signup.secondary_button"
            >
              <Link to="/login" search={{ tab: "signup" }}>
                Create Account
              </Link>
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
      <main className="flex-1 flex items-start justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-card rounded-3xl shadow-card p-6 sm:p-8 w-full max-w-2xl"
          data-ocid="upload.panel"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Share Your Thoughts
              </h1>
              <p className="text-sm text-muted-foreground">
                Express yourself with the ExpressMe community
              </p>
            </div>
          </div>

          {/* Text area */}
          <Textarea
            placeholder="Write your post... What's on your mind today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-none rounded-2xl border-border bg-background text-sm mb-4 focus:ring-primary"
            data-ocid="upload.textarea"
          />

          {/* Image upload */}
          {imagePreview ? (
            <div className="relative mb-4 rounded-2xl overflow-hidden border border-border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                aria-label="Remove image"
                data-ocid="upload.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full mb-4 rounded-2xl border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center py-8 gap-3 ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
              data-ocid="upload.dropzone"
              aria-label="Upload image"
            >
              <ImagePlus className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                <span className="text-primary font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            data-ocid="upload.upload_button"
          />

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="rounded-pill border-border"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="upload.secondary_button"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Add Image
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {content.length} / 1000
              </span>
              <Button
                onClick={handlePost}
                disabled={
                  createPost.isPending ||
                  !content.trim() ||
                  content.length > 1000
                }
                className="rounded-pill px-7"
                data-ocid="upload.submit_button"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>

          {createPost.isError && (
            <p
              className="mt-3 text-sm text-destructive"
              data-ocid="upload.error_state"
            >
              Failed to post. Please try again.
            </p>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
