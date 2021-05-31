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
          let users=accountDetails;
                  if(acno in users)
                  {
                  if(uname==users[acno]["username"]&&pwd==users[acno]["password"])
                  {req.session.currentUser=users[acno]["username"];
                  return{ 
                      statusCode:200,
                      status:true,
                    message:"Login successful"}}
                  else
                  {
                   return {statusCode:422,
                    status:false,
                  message:"Incorrect username or password"}}
                  }
                  else
                  { 
                  return {statusCode:422,
                    status:false,
                  message:"Invalid Account No"}}
        }
const deposit=(acno,pwd,amount)=>
        {
          
          var amt=parseInt(amount);
          let user=accountDetails;
          if(acno in user)
                  {
                  if(pwd==user[acno]["password"])
                  {user[acno]["balance"]+=amt;
                    return{ 
                      statusCode:200,
                      status:true,
                      balance:user[acno]["balance"],
                    message:amount+" is credited and new balance is "+user[acno]["balance"]} }
                  else
                  {
                   return {statusCode:422,
                    status:false,
                  message:"Incorrect password"}}
                  }
                  else
                  { 
                  return {statusCode:422,
                    status:false,
                  message:"Invalid Account No"}
                  }
        }
const withdraw=(acno,pwd,amount)=>
        {
          var amt=parseInt(amount);
          let user=accountDetails;
          if(acno in user)
                  {
                  if(pwd==user[acno]["password"])
                    {
                      if(user[acno]["balance"]>amt)
                        {user[acno]["balance"]-=amt;
                          return{ 
                            statusCode:200,
                            status:true,
                            balance:user[acno]["balance"],
                          message:amount+" is debited and new balance is "+user[acno]["balance"]}
                        }
                      else
                      return {statusCode:422,
                        status:false,
                      message:"Insufficient balance"}
                    }
                  else
                  {
                   return {statusCode:422,
                    status:false,
                  message:"Incorrect password"}}
                  }
          else
                  {
                  return {statusCode:422,
                    status:false,
                  message:"Invalid Account No"}}
        }

module.exports={
    reg,
    login,
    deposit,
    withdraw
}