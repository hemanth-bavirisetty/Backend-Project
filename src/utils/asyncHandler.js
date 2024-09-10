const asyncHandler = (requestHandler) => {
	(req, res, next) => {
		Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
	};
};

export { asyncHandler };

/**
 *
 * using try and catch
 *
 * const asyncHandler = (reqHandler)=> async (req,res,next)=>{
 *    try{
 *       await reqHandler(req,res,next) *
 *    }catch(err){
 *       console.log(err);
 *       res.status(err.code).json({
 *          success:false,
 *          message:err.message
 *       })
 *    }
 * }
 *
 */
