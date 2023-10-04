const { generateToken } = require('../config/jwtToken')
const User = require('../models/userModel')
const asyncHandler = require("express-async-handler")
const createUser = asyncHandler(async (req,res) => {
    const email = req.body.email
    const findUser = await User.findOne({email:email})
    if(!findUser){
        const newUser = await  User.create(req.body)
        res.json(newUser)
    } else {
        throw new Error("User Already Exists")
    }
})

const loginUserCtrl = asyncHandler(async (req,res) => {
    const { email, password } = req.body
    const findUser = await User.findOne({email})
    if(findUser && (await findUser.isPasswordMatched(password))){
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        })
    }else{
        throw new Error("Invalid Credential")
    }
})


//Get all Users
const getAllUsers = asyncHandler(async (req,res) => {
    try{
        const getUsers = await User.find()
        res.json(getUsers)
    }catch(error){
        throw new Error(error)
    }
})

//Get a single user
const getaUser = asyncHandler(async (req,res) => {
    const { id } = req.params
    try{
        const getUser = await User.findById(id)
        res.json(getUser)
    }catch(error){
        throw new Error(error)
    }
})

const deleteaUser = asyncHandler(async (req,res) => {
    const { id } = req.params
    try{
        const deleteUser = await User.findByIdAndDelete(id)
        res.json(deleteUser)
    }catch(error){
        throw new Error(error)
    }
})

const updatedUser = asyncHandler(async (req,res) => {
    const { _id } = req.user
    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
                role: req?.body?.role
            },
            {
                new : true
            }
        )
        res.json(updatedUser)
    }catch(error){
        throw new Error(error)
    }
})

const blockUser = asyncHandler(async (req,res) =>{
    const {id} = req.params
    try{
        const block = User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        )
        res.json({
            message: "User Blocked",
        })
    }catch(error){
        throw new Error(error)
    }
})
const unblockUser = asyncHandler(async (req,res) =>{
    const {id} = req.params
    try{
        const unblock = User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        )
        res.json({
            message: "User unBlocked",
        })
    }catch(error){
        throw new Error(error)
    }
})
module.exports = { createUser, loginUserCtrl, getAllUsers, getaUser, deleteaUser, updatedUser, blockUser, unblockUser }
