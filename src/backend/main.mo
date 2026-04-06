import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type PostId = Nat;
  type CommentId = Nat;

  var nextPostId = 0;
  var nextCommentId = 0;

  public type Profile = {
    username : Text;
    bio : Text;
    avatar : ?Storage.ExternalBlob;
  };

  public type Post = {
    id : PostId;
    author : Text;
    authorPrincipal : Principal;
    content : Text;
    timestamp : Int;
    image : ?Storage.ExternalBlob;
    likes : Set.Set<Principal>;
    comments : [Comment];
  };

  public type Comment = {
    id : CommentId;
    author : Text;
    authorPrincipal : Principal;
    content : Text;
    timestamp : Int;
  };

  public type PostView = {
    id : PostId;
    author : Text;
    authorPrincipal : Principal;
    content : Text;
    timestamp : Int;
    image : ?Storage.ExternalBlob;
    likes : [Principal];
    comments : [Comment];
  };

  // Map Principal to Profile
  let profiles = Map.empty<Principal, Profile>();
  // Map username to Principal for uniqueness checking
  let usernameToPrincipal = Map.empty<Text, Principal>();
  let posts = Map.empty<PostId, Post>();

  module Comment {
    public func compare(x : Comment, y : Comment) : Order.Order {
      Nat.compare(x.id, y.id);
    };
  };

  module Post {
    type PostWithoutComments = {
      id : PostId;
      author : Text;
      authorPrincipal : Principal;
      content : Text;
      timestamp : Int;
      image : ?Storage.ExternalBlob;
      likes : Set.Set<Principal>;
    };

    public func fromPostWithoutComments(postWithoutComments : PostWithoutComments) : Post {
      { postWithoutComments with comments = [] };
    };
  };

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Check if username is already taken by another user
    switch (usernameToPrincipal.get(profile.username)) {
      case (?existingPrincipal) {
        if (existingPrincipal != caller) {
          Runtime.trap("Username already exists");
        };
      };
      case null {
        // New username, register it
        usernameToPrincipal.add(profile.username, caller);
      };
    };

    // Remove old username mapping if username changed
    switch (profiles.get(caller)) {
      case (?oldProfile) {
        if (oldProfile.username != profile.username) {
          usernameToPrincipal.remove(oldProfile.username);
          usernameToPrincipal.add(profile.username, caller);
        };
      };
      case null {};
    };

    profiles.add(caller, profile);
  };

  public shared ({ caller }) func createProfile(username : Text, bio : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let exists = usernameToPrincipal.containsKey(username);
    if (exists) { Runtime.trap("Username already exists") };

    let profile : Profile = {
      username;
      bio;
      avatar = null;
    };
    profiles.add(caller, profile);
    usernameToPrincipal.add(username, caller);
  };

  public shared ({ caller }) func createPost(content : Text, image : ?Storage.ExternalBlob) : async PostId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found. Create a profile first.") };
      case (?p) { p };
    };

    let post : Post = {
      id = nextPostId;
      author = profile.username;
      authorPrincipal = caller;
      content;
      timestamp = Time.now();
      image;
      likes = Set.empty<Principal>();
      comments = [];
    };

    posts.add(nextPostId, post);
    nextPostId += 1;
    post.id;
  };

  public shared ({ caller }) func likePost(postId : PostId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };

    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };

    post.likes.add(caller);
    posts.add(post.id, post);
  };

  public shared ({ caller }) func unlikePost(postId : PostId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can unlike posts");
    };

    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };

    post.likes.remove(caller);
    posts.add(post.id, post);
  };

  public shared ({ caller }) func addComment(postId : PostId, content : Text) : async CommentId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };

    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found. Create a profile first.") };
      case (?p) { p };
    };

    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };

    let comment : Comment = {
      id = nextCommentId;
      author = profile.username;
      authorPrincipal = caller;
      content;
      timestamp = Time.now();
    };

    let updatedComments = post.comments.concat([comment]);
    let sortedComments = updatedComments.sort();

    let updatedPost : Post = { post with comments = sortedComments };

    posts.add(post.id, updatedPost);
    nextCommentId += 1;
    comment.id;
  };

  public query ({ caller }) func getFeed() : async [PostView] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view the feed");
    };

    let allPosts = posts.values().toArray();
    let sortedPosts = allPosts.sort(func(a : Post, b : Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    });

    sortedPosts.map(func(post) { convertToPostView(post) });
  };

  public query ({ caller }) func getUserPosts(userPrincipal : Principal) : async [PostView] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };

    let allPosts = posts.values().toArray();
    let userPosts = allPosts.filter(func(post : Post) : Bool {
      post.authorPrincipal == userPrincipal
    });
    let sortedUserPosts = userPosts.sort(func(a : Post, b : Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp)
    });

    sortedUserPosts.map(func(post) { convertToPostView(post) });
  };

  public shared ({ caller }) func updateProfile(bio : Text, avatar : ?Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    let updatedProfile : Profile = {
      profile with
      bio;
      avatar;
    };
    profiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getPost(postId : PostId) : async ?PostView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    switch (posts.get(postId)) {
      case (null) { null };
      case (?post) { ?convertToPostView(post) };
    };
  };

  public query ({ caller }) func getProfile(username : Text) : async ?Profile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    switch (usernameToPrincipal.get(username)) {
      case (?principal) { profiles.get(principal) };
      case null { null };
    };
  };

  func convertToPostView(post : Post) : PostView {
    {
      post with
      likes = post.likes.toArray();
    };
  };
};
