const db=require('./db');
let currentUser="";
let accountDetails={
    1000:{acno:1000,username:"userone",password:"userone",balance:50000},
    1001:{acno:1001,username:"usertwo",password:"usertwo",balance:5000},
    1002:{acno:1002,username:"userthree",password:"userthree",balance:10000},
    1003:{acno:1003,username:"userfour",password:"userfour",balance:6000}
        } 

const reg=(acno,pswd,uname)=>
        { 
          return db.User.findOne({acno})
        .then(user=>{
          console.log(user);
          if(user)
          {
          return{ 
            statusCode:422,
             status: false,
           message:"User already Exists....Please Login"}
          }
          else
          {
            const newUser=new db.User({
              acno,
              username:uname,
              password:pswd,
              balance:0
            })
            newUser.save();
            return{ 
              statusCode:200,
              status: true,
              message: ("Successfully registered")}
          
          }
        })
       
        }
const login=(req,accno,password,username)=>
        {
          var acno=parseInt(accno);
          return db.User.findOne({acno,password,username})
          .then(user=>{
            console.log(user);
            if(user)
                  {
                    req.session.currentUser=user;
                  return{ 
                      statusCode:200,
                      status:true,
                    message:"Login successful"}
                  }
                  else
                  {
                   return {statusCode:422,
                    status:false,
                  message:"Invalid credentials"}
                  }
          })
        }
const deposit=(acno,password,amount)=>
        {
          
          var amt=parseInt(amount);
          return db.User.findOne({acno,password})
          .then(user=>{
            if(!user){
              console.log(user);
              return {statusCode:422,
                status:false,
              message:"Invalid credentials"}
            }
            else{
              console.log(user);
            user.balance+=amt;
            user.save();
            return{ 
              statusCode:200,
              status:true,
              balance:user.balance,
            message:amt+" is credited and new balance is "+user.balance} 
          }
          })
        }
const withdraw=(acno,password,amount)=>
        {
          var amt=parseInt(amount);
          return db.User.findOne({acno,password})
          .then(user=>{
            if(!user){
              return {statusCode:422,
                status:false,
              message:"Invalid credentials"}
            }
            else{
            if(user.balance<amt){
              return {statusCode:422,
                status:false,
              message:"Insufficient balance"}
              }
            else{
              user.balance-=amt;
              user.save();
              return{ 
                statusCode:200,
                status:true,
                balance:user.balance,
              message:amt+" is debited and new balance is "+user.balance}
            }}
          })
        }

module.exports={
    reg,
    login,
    deposit,
    withdraw
}