const Post = require('../models/postModel')
const User = require('../models/userModel')
const   Comment = require('../models/commentModel')
const path = require('path')
const fs = require('fs')
const {v4: uuid} = require("uuid")
const HttpError = require("../models/errorModel")




//.....................Create A Post
// Post: api/posts
//Protected
const createPost = async (req, res, next) => {
    try {
    let { title, category, description } = req.body;
    if (!title || !category || !description || !req.files ) {
    return next(new HttpError("Fill in all fields and choose thumbnail.", 422))
    }
    
    
const { thumbnail } = req.files;

// Check the file size
if (thumbnail.size > 2000000) {
    return next(new HttpError("Thumbnail too big. File should be less than 2mb."))
}

// Generate new filename
let fileName = thumbnail.name;
let splittedFilename = fileName.split('.')
let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]

// Move the thumbnail file
thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
    if(err) {
        return next(new HttpError(err))
    } else {
        // Create new post
        const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFilename,
            creator: req.user.id
        })

        if (!newPost) {
            return next(new HttpError("Post couldn't be created.", 422))
        }

        // Find user and increase post count by 1
        const currentUser = await User.findById(req.user.id);


        const userPostCount = currentUser.posts + 1;
        await User.findByIdAndUpdate(req.user.id, {posts: userPostCount })

        res.status(201).json(newPost)
    }
})
} catch(error) {
  return next(new HttpError(error))
}
}

//..................... Get Post
// GET: api/posts
//Protected
const getPosts = async (req, res, next) => {
   try {
    const posts = await Post.find().sort({updatedAt: -1})
    res.status(200).json(posts)
   }catch(error) {
    return next(new HttpError(error))
   }
}

//.....................Get Single Post
// GET: api/posts/:id
//UNProtected
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) {
            return next(new HttpError("Post not found.",404))
        }
        res.status(200).json(post)
    }catch(error) {
        return next(new HttpError(error))
    }
}
//.....................Get Posts By CATEGORY
// GET: api/posts/categories/:category
//UNProtected
const getCatPosts = async (req, res, next) => {
   try{
    const{category} = req.params;
    const catPosts = await Post.find({category}).sort({createdAt: -1})
    res.status(200).json(catPosts)
   }catch (error) {
    return next(new HttpError(error))
   }
}
//.....................Get AUTHOR POST
// GET: api/posts/users/:id
//UNProtected
const getUserPosts = async (req, res, next) => {
    try{
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}
//.....................EDIT POST
// PATCH: api/posts/:id
//Protected


const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;
        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields", 422))
        }
        if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true })
        } else {

            const oldPost = await Post.findById(postId);



            fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }
                
            })
            const { thumbnail } = req.files;
            if (thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail is too big. Should be less than 2mb "))
            }
            fileName = thumbnail.name;
            let splittedFileName = fileName.split('.')
            newFilename = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length - 1]
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }
            })
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true })
        }


        if (!updatedPost) {
            return next(new HttpError("couldn't update post.", 400))
        }
        res.status(200).json(updatedPost)

            
        
            
    } catch (error) {
        return next(new HttpError(error))
    }
}




//.....................DELETE POST
// DELETE: api/posts/:id
//Protected



const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
       
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                } else {
                    await Post.findByIdAndDelete(postId);
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                }
            })
        

        res.json(`post ${postId} deleted successfully`)
    } catch (error) {
        return next(new HttpError(err))
    }
}



//.....................COMMENT POST
// POST: api/posts/:id
//Protected
const commentPost = async (req, res, next) => {
    const postId  = req.params.id;  // Correctly extract postId from req.params
    const { content } = req.body;

    // Log the request body and postId for debugging
    console.log("Request body:", req.params.id);
    console.log("Post ID:", postId);

    if (!content || content.trim().length === 0) {
        return next(new HttpError('Content must not be empty.', 422));
    }

    let post;
    try {
        post = await Post.findById(postId);
        if (!post) {
            console.log("Post not found with ID:", postId);
            return next(new HttpError('Post not found.', 404));
        }
    } catch (error) {
        console.error('Error fetching post:', error);
        return next(new HttpError('Fetching post failed, please try again later.', 500));
    }

    const comment = new Comment({
        content,
        creator: req.user.id,  // Ensure req.user is defined
        post: postId
    });

    try {
        await comment.save();
        post.comments.push(comment);
        await post.save();
    } catch (error) {
        console.error('Error saving comment:', error);
        return next(new HttpError('Adding comment failed, please try again.', 500));
    }

    res.status(201).json({ message: 'Comment added successfully', comment });
}



module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost,commentPost}