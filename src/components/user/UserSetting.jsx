// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getUser, updateUser } from "../../redux/slices/userSlice";
// import { FaSpinner } from "react-icons/fa";
// import { FaPencil } from "react-icons/fa6";
// import { toast } from "react-toastify";

// const UserSetting = () => {
//   const dispatch = useDispatch();
//   const { user, status, error } = useSelector((state) => state.user);
//   const {
//     firstName,
//     lastName,
//     email,
//     phone,
//     addresses,
//     dob,
//     gender,
//     twoFactorEnabled,
//   } = user || {};

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     addresses: [],
//     dob: "",
//     gender: "",
//     twoFactorEnabled: false,
//   });

//   const [isEditing, setIsEditing] = useState(false);

//   // Load user on mount
//   useEffect(() => {
//     dispatch(getUser());
//   }, [dispatch]);

//   // Sync local state with Redux when user data changes
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         firstName: firstName || "",
//         lastName: lastName || "",
//         email: email || "",
//         phone: phone || "",
//         addresses: addresses || [
//           {
//             street: "",
//             city: "",
//             state: "",
//             postalCode: "",
//             country: "",
//           },
//         ],
//         dob: dob || "",
//         gender: gender || "",
//         twoFactorEnabled: twoFactorEnabled || false,
//       });
//     }
//   }, [
//     user,
//     firstName,
//     lastName,
//     email,
//     phone,
//     addresses,
//     dob,
//     gender,
//     twoFactorEnabled,
//   ]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Handle nested address fields
//     if (name.startsWith("address.")) {
//       const addressField = name.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         address: {
//           ...prev.addresses,
//           [addressField]: value,
//         },
//       }));
//     } else {
//       // Handle regular fields
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleAddressChange = (index, field, value) => {
//     setFormData((prev) => {
//       const updated = [...prev.addresses];
//       updated[index] = {
//         ...updated[index],
//         [field]: value,
//       };
//       return { ...prev, addresses: updated };
//     });
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(updateUser(formData)).unwrap();
//       toast.success("Profile updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       toast.error(error.message || "Failed to update profile");
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       firstName: firstName || "",
//       lastName: lastName || "",
//       email: email || "",
//       phone: phone || "",
//       address: address || {
//         street: "",
//         city: "",
//         state: "",
//         postalCode: "",
//         country: "",
//       },
//       dob: dob || "",
//       gender: gender || "",
//       twoFactorEnabled: twoFactorEnabled || false,
//     });
//     setIsEditing(false);
//   };

//   if (status === "loading" && !user) {
//     return (
//       <div className="flex h-64 items-center justify-center">
//         <FaSpinner className="animate-spin text-2xl text-teal-500" />
//       </div>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <div className="rounded bg-red-100 p-4 text-red-700">
//         Error: {error || "Failed to load user data"}
//       </div>
//     );
//   }

//   // State for managing addresses
//   // const [editingAddressIndex, setEditingAddressIndex] = useState(-1);

//   const handleRemoveAddress = (index) => {
//     const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
//     setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
//   };

//   // Set default address
//   const handleSetDefaultAddress = (index) => {
//     const updatedAddresses = formData.addresses.map((addr, i) => ({
//       ...addr,
//       isDefault: i === index,
//     }));
//     setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
//   };

//   const [isAddingAddress, setIsAddingAddress] = useState(false);
//   const [newAddress, setNewAddress] = useState({
//     addressType: "home",
//     street: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "India",
//     isDefault: false,
//   });

//   const handleAddAddress = () => {
//     const updatedAddresses = [
//       ...formData.addresses,
//       {
//         ...newAddress,
//         isDefault: formData.addresses.length === 0 || newAddress.isDefault,
//       },
//     ];

//     // If this is set as default, unset others
//     if (newAddress.isDefault) {
//       updatedAddresses.forEach((addr, index) => {
//         if (index !== updatedAddresses.length - 1) {
//           addr.isDefault = false;
//         }
//       });
//     }

//     setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
//     setNewAddress({
//       addressType: "home",
//       street: "",
//       city: "",
//       state: "",
//       postalCode: "",
//       country: "India",
//       isDefault: false,
//     });
//     setIsAddingAddress(false);
//   };
//   return (
//     <div className="mx-auto max-w-xl px-4 py-8 sm:max-w-lg sm:px-6 lg:max-w-4xl lg:px-8">
//       <div className="rounded-lg bg-white p-6 shadow-xl">
//         <div className="mb-6 flex items-center justify-between border-b pb-4">
//           <h2 className="text-2xl font-bold text-gray-800">My Settings</h2>
//           <button
//             type="button"
//             onClick={() => setIsEditing((prev) => !prev)}
//             className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
//               isEditing
//                 ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 : "bg-green-100 text-green-700 hover:bg-green-200"
//             } transition-colors`}
//           >
//             <FaPencil />
//             {isEditing ? "Cancel" : "Edit"}
//           </button>
//         </div>

//         <form onSubmit={handleSave} className="space-y-5">
//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//             <div className="flex flex-col">
//               <label className="mb-1 text-sm font-medium text-gray-700">
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className={`rounded-md border px-3 py-2 ${
//                   isEditing
//                     ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
//                     : "border-gray-200 bg-gray-50"
//                 }`}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 text-sm font-medium text-gray-700">
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className={`rounded-md border px-3 py-2 ${
//                   isEditing
//                     ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
//                     : "border-gray-200 bg-gray-50"
//                 }`}
//               />
//             </div>
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               disabled
//               className="cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium text-gray-700">
//               Phone
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className={`rounded-md border px-3 py-2 ${
//                 isEditing
//                   ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
//                   : "border-gray-200 bg-gray-50"
//               }`}
//             />
//           </div>

//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//             <div className="flex flex-col">
//               <label className="mb-1 text-sm font-medium text-gray-700">
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className={`rounded-md border px-3 py-2 ${
//                   isEditing
//                     ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
//                     : "border-gray-200 bg-gray-50"
//                 }`}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 text-sm font-medium text-gray-700">
//                 Gender
//               </label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className={`rounded-md border px-3 py-2 ${
//                   isEditing
//                     ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
//                     : "border-gray-200 bg-gray-50"
//                 }`}
//               >
//                 <option value="">Select gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//                 {/* <option value="Prefer not to say">Prefer not to say</option> */}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//             {/* Two Factor Authentication Toggle */}
//             <div className="flex flex-col">
//               <label className="mb-1 text-sm font-medium text-gray-700">
//                 Two Factor Authentication
//               </label>
//               <div className="flex items-center">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (isEditing) {
//                       setFormData((prev) => ({
//                         ...prev,
//                         twoFactorEnabled: !prev.twoFactorEnabled,
//                       }));
//                     }
//                   }}
//                   disabled={!isEditing}
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none ${
//                     formData.twoFactorEnabled ? "bg-[#0b8263]" : "bg-gray-200"
//                   } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
//                 >
//                   <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                       formData.twoFactorEnabled
//                         ? "translate-x-6"
//                         : "translate-x-1"
//                     }`}
//                   />
//                 </button>
//                 <span className="ml-3 text-sm font-medium text-gray-700">
//                   {formData.twoFactorEnabled ? "Enabled" : "Disabled"}
//                 </span>
//               </div>
//             </div>

//             {/* Empty column to maintain grid layout */}
//             <div></div>

//             {/* Address Block */}

//             <div className="col-span-full space-y-4">
//               <h3 className="text-lg font-medium text-gray-700">Addresses</h3>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 {/* Existing address cards */}
//                 {formData.addresses.map((address, index) => (
//                   <div
//                     key={index}
//                     className="relative rounded-lg border border-gray-200 p-5 shadow-sm transition-all hover:shadow-md"
//                   >
//                     <div className="mb-4 flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div
//                           className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                             address.addressType === "home"
//                               ? "bg-teal-100 text-teal-600"
//                               : address.addressType === "work"
//                                 ? "bg-purple-100 text-purple-600"
//                                 : "bg-gray-100 text-gray-600"
//                           }`}
//                         >
//                           {address.addressType === "home"
//                             ? "🏠"
//                             : address.addressType === "work"
//                               ? "🏢"
//                               : "📍"}
//                         </div>
//                         <h4 className="ml-3 font-medium text-gray-900 capitalize">
//                           {address.addressType} Address
//                         </h4>
//                       </div>

//                       {address.isDefault && (
//                         <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
//                           Default
//                         </span>
//                       )}
//                     </div>

//                     <div className="space-y-3">
//                       <div className="flex flex-col">
//                         <span className="text-xs font-medium text-gray-500">
//                           Street
//                         </span>
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             value={address.street}
//                             onChange={(e) =>
//                               handleAddressChange(
//                                 index,
//                                 "street",
//                                 e.target.value,
//                               )
//                             }
//                             className="rounded-md border px-2 py-1 text-sm"
//                           />
//                         ) : (
//                           <span className="text-sm text-gray-900">
//                             {address.street || "Not specified"}
//                           </span>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="flex flex-col">
//                           <span className="text-xs font-medium text-gray-500">
//                             City
//                           </span>
//                           {isEditing ? (
//                             <input
//                               type="text"
//                               value={address.city}
//                               onChange={(e) =>
//                                 handleAddressChange(
//                                   index,
//                                   "city",
//                                   e.target.value,
//                                 )
//                               }
//                               className="rounded-md border px-2 py-1 text-sm"
//                             />
//                           ) : (
//                             <span className="text-sm text-gray-900">
//                               {address.city || "Not specified"}
//                             </span>
//                           )}
//                           {/* <span className="text-sm text-gray-900">
//                             {address.city || "—"}
//                           </span> */}
//                         </div>

//                         <div className="flex flex-col">
//                           <span className="text-xs font-medium text-gray-500">
//                             State
//                           </span>
//                           {isEditing ? (
//                             <input
//                               type="text"
//                               value={address.state}
//                               onChange={(e) =>
//                                 handleAddressChange(
//                                   index,
//                                   "state",
//                                   e.target.value,
//                                 )
//                               }
//                               className="rounded-md border px-2 py-1 text-sm"
//                             />
//                           ) : (
//                             <span className="text-sm text-gray-900">
//                               {address.state || "Not specified"}
//                             </span>
//                           )}
//                           {/* <span className="text-sm text-gray-900">
//                             {address.state || "—"}
//                           </span> */}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="flex flex-col">
//                           <span className="text-xs font-medium text-gray-500">
//                             Postal Code
//                           </span>
//                           <span className="text-sm text-gray-900">
//                             {address.postalCode || "—"}
//                           </span>
//                           {isEditing ? (
//                             <input
//                               type="text"
//                               value={address.postalCode}
//                               onChange={(e) =>
//                                 handleAddressChange(
//                                   index,
//                                   "postalCode",
//                                   e.target.value,
//                                 )
//                               }
//                               className="rounded-md border px-2 py-1 text-sm"
//                             />
//                           ) : (
//                             <span className="text-sm text-gray-900">
//                               {address.postalCode || "Not specified"}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex flex-col">
//                           <span className="text-xs font-medium text-gray-500">
//                             Country
//                           </span>
//                           <span className="text-sm text-gray-900">
//                             {address.country || "—"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {isEditing && (
//                       <div className="mt-4 flex justify-end space-x-2 border-t border-gray-100 pt-4">
//                         <button
//                           type="button"
//                           onClick={() => handleSetDefaultAddress(index)}
//                           disabled={address.isDefault}
//                           className="rounded-md bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                           {address.isDefault ? "Default" : "Set Default"}
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveAddress(index)}
//                           className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Add New Address Card */}
//                 {isEditing && (
//                   <div className="flex">
//                     {formData.addresses.length === 0 ? (
//                       // Empty state - centered plus button
//                       <div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
//                         <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
//                           <svg
//                             className="h-8 w-8 text-gray-400"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                             />
//                           </svg>
//                         </div>
//                         <p className="mb-2 text-sm font-medium text-gray-900">
//                           No addresses yet
//                         </p>
//                         <p className="mb-4 text-xs text-gray-500">
//                           Add your first address to get started
//                         </p>
//                         <button
//                           type="button"
//                           onClick={() => setIsAddingAddress(true)}
//                           className="rounded-md bg-[#0b8263] px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
//                         >
//                           Add Address
//                         </button>
//                       </div>
//                     ) : (
//                       // Plus button card
//                       <div
//                         onClick={() => setIsAddingAddress(true)}
//                         className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-teal-400 hover:bg-teal-50"
//                       >
//                         <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
//                           <svg
//                             className="h-6 w-6 text-teal-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                             />
//                           </svg>
//                         </div>
//                         <p className="text-sm font-medium text-gray-700">
//                           Add another address
//                         </p>
//                         <p className="text-xs text-gray-500">Click to add</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Add Address Modal/Form */}
//               {isAddingAddress && (
//                 <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70">
//                   <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
//                     <div className="mb-4 flex items-center justify-between">
//                       <h3 className="text-lg font-medium text-gray-900">
//                         Add New Address
//                       </h3>
//                       <button
//                         onClick={() => setIsAddingAddress(false)}
//                         className="text-gray-400 hover:text-gray-600"
//                       >
//                         <svg
//                           className="h-6 w-6"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M6 18L18 6M6 6l12 12"
//                           />
//                         </svg>
//                       </button>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Address Type
//                         </label>
//                         <select
//                           value={newAddress.addressType}
//                           onChange={(e) =>
//                             setNewAddress((prev) => ({
//                               ...prev,
//                               addressType: e.target.value,
//                             }))
//                           }
//                           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
//                         >
//                           <option value="home">Home</option>
//                           <option value="work">Work</option>
//                           <option value="other">Other</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Street Address
//                         </label>
//                         <input
//                           type="text"
//                           value={newAddress.street}
//                           onChange={(e) =>
//                             setNewAddress((prev) => ({
//                               ...prev,
//                               street: e.target.value,
//                             }))
//                           }
//                           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
//                           placeholder="123 Main St"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">
//                             City
//                           </label>
//                           <input
//                             type="text"
//                             value={newAddress.city}
//                             onChange={(e) =>
//                               setNewAddress((prev) => ({
//                                 ...prev,
//                                 city: e.target.value,
//                               }))
//                             }
//                             required
//                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
//                             placeholder="New York"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">
//                             State
//                           </label>
//                           <input
//                             type="text"
//                             value={newAddress.state}
//                             onChange={(e) =>
//                               setNewAddress((prev) => ({
//                                 ...prev,
//                                 state: e.target.value,
//                               }))
//                             }
//                             required
//                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
//                             placeholder="NY"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">
//                             Postal Code
//                           </label>
//                           <input
//                             type="text"
//                             value={newAddress.postalCode}
//                             onChange={(e) =>
//                               setNewAddress((prev) => ({
//                                 ...prev,
//                                 postalCode: e.target.value,
//                               }))
//                             }
//                             required
//                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
//                             placeholder="10001"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">
//                             Country
//                           </label>
//                           <input
//                             value={newAddress.country || "India"}
//                             onChange={(e) =>
//                               setNewAddress((prev) => ({
//                                 ...prev,
//                                 country: e.target.value,
//                               }))
//                             }
//                             disabled="true"
//                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
//                           />
//                           {/* <option value="US">United States</option>
//                             <option value="CA">Canada</option>
//                             <option value="UK">United Kingdom</option>
//                             <option value="AU">Australia</option>
//                             <option value="DE">Germany</option>
//                             <option value="FR">France</option>
//                             <option value="IN">India</option> */}
//                         </div>
//                       </div>

//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           id="defaultAddress"
//                           checked={newAddress.isDefault}
//                           onChange={(e) =>
//                             setNewAddress((prev) => ({
//                               ...prev,
//                               isDefault: e.target.checked,
//                             }))
//                           }
//                           className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
//                         />
//                         <label
//                           htmlFor="defaultAddress"
//                           className="ml-2 block text-sm text-gray-900"
//                         >
//                           Set as default address
//                         </label>
//                       </div>
//                     </div>

//                     <div className="mt-6 flex justify-end space-x-3">
//                       <button
//                         type="button"
//                         onClick={() => setIsAddingAddress(false)}
//                         className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleAddAddress}
//                         className="rounded-md bg-[#0b8263] px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
//                       >
//                         Add Address
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {isEditing && (
//             <div className="flex justify-end gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={status === "updating"}
//                 className="flex items-center justify-center rounded-md border border-transparent bg-[#0b8263] px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
//               >
//                 {status === "updating" ? (
//                   <>
//                     <FaSpinner className="mr-2 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserSetting;

// demo2
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "../../redux/slices/userSlice";
import { FaSpinner } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { toast } from "react-toastify";
import PincodeInput from "./Pincode";

const UserSetting = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);
  const {
    firstName,
    lastName,
    email,
    phone,
    addresses,
    dob,
    gender,
    twoFactorEnabled,
  } = user || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addresses: [],
    dob: "",
    gender: "",
    twoFactorEnabled: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressType: "home",
    street: "",
    building: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState({});

  // Load user on mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  useEffect(() => {
    if (status === "succeeded") {
      setIsEditing(false);
    }
  }, [status]);

  // Sync local state with Redux when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        phone: phone || "",
        addresses: addresses || [
          {
            building: "",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
        ],
        dob: dob || "",
        gender: gender || "",
        twoFactorEnabled: twoFactorEnabled || false,
      });
    }
  }, [
    user,
    firstName,
    lastName,
    email,
    phone,
    addresses,
    dob,
    gender,
    twoFactorEnabled,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    // if (name.startsWith("address.")) {
    //   const addressField = name.split(".")[1];
    //   setFormData((prev) => ({
    //     ...prev,
    //     address: {
    //       ...prev.addresses,
    //       [addressField]: value,
    //     },
    //   }));
    // } else {
    // Handle regular fields
    setFormData((prev) => ({ ...prev, [name]: value }));
    // }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.dob) {
      errors.dob = "Please enter your DOB";
    }
    if (!["Male", "Female", "Other"].includes(formData.gender)) {
      errors.gender = "Please select a valid gender";
    }

    // // Address validation
    const addressErrors = {};
    formData.addresses.forEach((addr, index) => {
      const addrErr = {};
      if (!addr.building?.trim())
        addrErr.building = "Building/flat is required";
      if (!addr.street?.trim()) addrErr.street = "Street is required";
      if (!addr.city?.trim()) addrErr.city = "City is required";
      if (!addr.state?.trim()) addrErr.state = "State is required";
      if (!addr.postalCode?.trim())
        addrErr.postalCode = "Postal code is required";

      if (Object.keys(addrErr).length > 0) {
        addressErrors[index] = addrErr;
      }
    });

    if (Object.keys(addressErrors).length > 0) {
      errors.addresses = addressErrors;
    }

    return errors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    setFormErrors({}); // clear old errors
    try {
      console.log(FormData, "formdata");
      await dispatch(updateUser(formData)).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phone: phone || "",
      // address: addresses || {
      //   street: "",
      //   city: "",
      //   building: "",
      //   state: "",
      //   postalCode: "",
      //   country: "",
      // },
      addresses: addresses || [
        {
          street: "",
          city: "",
          building: "",
          state: "",
          postalCode: "",
          country: "",
        },
      ],
      dob: dob || "",
      gender: gender || "",
      twoFactorEnabled: twoFactorEnabled || false,
    });
    setIsEditing(false);
  };

  if (status === "loading" && !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <FaSpinner className="animate-spin text-2xl text-teal-500" />
      </div>
    );
  }

  // if (status === "failed") {

  //   return (
  //     <div className="rounded bg-red-100 p-4 text-red-700">
  //       Error: {error || "Failed to load user data"}
  //     </div>

  //   );
  // }

  // State for managing addresses
  // const [editingAddressIndex, setEditingAddressIndex] = useState(-1);

  // const handleRemoveAddress = (index) => {
  //   const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
  //   setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
  // };

  const handleRemoveAddress = (index) => {
    const addressToRemove = formData.addresses[index];
    const updatedAddresses = formData.addresses.filter((_, i) => i !== index);

    // If we removed the default address and there are other addresses, set the first one as default
    if (addressToRemove.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
  };

  // Set default address
  const handleSetDefaultAddress = (index) => {
    const updatedAddresses = formData.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
  };

  const handleAddAddress = () => {
    // If new address is set as default, unset all existing addresses
    const updatedAddresses = formData.addresses.map((addr) => ({
      ...addr,
      isDefault: newAddress.isDefault ? false : addr.isDefault,
    }));

    // Add the new address
    updatedAddresses.push({
      ...newAddress,
      isDefault: formData.addresses.length === 0 || newAddress.isDefault,
    });

    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));

    setNewAddress({
      addressType: "home",
      building: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    });
    setIsAddingAddress(false);
  };

  const handleAddressChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: value,
      };
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const handlePincodeSelect = (pincodeData) => {
    setNewAddress((prev) => ({
      ...prev,
      postalCode: pincodeData.pincode,
      city: pincodeData.district,
      state: pincodeData.state,
      street: pincodeData.areaName,
      country: pincodeData.country || "India",
    }));
  };
  return (
    <div className="font-mont mx-auto max-w-md px-4 py-8 sm:max-w-lg sm:px-6 lg:max-w-6xl lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Settings</h2>
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className={`z-30 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              isEditing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            } transition-colors`}
          >
            <FaPencil />
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
        {status === "failed" && (
          <div className="rounded bg-red-100 p-4 text-red-700">
            Error: {error || "Failed to load user data"}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`rounded-md border px-3 py-2 ${
                  isEditing
                    ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
              {formErrors.firstName && (
                <p className="mt-1 text-xs text-red-600">
                  {formErrors.firstName}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`rounded-md border px-3 py-2 ${
                  isEditing
                    ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
              {formErrors.lastName && (
                <p className="mt-1 text-xs text-red-600">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`rounded-md border px-3 py-2 ${
                isEditing
                  ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  : "border-gray-200 bg-gray-50"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={!isEditing}
                className={`rounded-md border px-3 py-2 ${
                  isEditing
                    ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
              {formErrors.dob && (
                <p className="mt-1 text-xs text-red-600">{formErrors.dob}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className={`rounded-md border px-3 py-2 ${
                  isEditing
                    ? "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                {/* <option value="Prefer not to say">Prefer not to say</option> */}
              </select>
              {formErrors.gender && (
                <p className="mt-1 text-xs text-red-600">{formErrors.gender}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Two Factor Authentication Toggle */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Two Factor Authentication
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      setFormData((prev) => ({
                        ...prev,
                        twoFactorEnabled: !prev.twoFactorEnabled,
                      }));
                    }
                  }}
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none ${
                    formData.twoFactorEnabled ? "bg-teal-600" : "bg-gray-200"
                  } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.twoFactorEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {formData.twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {/* Empty column to maintain grid layout */}
            <div></div>

            {/* Address Block */}

            <div className="col-span-full space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Addresses</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Existing address cards */}
                {formData.addresses.map((address, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg border border-gray-200 p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            address.addressType === "home"
                              ? "bg-teal-100 text-teal-600"
                              : address.addressType === "work"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {address.addressType === "home"
                            ? "🏠"
                            : address.addressType === "work"
                              ? "🏢"
                              : "📍"}
                        </div>
                        <h4 className="ml-3 font-medium text-gray-900 capitalize">
                          {address.addressType} Address
                        </h4>
                      </div>

                      {address.isDefault && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">
                          Building/Flat
                        </span>

                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={address.building}
                              onChange={(e) =>
                                handleAddressChange(
                                  index,
                                  "building",
                                  e.target.value,
                                )
                              }
                              className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                            {formErrors.addresses?.[index]?.building && (
                              <p className="mt-1 text-xs text-red-600">
                                {formErrors.addresses[index].building}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-900">
                            {address.building || "Not specified"}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">
                          Street
                        </span>
                        {/* <span className="text-sm text-gray-900">
                          {address.street || "Not specified"}
                        </span> */}
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={address.street}
                              onChange={(e) =>
                                handleAddressChange(
                                  index,
                                  "street",
                                  e.target.value,
                                )
                              }
                              className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                            {formErrors.addresses?.[index]?.street && (
                              <p className="mt-1 text-xs text-red-600">
                                {formErrors.addresses[index].building}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-900">
                            {address.street || "Not specified"}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-500">
                            City
                          </span>

                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={address.city}
                                onChange={(e) =>
                                  handleAddressChange(
                                    index,
                                    "city",
                                    e.target.value,
                                  )
                                }
                                className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                              />
                              {formErrors.addresses?.[index]?.city && (
                                <p className="mt-1 text-xs text-red-600">
                                  {formErrors.addresses[index].city}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-900">
                              {address.city || "Not specified"}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-500">
                            State
                          </span>
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={address.state}
                                onChange={(e) =>
                                  handleAddressChange(
                                    index,
                                    "state",
                                    e.target.value,
                                  )
                                }
                                className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                              />
                              {formErrors.addresses?.[index]?.state && (
                                <p className="mt-1 text-xs text-red-600">
                                  {formErrors.addresses[index].state}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-900">
                              {address.state || "Not specified"}
                            </span>
                          )}
                          {/* <span className="text-sm text-gray-900">
                            {address.state || "—"}
                          </span> */}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-500">
                            Postal Code
                          </span>
                          {/* <span className="text-sm text-gray-900">
                            {address.postalCode || "—"}
                          </span> */}
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={address.postalCode}
                                onChange={(e) =>
                                  handleAddressChange(
                                    index,
                                    "postalCode",
                                    e.target.value,
                                  )
                                }
                                className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                              />
                              {formErrors.addresses?.[index]?.postalCode && (
                                <p className="mt-1 text-xs text-red-600">
                                  {formErrors.addresses[index].postalCode}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-900">
                              {address.postalCode || "Not specified"}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-500">
                            Country
                          </span>

                          {isEditing ? (
                            <input
                              type="text"
                              value={address.country}
                              onChange={(e) =>
                                handleAddressChange(
                                  index,
                                  "country",
                                  e.target.value,
                                )
                              }
                              className="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                          ) : (
                            <span className="text-sm text-gray-900">
                              {address.country || "Not specified"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-4 flex justify-end space-x-2 border-t border-gray-100 pt-4">
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(index)}
                          disabled={address.isDefault}
                          className="rounded-md bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {address.isDefault ? "Default" : "Set Default"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(index)}
                          className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add New Address Card */}
                {isEditing && (
                  <div className="flex">
                    {formData.addresses.length === 0 ? (
                      // Empty state - centered plus button
                      <div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                          <svg
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <p className="mb-2 text-sm font-medium text-gray-900">
                          No addresses yet
                        </p>
                        <p className="mb-4 text-xs text-gray-500">
                          Add your first address to get started
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(true)}
                          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                        >
                          Add Address
                        </button>
                      </div>
                    ) : (
                      // Plus button card
                      <div
                        onClick={() => setIsAddingAddress(true)}
                        className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-teal-400 hover:bg-teal-50"
                      >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                          <svg
                            className="h-6 w-6 text-teal-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Add another address
                        </p>
                        <p className="text-xs text-gray-500">Click to add</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Add Address Modal/Form */}
              {isAddingAddress && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                  <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Add New Address
                      </h3>
                      <button
                        onClick={() => setIsAddingAddress(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Address Type
                        </label>
                        <select
                          value={newAddress.addressType}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              addressType: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Building/Flat
                        </label>
                        <input
                          type="text"
                          value={newAddress.building}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              building: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          placeholder="123 Main St"
                        />
                      </div>

                      <PincodeInput
                        onPincodeSelect={handlePincodeSelect}
                        currentPincode={newAddress.postalCode}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            placeholder="New York"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) =>
                              setNewAddress((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            placeholder="NY"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={newAddress.postalCode}
                            onChange={(e) =>
                              setNewAddress((prev) => ({
                                ...prev,
                                postalCode: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            placeholder="10001"
                          />
                        </div> */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Area Name
                          </label>
                          <input
                            type="text"
                            value={newAddress.street}
                            onChange={(e) =>
                              setNewAddress((prev) => ({
                                ...prev,
                                street: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            placeholder="123 Main St"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Country
                          </label>
                          <input
                            value={newAddress.country || "India"}
                            onChange={(e) =>
                              setNewAddress((prev) => ({
                                ...prev,
                                country: e.target.value,
                              }))
                            }
                            disabled={true}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                          {/* <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="IN">India</option> */}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="defaultAddress"
                          checked={newAddress.isDefault}
                          onChange={(e) =>
                            setNewAddress((prev) => ({
                              ...prev,
                              isDefault: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label
                          htmlFor="defaultAddress"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Set as default address
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                      >
                        Add Address
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "updating"}
                className="flex items-center justify-center rounded-md border border-transparent bg-[#0b8263] px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
              >
                {status === "updating" ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserSetting;
