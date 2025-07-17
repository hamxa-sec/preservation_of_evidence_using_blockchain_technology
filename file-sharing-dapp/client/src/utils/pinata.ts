import axios from 'axios';

export const pinFileToIPFS = async (
  formData: FormData,
  onProgress: (progress: number) => void
): Promise<{ IpfsHash: string }> => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: process.env.REACT_APP_PINATA_API_KEY || '',
      pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY || '',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      onProgress(percentCompleted);
    },
  });
  return response.data;
};
