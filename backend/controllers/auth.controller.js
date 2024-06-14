import express from "express";

//Instead of writng all the functionallity of authentication in routes/auth , we will write it here
//SignUP
export const signup = (req,res)=>{
    res.json({
        data: "You hit the signup endpoint",
    })
}

//LogIN
export const login = (req,res)=>{
    res.json({
        data: "You hit the signup endpoint",
    })
}

//LogOut
export const logout = (req,res)=>{
    res.json({
        data: "You hit the signup endpoint",
    })
}