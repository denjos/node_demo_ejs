const LocalStrategy=require('passport-local').Strategy
const mongoose=require('mongoose')

const bcrypt=require('bcryptjs')

const User=require('../models/user')


module.exports=function(passport){
    passport.use(
        new LocalStrategy({
            usernameField:'email'
        },(email,password,done)=>{
            User.findOne({email})
                .then(user=>{
                    if (!user) {
                        return done(null,false,{message:'that email is not registered'})
                    }
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if (err) throw err
                        if (isMatch) {
                            return done(null,user)
                        }else{
                            return done(null,false,{message:'Password incorrect'})
                        }
                            
                    })
                })
                .catch(error=>console.log(error))
        })
    )
    passport.serializeUser(function(user,done) {
        done(null,user.id)
    })
    passport.deserializeUser(function(id,done) {
        User.findById(id,function(err,user) {
            done(err,user)
        })
    })
}
