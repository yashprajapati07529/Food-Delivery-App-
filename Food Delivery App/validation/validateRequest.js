import { validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
     const errors = validationResult(req)


    if(!errors.isEmpty()){
        return res.status(422).json({
            success:false,
            errors:errors.array().map(error => ({
                field:error.path,
                message:error.msg
            }))
        })
    }

    next()
}

export default validateRequest;
