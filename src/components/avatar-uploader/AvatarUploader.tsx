'use client';

import { IUser } from '@/types/User';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import ImagePlaceholder from '@/../public/profile-picture-placeholder.jpg';
import { FiEdit3 } from 'react-icons/fi';

import styles from './avatar-uploader.module.scss';

interface AvatarUploaderProps {
  onUploadSuccess: (url: string) => void;
  user: IUser;
}

export function AvatarUploader({ onUploadSuccess, user }: AvatarUploaderProps) {
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <CldUploadWidget
      uploadPreset={UPLOAD_PRESET}
      signatureEndpoint={`${BASE_URL}/api/sign-cloudinary-params`}
      onSuccess={(result) => {
        if (typeof result.info === 'object' && 'secure_url' in result.info) {
          onUploadSuccess(result.info.secure_url);
        }
      }}
      options={{
        singleUploadAutoClose: true,
      }}
    >
      {({ open }) => {
        return (
          <div className={styles.container} onClick={() => open()}>
            <Image
              src={user.photoURL ? user.photoURL : ImagePlaceholder}
              alt="user photo"
              fill
              style={{ objectFit: 'cover' }}
            />

            <div className={styles.container__editOverlay}>
              <FiEdit3 />
              Edit Photo
            </div>
          </div>
        );
      }}
    </CldUploadWidget>
  );
}
