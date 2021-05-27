import mongoose from 'mongoose'

const postModel = mongoose.Schema({
    user: String,
    imgName: String,
    text: String,
    avatar: String,
    timestamp: String
})

export default mongoose.model('posts', postModel)

//avatar comes after login timestamp is to sort by newest upload date