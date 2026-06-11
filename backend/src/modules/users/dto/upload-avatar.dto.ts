import { IsNotEmpty, Max, Min } from 'class-validator';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5_242_880;

export class UploadAvatarDto {
  @IsNotEmpty({ message: 'MIME type is required' })
  mimeType: string;

  @IsNotEmpty({ message: 'File size is required' })
  fileSize: number;
}

export function validateAvatarFile(mimeType: string, fileSize: number): string | null {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return 'Chỉ chấp nhận file .jpeg, .jpg, .png';
  }
  if (fileSize > MAX_FILE_SIZE) {
    return 'Kích thước file tối đa là 5MB';
  }
  return null;
}
