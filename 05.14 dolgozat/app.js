import express from "express"
import * as db from"./data/db.js"

const PORT=3080
const app=express()

app.use(express.json())

app.get("/posts",(req,res)=> {
    const post=db.getAllposts();
    res.status(200).json(post)
})

app.get("/posts/:id",(req,res)=> {
    const title=req.body.title
    const content=req.body.title
    
    db.getpostById(+req.params.id);
    if(!title||!content){
        return  res.status(404).json({error: "Poszt nem található"});
    }
    res.status(200).json(post)
})
app.get("/posts",(req,res)=> {
     const ti=db.getpostById(+req.params.id);
     if(!post){
         return  res.status(400).json({error: "Poszt adat hiány"});
     }
     res.status(200).json(post)
})
app.delete("/posts/:id",(req,res)=> {
     const post=db.getpostById(+req.params.id);
     if(!post){
         return  res.status(404).json({error: "Poszt nem található"});
     }
     db.deletePost(+req.params.id)
     res.status(204).json(post)
})
app.listen(3080,()=> console.log("A szerver fut a localhost:3080-as porton"))