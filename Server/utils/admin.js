module.exports.isAdmin=async(req,res,next)=>{
    if(!res.locals.admin)
        return res.send({error:true,authenticated:false})
    next()
}