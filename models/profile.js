const mongoose = require('mongoose');
const Joi = require('Joi');

const profileSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 2, maxlength: 255 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 255 },
    email: { type: String, unique: true, required: true, minlength: 5, maxlength: 255 },
    userName: { type: String, required: true, minlength: 5, maxlength: 50 },
    password: { type: String, required: true, maxlength: 1024, minlength: 8 },
});


const Profile = mongoose.model('Profile', profileSchema);

function validateProfile(profile) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        userName: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(profile);
}

exports.Profile = Profile;
exports.validate = validateProfile;
exports.profileSchema = profileSchema;