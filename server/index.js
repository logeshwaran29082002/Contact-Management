const express = require("express");
const cors = require("cors");
const fs = require("fs");
const users = require("./sample.json");

const app = express();
app.use(express.json());
app.use(cors());   // ✅ SIMPLE FIX

const port = 8000;

// Display all users
app.get("/users",(req,res)=>{
  return res.json(users);
});

// Delete user
app.delete("/users/:id",(req,res)=>{
  let id = Number(req.params.id);
  let filteredUsers = users.filter(user => user.id !== id);

  fs.writeFile("./sample.json", JSON.stringify(filteredUsers), ()=>{
    return res.json(filteredUsers);
  });
});

// Add user
app.post("/users",(req,res)=>{
  let {name, age, city} = req.body;

  if(!name || !age || !city){
    return res.status(400).json({message:"All Fields Required"});
  }

  let id = Date.now();
  users.push({id,name,age,city});

  fs.writeFile("./sample.json", JSON.stringify(users), ()=>{
    return res.json({message:"User Added Successfully"});
  });
});

// Update user
app.patch("/users/:id",(req,res)=>{
  let id = Number(req.params.id);
  let index = users.findIndex(u=>u.id===id);

  users.splice(index,1,{...req.body});

  fs.writeFile("./sample.json", JSON.stringify(users), ()=>{
    return res.json({message:"User Updated Successfully"});
  });
});

app.listen(port,()=>{
  console.log(`App is running on port ${port}`);
});
