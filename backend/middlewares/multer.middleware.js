const multer = require('multer')

const storage = multer.memoryStorage()

const fileFilter = (req,file,cb)=>{
    const allow = ['image/jpeg','image/png','application/pdf',
        'text/plain'
    ]

    if(allow.includes(file.mimetype)) {
        cb(null,true)
    }else{
        cb(new Error('❌ Only JPEG, PNG, PDF allowed'), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize : 10 * 1024 * 1024}
})

module.exports = upload