import { NextApiRequestWithUserId } from '@/types'
import authGuard from '@/utils/authGuard'
import prisma from '@/utils/prisma'
import multer from 'multer'
import { NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/avatars',
        filename: (req, file, cb) => cb(null, file.originalname)
    })
})

const uploadHandler = createRouter<
    NextApiRequestWithUserId & { file?: Express.Multer.File },
    NextApiResponse
>()

//@ts-ignore
uploadHandler.use(upload.single('avatar'))

uploadHandler.post(async (req: NextApiRequestWithUserId & { file?: Express.Multer.File }, res: NextApiResponse) => {
    if (!req.file) {
        return res.status(500).json({ message: 'File write error' })
    }

    try {
        const user = await prisma.user.update({
            where: { id: req.userId },
            data: {
                avatarUrl: req.file.path.replace('public', '')
            },
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                email: true
            }
        })

        res.status(200).json(user)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'User update error' })
    }
})

export default authGuard(uploadHandler.handler())

export const config = {
    api: {
        bodyParser: false
    }
}