export const fileUploadConfig = {
  destination: './assets',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  allowedFileNamePattern: /^[a-zA-Z0-9-_. ]+$/,
};
