// // components/ProfileImageUploader.jsx
// import React, { useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { uploadProfileImage } from "../../redux/slices/userSlice";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";

// const ProfileImageUploader = ({
//   currentImage,
//   userId,
//   userName = "User",
//   size = "xl",
// }) => {
//   const dispatch = useDispatch();
//   const fileInputRef = useRef(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [dragOver, setDragOver] = useState(false);
//   const { profileImage } = useSelector((state) => state.user.user);

//   const sizeClasses = {
//     sm: "w-20 h-20",
//     md: "w-32 h-32",
//     lg: "w-40 h-40",
//     xl: "w-48 h-48",
//   };

//   const iconSize = {
//     sm: "text-xl",
//     md: "text-2xl",
//     lg: "text-3xl",
//     xl: "text-4xl",
//   };

//   useEffect(() => {
//     if (profileImage) {
//       setPreviewImage(`${import.meta.env.VITE_API_URL}${profileImage}`);
//     }
//   }, [profileImage]);

//   const handleFileSelect = (file) => {
//     if (!file) return;

//     // Validate file type
//     const validTypes = ["image/jpeg", "image/png", "image/webp"];
//     if (!validTypes.includes(file.type)) {
//       toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
//       return;
//     }

//     // Validate file size (max 5MB)
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     if (file.size > maxSize) {
//       toast.error("Image size must be less than 5MB");
//       return;
//     }

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreviewImage(e.target.result);
//       handleUpload(file);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleUpload = async (file) => {
//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       await dispatch(uploadProfileImage(formData)).unwrap();
//       toast.success("Profile picture updated successfully!");
//       setPreviewImage(null);
//     } catch (error) {
//       toast.error(error || "Failed to upload image");
//       setPreviewImage(null);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);

//     const file = e.dataTransfer.files[0];
//     handleFileSelect(file);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDragOver(true);
//   };

//   const handleDragLeave = () => {
//     setDragOver(false);
//   };

//   const getInitials = () => {
//     if (!userName) return "U";
//     return userName
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const displayImage = previewImage || currentImage;

//   return (
//     <div className="group relative">
//       {/* Profile Image Container */}
//       <div
//         className={` ${sizeClasses[size]} relative cursor-pointer overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-teal-100 to-blue-100 shadow-lg transition-all duration-300 ${dragOver ? "scale-105 ring-4 ring-teal-300" : "hover:scale-105"} ${isUploading ? "opacity-70" : ""} `}
//         onClick={() => !isUploading && fileInputRef.current?.click()}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//       >
//         {/* Image or Initials */}
//         {displayImage ? (
//           <img
//             src={displayImage}
//             alt="Profile"
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center">
//             <span className={`font-bold text-teal-600 ${iconSize[size]}`}>
//               {getInitials()}
//             </span>
//           </div>
//         )}

//         {/* Uploading Overlay */}
//         {isUploading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//             <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
//           </div>
//         )}

//         {/* Edit Overlay */}
//         {!isUploading && (
//           <div
//             className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${dragOver ? "opacity-100" : ""} `}
//           >
//             <div className="text-center text-white">
//               <svg
//                 className="mx-auto mb-1 h-8 w-8"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//               </svg>
//               <p className="text-xs font-medium">
//                 {dragOver ? "Drop to upload" : "Click to upload"}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Upload Icon Button */}
//       <button
//         type="button"
//         onClick={() => !isUploading && fileInputRef.current?.click()}
//         disabled={isUploading}
//         className={`absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-teal-500 text-white shadow-lg transition-all duration-200 hover:bg-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`}
//         title="Change profile picture"
//       >
//         {isUploading ? (
//           <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
//         ) : (
//           <svg
//             className="h-5 w-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//             />
//           </svg>
//         )}
//       </button>

//       {/* Hidden File Input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         accept="image/*"
//         onChange={(e) => {
//           const file = e.target.files[0];
//           if (file) handleFileSelect(file);
//           e.target.value = ""; // Reset input
//         }}
//       />

//       {/* Drag & Drop Instruction Modal */}
//       {dragOver && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//           <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
//             <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
//               <svg
//                 className="h-10 w-10 text-teal-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                 />
//               </svg>
//             </div>
//             <h3 className="mb-2 text-xl font-bold text-gray-800">
//               Drop your image
//             </h3>
//             <p className="mb-4 text-gray-600">
//               Release to upload your profile picture
//             </p>
//             <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
//               Supports: JPEG, PNG, GIF, WebP (Max 5MB)
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileImageUploader;

// demo2
// components/ProfileImageUploader.jsx
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { uploadProfileImage } from "../../redux/slices/userSlice";

const ProfileImageUploader = ({ size = "xl" }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Get user data from Redux
  const { user } = useSelector((state) => state.user);
  const { firstName, lastName, profileImage } = user || {};

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
    xl: "w-48 h-48",
  };

  const iconSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  // Build the full image URL from stored profileImage
  const getImageUrl = () => {
    if (!profileImage) return null;

    // If it's already a full URL, return as is
    if (profileImage.startsWith("http")) {
      return profileImage;
    }

    // If it's a relative path, prepend the API URL
    // Remove leading slash if present to avoid double slash
    const cleanPath = profileImage.replace(/^\//, "");

    return `${import.meta.env.VITE_API_URL || ""}/${cleanPath}`;
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalPreview(e.target.result);
      handleUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      await dispatch(uploadProfileImage(formData)).unwrap();
      toast.success("Profile picture updated successfully!");
      // Keep local preview until Redux updates
    } catch (error) {
      toast.error(error || "Failed to upload image");
      setLocalPreview(null); // Clear preview on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const getInitials = () => {
    if (!firstName && !lastName) return "U";
    const name = `${firstName || ""} ${lastName || ""}`.trim();
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine what to display
  const hasImage = localPreview || getImageUrl();
  const imageToDisplay = localPreview || getImageUrl();

  return (
    <div className="group relative">
      {/* Profile Image Container */}
      <div
        className={`${sizeClasses[size]} relative cursor-pointer overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-teal-100 to-blue-100 shadow-lg transition-all duration-300 ${dragOver ? "scale-105 ring-4 ring-teal-300" : "hover:scale-105"} ${isUploading ? "opacity-70" : ""}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Show image if we have one */}
        {hasImage ? (
          <img
            src={imageToDisplay}
            alt={`${firstName || ""} ${lastName || ""}`.trim() || "Profile"}
            className="h-full w-full object-cover"
            onError={(e) => {
              // If image fails to load, hide the img element
              // The initials will show because hasImage becomes false
              e.target.style.display = "none";
            }}
          />
        ) : (
          // Show initials when no image
          <div className="flex h-full w-full items-center justify-center">
            <span className={`font-bold text-teal-600 ${iconSize[size]}`}>
              {getInitials()}
            </span>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
          </div>
        )}

        {/* Edit Overlay - Show only when not uploading */}
        {!isUploading && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${dragOver ? "opacity-100" : ""}`}
          >
            <div className="text-center text-white">
              <svg
                className="mx-auto mb-1 h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-xs font-medium">
                {dragOver ? "Drop to upload" : "Click to upload"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Icon Button */}
      <button
        type="button"
        onClick={() => !isUploading && fileInputRef.current?.click()}
        disabled={isUploading}
        className={`absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-teal-500 text-white shadow-lg transition-all duration-200 hover:bg-teal-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`}
        title="Change profile picture"
      >
        {isUploading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
          </svg>
        )}
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleFileSelect(file);
          e.target.value = ""; // Reset input
        }}
      />

      {/* Drag & Drop Instruction Modal */}
      {dragOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
              <svg
                className="h-10 w-10 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Drop your image
            </h3>
            <p className="mb-4 text-gray-600">
              Release to upload your profile picture
            </p>
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
              Supports: JPEG, PNG, WebP (Max 5MB)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
