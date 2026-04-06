import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type CommentId = bigint;
export interface Comment {
    id: CommentId;
    content: string;
    author: string;
    timestamp: bigint;
    authorPrincipal: Principal;
}
export type PostId = bigint;
export interface PostView {
    id: PostId;
    content: string;
    author: string;
    likes: Array<Principal>;
    timestamp: bigint;
    image?: ExternalBlob;
    comments: Array<Comment>;
    authorPrincipal: Principal;
}
export interface Profile {
    bio: string;
    username: string;
    avatar?: ExternalBlob;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: PostId, content: string): Promise<CommentId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string, image: ExternalBlob | null): Promise<PostId>;
    createProfile(username: string, bio: string): Promise<void>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeed(): Promise<Array<PostView>>;
    getPost(postId: PostId): Promise<PostView | null>;
    getProfile(username: string): Promise<Profile | null>;
    getUserPosts(userPrincipal: Principal): Promise<Array<PostView>>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: PostId): Promise<void>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
    unlikePost(postId: PostId): Promise<void>;
    updateProfile(bio: string, avatar: ExternalBlob | null): Promise<void>;
}
