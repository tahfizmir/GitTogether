the apis we need for now.

authRouter
POST /signup                      //done
POST /login                       //done
POST /logout                      //done

profileRouter
GET /profile/view                 //done
PATCH /profile/edit               //done
PATCH /profile/changepassword     //done

connectionRequestRouter
POST /request/send/:status/:toUserId        //done
POST /request/review/:status/:toUserId      //done

userRouter
GET /user/connections
GET /user/requests/recieved
GET /user/feed                                gets profile of other users

Status: ignore,interested ,  accepted,rejected
