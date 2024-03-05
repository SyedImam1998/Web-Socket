const express= require('express');
const cors= require('cors');
const IO= require('./socket');



const app=express();
const post=[];

app.use(cors({origin:"http://localhost:5173"}));
app.use(express.json());

app.get('/getPosts',(req,res,next)=>{
    res.json(post)
});

app.post('/addPost',(req,res,next)=>{
    const {data}=req.body;
    console.log('data', data)
    post.push(data);
    IO.getIo().emit('data',{action:'create', data:data});
    res.status(201).json({
        message:"Created",
        data:data,

    })

    
})

const server = app.listen(4000);

const inSocket = require("./socket").init(server, {
    cors: {
        origin: "*"
    }
});

inSocket.on('connection', socket => {
    console.info("Client Connected")
});


