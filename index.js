const exp=require('express');
const session=require('express-session');
const cors=require('cors');
const dataService=require('./services/data.service')
const app=exp();

app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))

app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:false
}))
app.use(exp.json());

const logMiddleware=(req,res,next)=>{
    console.log(req.body);
    next();
}
//app.use(logMiddleware);

const authMiddleware=(req,res,next)=>{
    if(!req.session.currentUser){
        return res.json({
            statusCode:401,
          status:false,
        message:"Please Login"
      })}
      else
      next();
}

//GET-READ
app.get('/',(req,res)=>{
    res.status(401).send("THIS IS A GET METHOD");
});
//POST-CREATE
app.post('/',(req,res)=>{
    res.send("THIS IS A POST METHOD");
});

//POST-CREATE
app.post('/register',(req,res)=>{
    dataService.reg(req.body.acno,req.body.pswd,req.body.uname)
    .then(result=>{
     res.status(result.statusCode).json(result)
   // res.status(200).send("success");
    })
    
    //console.log(res.send(result.message));
});
app.post('/login',(req,res)=>{
    dataService.login(req,req.body.acno,req.body.pwd,req.body.uname)
    .then(result=>{
        res.status(result.statusCode).json(result)
      // res.status(200).send("success");
       })
    //console.log(res.send(result.message));
});
app.post('/deposit',authMiddleware, (req,res)=>{
    dataService.deposit(req,req.body.acno,req.body.pwd,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result)
      // res.status(200).send("success");
       })
});
app.post('/withdraw',authMiddleware, (req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.pwd,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result)
      // res.status(200).send("success");
       })
});
//PUT-UPDATE/MODIFY WHOLE
app.put('/',(req,res)=>{
    res.send("THIS IS A PUT METHOD");
});
//PATCH-UPDATE/MODIFY PARTIALLY
app.patch('/',(req,res)=>{
    res.send("THIS IS A PATCH METHOD");
});
//DELETE-DELETE
app.delete('/',(req,res)=>{
    res.send("THIS IS A DELETE METHOD");
});
app.listen(3000,()=>{
    console.log("Server started at port 3000");
})
