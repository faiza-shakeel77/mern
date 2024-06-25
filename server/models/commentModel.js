const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post' // Assuming you have a Post model
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ["Kindergarten", "Primary School", "Junior School", "Secondary School", "High School"]
    },
    description: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the `updatedAt` field before each save
commentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
