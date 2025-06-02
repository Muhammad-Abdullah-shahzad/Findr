const uploadImageToCloudinary = async (image) => {
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/abdullahCloud/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'MY_UPLOAD_PRESET'; // Replace with your actual Cloudinary upload preset
    console.log('image recieved to upload cloudinary function', image);
    
    if (!image || !image.type.startsWith('image/')) {
      console.error('Uploaded file is not an image.');
      throw new Error('Uploaded file is not an image.');
    }

    const imageData = new FormData();
    imageData.append('file', image);
    imageData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: imageData,
      });

      const data = await response.json();

      if (response.ok) {
        return data.secure_url; // Return the Cloudinary URL
      } else {
        console.error('Cloudinary response error:', data);
        throw new Error(data.error.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('An error occurred while uploading the image. Please try again.');
    }
  };

  export default uploadImageToCloudinary