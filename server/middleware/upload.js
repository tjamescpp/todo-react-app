import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js'; // path to the helper

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'tasker-profile-pics', // Cloudinary folder name
        allowed_formats: ['jpg', 'jpeg'],
        transformation: [{ width: 300, height: 300, crop: 'fill' }], // optional resize
    },
});

export const upload = multer({ storage: multer.memoryStorage() });
