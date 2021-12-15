import multer from 'multer';
import { v4 as uuid } from 'uuid';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/');
    },
    filename: (req, file, callback) => {
        const ext = file.originalname.split('.')[file.originalname.split('.').length - 1];
        const filename = `${uuid()}.${ext}`;
        callback(null, filename);
    }
});

const profilePhoto = multer({ storage });

export default profilePhoto;
