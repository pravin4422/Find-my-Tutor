// Utility function to get image data
export const getImageUrl = (imageData) => {
  if (!imageData) return null;
  
  // If it's already a full URL, return as is
  if (imageData.startsWith('http')) {
    return imageData;
  }
  
  // If it's base64 data, return as data URL
  if (imageData.startsWith('data:image/')) {
    return imageData;
  }
  
  // If it's just base64 string, add data URL prefix
  return `data:image/jpeg;base64,${imageData}`;
};

// Get profile picture with fallback
export const getProfilePicture = (user, defaultImage = "https://cdn-icons-png.flaticon.com/512/847/847969.png") => {
  const profileUrl = user?.profilePicture || user?.photoURL;
  return getImageUrl(profileUrl) || defaultImage;
};
