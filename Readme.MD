# Blogify API

## Overview (from Moodle)

Core Features:
1. User Management:
Account Creation: Users should be able to register by providing an email, username, and password.

Route: POST /users/register
Validations: Ensure unique email and username.
Login: Users can log in with their email and password.

Route: POST /users/login
Optional: JWT authentication token generation for session management.
CRUD Operations for Users:

GET /users/:id: Retrieve a specific user's profile.
PUT /users/:id: Update user profile.
DELETE /users/:id: Delete a user account (soft delete with status). <br> <br>
2. Blog Post Management:
Creating Posts: Users can create blog posts on various topics.

Fields: Title, Content, Author (user reference), Tags, Timestamps (created_at, updated_at).
Route: POST /posts

Reading Posts: Allow retrieval of all posts, or specific ones by ID.

Route: GET /posts (with optional filters like tag, author, date).
GET /posts/:id: Retrieve a specific blog post.
Editing and Deleting Posts:

PUT /posts/:id: Update an existing blog post.
DELETE /posts/:id: Soft delete or permanently remove a blog post.  <br> <br>
3. Commenting System:
Adding Comments: Users can comment on any blog post.

Fields: Comment Text, Author, Post ID, Timestamp.
Route: POST /posts/:id/comments
 <br> <br>
Managing Comments:

PUT /comments/:id: Edit a comment.
DELETE /comments/:id: Delete a comment.
<br> <br> 

Purpose of swagger.js ? it generates a yaml openAPI file by doing "node swagger.js"

Views structure : Why did i create a "partials" package inside the view package ? Well, having some experience with React gave me structure automatisms. i like to cut my views parts into components so it can be easier to make it evolve


## Start
<br>
1. cd ./blogify, npm install, nodemon server.js