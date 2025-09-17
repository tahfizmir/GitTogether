the apis we need for now.

authRouter
POST /signup                //done
POST /login                 //done
POST /logout                //done

profileRouter
GET /profile/view           //done
PATCH /profile/edit         //done
PATCH /profile/password     //done

connectionRequestRouter
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

userRouter
GET /user/connections
GET /user/requests/recieved
GET /user/feed                                gets profile of other users

Status: ignore,interested ,  accepted,rejected
