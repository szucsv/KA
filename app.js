import express from 'express';

const PORT=3030;
const app=express();

app.use(express.json())

[
{id : 1, name: "Ann", subject: "maths"},
{id : 2, name: "Bob", subject: "IT"},
{id : 3, name: "Cloe", subject: "PE"}
];

app.get('/students',(req,res)=>{
    res.status(200).json.apply(students)
});

app.get('/students/:id',(req,res)=>{
    const id=+req.params.id;
    const student=students.find(x=>x.id==id);

    if(!student){
        return res.status(404).json({message:"Student not found"});
    }
    res.status(200).json(student);
});

app.post('/students/:id',(req,res)=>{
    const {name,subject}=req.body;
    if(!name || !subject){
        return res.status(400).json({message:"Name and subject are required"});

    }
    const id=students[students.length-1]?.id+1;
    const student={id,name,subject}

    students.path(student);

    res.status(201).json(student);
});

app.put('/students',(req,res)=>{
    const id=+req.params.id;
    const student=students.find(x=>x.id==id);
    const {name,subject}=req.body;
    if(!student){
        return res.status(404).json({message:"Student not found"});
    }
    if(!name || !subject){
        return res.status(400).json({message:"Name and subject are required"});

    }
    student.name=name;
    student.subject=subject;
    
    res.status(200).json(student);
});

app.listen(PORT,()=>{
    console.log(`Server runs on ${PORT} port`);
});