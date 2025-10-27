export function requireFields(fields){
  return (req,res,next)=>{
    for(const f of fields) if(!(f in req.body))
      return res.status(400).json({success:false,error:`Campo obrigatório: ${f}`});
    next();
  };
}
