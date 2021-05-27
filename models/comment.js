const mongoose = require('mongoose');
const Joi = require('Joi');


const commentSchema = new mongoose.Schema({
    userName: { type: String, required: true, minlength: 2, maxlength: 255 },
    postText: { type: String, required: true, minlength: 2, maxlength: 255 },
    dateModified: { type: Date, default: Date.now },
});


const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        userName: Joi.string().min(2).max(50).required(),
        postText: Joi.string().min(5).max(50).required(),

    });
    return schema.validate(comment);
}

exports.Comment = Comment;
exports.validate = validateComment;
exports.commentSchema = commentSchema;