import { useState, useRef, SyntheticEvent } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import Image, { StaticImageData } from 'next/image';

import PlaceholderImg from '../../../public/profile-picture-placeholder.jpg';

import styles from './image-picker.module.scss';
import { IUser } from '@/types/User';
import { useUser } from '@/utils/Providers/UserProvider';

interface IImagePickerProps {
  user: IUser;
}

export default function ImagePicker({ user }: IImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { token } = useUser();
  const [src, setSrc] = useState<string | ArrayBuffer | StaticImageData | null>(
    user?.photoURL || PlaceholderImg
  );

  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const handlePickerClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    // if (file) {
    //   try {
    //     await uploadImage(file);
    //   } catch (error) {
    //     console.error('Image upload failed', error);
    //   }
    // }

    if (file) {
      console.log('FILE:', file);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const unsignedUploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

        if (!unsignedUploadPreset) {
          console.error('Cloudinary credentials not provided');
          return null;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', unsignedUploadPreset);
        const response = await fetch(`${BASE_URL}/api/user/upload-image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to upload new image: ${error.message}`);
        }
        throw error;
      }
    }
  };

  const handleSave = async () => {
    if (imageRef) {
      const canvas = document.createElement('canvas');
      canvas.width = imageRef.naturalWidth;
      canvas.height = imageRef.naturalHeight;

      const ctx = canvas.getContext('2d');

      ctx?.drawImage(
        imageRef,
        0,
        0,
        imageRef.naturalWidth,
        imageRef.naturalHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            // const formData = new FormData();
            // formData.append('file', );
            // try {
            //   console.log(formData);
            //   // uploadImage(formData);
            // } catch (error) {
            //   console.error('Image upload failed', error);
            // }
          }
        },
        'image/jpeg',
        0.8
      );
    }
  };

  return (
    <div className={styles.container} onClick={handlePickerClick}>
      <Image
        src={typeof src === 'string' ? src : PlaceholderImg}
        alt="user photo"
        fill
        style={{ objectFit: 'cover' }}
        onLoad={(event) => setImageRef(event.currentTarget as HTMLImageElement)}
      />

      <div className={styles.container__editOverlay}>
        <FiEdit3 />
        Edit Photo
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
