import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateProfile, useGetCallerProfile } from "../hooks/useQueries";

export default function LoginPage() {
  const navigate = useNavigate();

  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const { data: existingProfile, isLoading: profileLoading } =
    useGetCallerProfile();
  const createProfile = useCreateProfile();

  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // Redirect after login
  useEffect(() => {
    if (isAuthenticated && !profileLoading) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, profileLoading, navigate]);

  const handleLogin = () => {
    login();
  };

  const validateUsername = (val: string) => {
    if (!val.trim()) return "Username is required";
    if (val.length < 2) return "Username must be at least 2 characters";
    if (val.length > 30) return "Username must be at most 30 characters";
    if (!/^[a-zA-Z0-9_. ]+$/.test(val))
      return "Username can only contain letters, numbers, spaces, underscores, and dots";
    return "";
  };

  const handleSignUp = async () => {
    const error = validateUsername(username);
    if (error) {
      setUsernameError(error);
      return;
    }
    setUsernameError("");

    try {
      if (!isAuthenticated) {
        login();
        return; // user must complete login first
      }
      await createProfile.mutateAsync({
        username: username.trim(),
        bio: bio.trim(),
      });
      toast.success("Account created! Welcome to ExpressMe 🎉");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to create account. Please try again.");
    }
  };

  if (isAuthenticated && existingProfile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Back to home */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="login.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
          data-ocid="login.panel"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome to ExpressMe
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Your safe space to connect and express
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className="w-full rounded-pill mb-6 bg-muted"
                data-ocid="login.tab"
              >
                <TabsTrigger
                  value="login"
                  className="flex-1 rounded-pill"
                  data-ocid="login.login.tab"
                >
                  Log In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="flex-1 rounded-pill"
                  data-ocid="login.signup.tab"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Log In Tab */}
              <TabsContent value="login">
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <p className="text-muted-foreground text-sm">
                      Welcome back! Use Internet Identity to log in securely.
                    </p>
                  </div>
                  <Button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="w-full rounded-pill h-11 font-semibold"
                    data-ocid="login.submit_button"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login with Internet Identity"
                    )}
                  </Button>
                  {isLoggingIn && (
                    <p
                      className="text-xs text-muted-foreground text-center"
                      data-ocid="login.loading_state"
                    >
                      A login window will open. Please complete the process
                      there.
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-foreground"
                    >
                      Username <span className="text-like-red">*</span>
                    </Label>
                    <Input
                      id="username"
                      placeholder="e.g. Maya_K or ZoeP123"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (usernameError)
                          setUsernameError(validateUsername(e.target.value));
                      }}
                      className="mt-1.5 rounded-xl h-11"
                      data-ocid="login.input"
                      autoComplete="username"
                      maxLength={30}
                    />
                    {usernameError && (
                      <p
                        className="text-xs text-destructive mt-1.5"
                        data-ocid="login.error_state"
                      >
                        {usernameError}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-foreground"
                    >
                      Bio{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="bio"
                      placeholder="Tell us a little about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="mt-1.5 rounded-xl h-11"
                      autoComplete="off"
                      maxLength={160}
                    />
                  </div>

                  <Button
                    onClick={handleSignUp}
                    disabled={createProfile.isPending || isLoggingIn}
                    className="w-full rounded-pill h-11 font-semibold"
                    data-ocid="login.primary_button"
                  >
                    {createProfile.isPending || isLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account & Join"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By joining, you agree to keep things kind, safe, and
                    respectful.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            ExpressMe is a safe space for students aged 11–15.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
