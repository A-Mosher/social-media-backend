import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import GridFsStorage from 'multer-gridfs-storage'
import Grid from 'gridfs-stream'
import bodyParser from 'body-parser'
import Pusher from 'pusher'
import mongoPost from 'insertfilepath here'
import express from 'express'

//installs

const app = express()
const port = process.env.PORT || 9000

//install cors?
app.use(bodyParser.json());
app.use(cors())

//const mongoURI

const conn = mongoose.createConnection(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
    console.log("DB connected")
})

let gridFS

conn.once('open', () => {
    console.log('DB conncted')

    gridFS=Grid(conn.db, mongoose.mongo)
    gridFS.collection('images')
})  

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file)=>{
        return new Promise((resolve, reject) =>{{
            const filename= `image-${Date.now()}${path.extname(file.originalname)}`

            const fileInfo={
                filename: filename,
                bucketName: 'images'
            }

            resolve(fileInfo)
        }})
    }
})
//multer is a node js file to use to uplaod images

const upload = multer({ storage })

//api routes

//app.get('/', (req, res) => res.status(200).send('hello world'))

//postman
//localhost:9000/upload/image
//body.. form-data.. checkbox file.. selecet file from drop down.. click select file to choose an image
app.post('/upload/image', upload.single('file'),(req,res)=>{
    res.status(201).send(req.file)
})

//upload a post

app.post('/upload/post', (req, res) => {
    const dbpost = req.body

    mongoPosts.create(dbPost, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

//to retrieve the image that was just 3uploaded to mongo 

app.get('/retrieve/image/single', (req, res)=>{
    gridFS.files.findOne({filename: req.query.name }, (err, file)=>{
        if (err) {
            res.status(500).send(err)
        }else {
            if (!file || file.length === 0) {
                res.status(404).json({ err: 'file not found' })
            }else {
//this is where we pass in the file we want to find
//pipe where we pass in the file that we just created
                const readstream = gridFS.createReadStream(file.filename);
                readstream.pipe(res);
            }
        }
    })

})


app.get('/retrieve/post', (req, res) => {
    mongoPosts.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            res.status(200).send(data)
        }
    })
})
//the data is stored as a sting and then the data is to sort the information based om th timestamps
//this gets tested and used on the front end


//listen
app.listen(port, () => console.log(`listening on localhost:${port}`))

