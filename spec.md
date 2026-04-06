# ExpressMe

## Current State
New project. No existing pages or backend logic. Only scaffolded Motoko actor and empty frontend.

## Requested Changes (Diff)

### Add
- Full student social platform for ages 11–15
- 5 pages: Home, Forum, Upload, Profile, Login/Sign-Up
- Backend: user accounts, posts, likes, comments
- Sticky top navigation bar with smooth page transitions
- Responsive design for mobile and desktop

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- User registration and login (username + password)
- User profile: username, bio, avatar (stored via blob-storage)
- Posts: create post with text content, optional image, author, timestamp
- Likes: toggle like on a post, store like counts
- Comments: add comment to a post, list comments per post
- Queries: get all posts (feed), get posts by user, get user profile

### Frontend Pages

1. **Homepage**
   - Hero: logo, "Welcome to ExpressMe" heading, description, CTA button
   - Feature highlights section (3-column grid)
   - Recent posts preview section
   - Footer

2. **Forum Page**
   - Scrollable feed of post cards
   - Each card: avatar, username, timestamp, post text, optional image
   - Like button with count, comment button
   - Expandable comment section per post

3. **Upload Page**
   - Large text area: "Write your post..."
   - Optional image upload
   - Submit "Post" button
   - Requires login to post

4. **Profile Page**
   - Circular profile picture
   - Username and bio
   - User's own posts list
   - Settings/edit button

5. **Login / Sign-Up Page**
   - Toggle between login and sign-up modes
   - Username/email + password fields
   - Submit buttons

### Components
- `authorization`: user auth system
- `blob-storage`: profile pictures and post images
