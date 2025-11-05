// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import request from "../../axios/requests";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^[0-9]{10,15}$/;
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     if (!formData.firstName.trim())
//       newErrors.firstName = "First name is required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!phoneRegex.test(formData.phone)) {
//       newErrors.phone = "Please enter a valid phone number (10-15 digits)";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (!passwordRegex.test(formData.password)) {
//       newErrors.password =
//         "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: "",
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await request.signup({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//       });

//       console.log("response");

//       const data = await response.data;

//       if (response.status === 201) {
//         toast.success(data.message || "Verification email sent to user.");
//       } else {
//         toast.error(data.message || "Registration failed");
//       }
//     } catch (error) {
//       toast.error("An error occurred during registration");
//       console.error("Registration error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="font-mont flex min-h-screen flex-col justify-center bg-gray-50 py-4 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//       </div>

//       <div className="mt-8 p-3 sm:mx-auto sm:w-full sm:max-w-md md:max-w-xl">
//         <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
//               <div>
//                 <label
//                   htmlFor="firstName"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   First name
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     autoComplete="given-name"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className={`block w-full appearance-none border px-3 py-2 ${errors.firstName ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
//                   />
//                   {errors.firstName && (
//                     <p className="mt-2 text-sm text-red-600">
//                       {errors.firstName}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="lastName"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Last name
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     autoComplete="family-name"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className={`block w-full appearance-none border px-3 py-2 ${errors.lastName ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
//                   />
//                   {errors.lastName && (
//                     <p className="mt-2 text-sm text-red-600">
//                       {errors.lastName}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`block w-full appearance-none border px-3 py-2 ${errors.email ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
//                 />
//                 {errors.email && (
//                   <p className="mt-2 text-sm text-red-600">{errors.email}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="phone"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Phone number
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   autoComplete="tel"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className={`block w-full appearance-none border px-3 py-2 ${errors.phone ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
//                 />
//                 {errors.phone && (
//                   <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`block w-full appearance-none border px-3 py-2 ${errors.password ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
//                 />
//                 {errors.password && (
//                   <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="confirmPassword"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Confirm password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   autoComplete="new-password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`block w-full appearance-none border px-3 py-2 ${errors.confirmPassword ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
//                 />
//                 {errors.confirmPassword && (
//                   <p className="mt-2 text-sm text-red-600">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="flex w-full justify-center rounded-md border border-transparent bg-[#0b8263] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {isSubmitting ? "Registering..." : "Register"}
//               </button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="bg-white px-2 text-gray-500">
//                   Already have an account?
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <Link
//                 to="/login"
//                 className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
//               >
//                 Sign in
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// /demo2
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import request from "../../axios/requests";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    });
  };

  const getPasswordStrengthMessage = () => {
    const {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    } = passwordStrength;
    const requirements = [];

    if (!hasMinLength) requirements.push("at least 8 characters");
    if (!hasUpperCase) requirements.push("one uppercase letter");
    if (!hasLowerCase) requirements.push("one lowercase letter");
    if (!hasNumber) requirements.push("one number");
    if (!hasSpecialChar) requirements.push("one special character (@$!%*?&)");

    if (requirements.length === 0) return "Password is strong!";

    return `Password must contain: ${requirements.join(", ")}`;
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = getPasswordStrengthMessage();
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate password strength in real-time
    if (name === "password") {
      validatePasswordStrength(value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await request.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      console.log("response");

      const data = await response.data;

      if (response.status === 201) {
        toast.success(data.message || "Verification email sent to user.");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="font-mont flex min-h-screen flex-col justify-center bg-gray-50 py-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 p-3 sm:mx-auto sm:w-full sm:max-w-md md:max-w-xl">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`block w-full appearance-none border px-3 py-2 ${errors.firstName ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full appearance-none border px-3 py-2 ${errors.lastName ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full appearance-none border px-3 py-2 ${errors.email ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full appearance-none border px-3 py-2 ${errors.phone ? "border-red-300" : "border-gray-300"} rounded-md placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full appearance-none border px-3 py-2 ${errors.password ? "border-red-300" : "border-gray-300"} rounded-md pr-10 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 flex translate-y-1/2 items-center pr-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
                {errors.password ? (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                ) : (
                  formData.password && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {getPasswordStrengthMessage()}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full appearance-none border px-3 py-2 ${errors.confirmPassword ? "border-red-300" : "border-gray-300"} rounded-md pr-10 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 flex translate-y-1/2 items-center pr-3"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md border border-transparent bg-[#0b8263] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
