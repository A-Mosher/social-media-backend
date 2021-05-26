const mongoose = require('mongoose');
const Joi = require('Joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('..middleware/auth');
const express = require('express');
const router = express.Router();

//new profile post endpoint
router.post('/:userId/:profileId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(400).send(`The product with id "${req.params.productId}" does not exist.`);

        user.shoppingCart.push(product);

        await user.save();
        return res.send(user.shoppingCart);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


//new user post endpoint
router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');

        const salt = await bcrypt.genSalt(10);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });

        await user.save();

        const token = user.generateAuthToken();

        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send({ _id: user._id, name: user.name, email: user.email });
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, minlength: 5, maxlength:50 },
    firstName: { type: String, required: true, minlength: 2, maxlength: 255 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 255 },
    email: { type: String, unique: true, required: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, maxlength: 1024, minlength: 5 },
    //friends:
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get('jwtSecret'));
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(user);
}

module.exports = router;
exports.User = User;
exports.validate = validateUser;