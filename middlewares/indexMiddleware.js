const indexMiddleware = {
    validateLogin: async function (req, res, next){
        var {email, pass} = req.body;
        if(false){
            res.send();
        }else if(false){
            res.sende();
        }else{
            res.next();
        }

        
    }
}

module.exports = indexMiddleware;