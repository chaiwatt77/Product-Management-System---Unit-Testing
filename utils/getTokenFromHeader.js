export const getTokenFromHeader = (req)=>{
  const token = req?.headers?.authorization?.split(" ")[1]
  if(token===undefined){
    return false
  }else{
    return token
  }
}