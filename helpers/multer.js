
const path=require('path')

const multer=require('multer')

let Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        
        

        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }
})
const uploads = multer({storage:Storage})

module.exports = {uploads}