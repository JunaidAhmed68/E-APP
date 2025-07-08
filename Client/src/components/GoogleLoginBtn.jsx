// // src/components/GoogleLoginBtn.jsx
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../firebaseConfig.js"; // Adjust the path as necessary
// import { FcGoogle } from "react-icons/fc";
// import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { Password } from "@mui/icons-material";

// export default function GoogleLoginBtn({ label = "Continue with Google" }) {
//   const navigate = useNavigate();
//   const { setUser } = useContext(AuthContext);

  
//   const submitButton = async (data) => {
//     setLoading(true);
//     console.log("Login form submitted with:", data);

//     // Real login logic (disabled)

//     try {
//       const res = await axios.post("http://localhost:3000/auth/login", data);
//       setUser(res.data.data);
//       Cookies.set("token", res.data.token);
//       navigate("/home");
//     } catch (error) {
//       console.error("Login error:", error);
//       alert(error.response?.data?.message || "Login failed!");
//     } finally {
//       setLoading(false);
//     }
//   };





//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       const userData = {
//         name: user.displayName,
//         email: user.email,
//         photo: user.photoURL,
//       };

//       // Simulate saving to your backend or Context
//       console.log("Google user:", userData);
//       const res = await axios.post("http://localhost:3000/auth/login", userData);
//       setUser(res.data.data);
//       Cookies.set("token", res.data.token);
//       navigate("/home");
//     } catch (error) {
//       console.error("Google Login Error:", error);
//       alert("Google sign-in failed!");
//     }
//   };

//   return (
//     <button
//       onClick={handleGoogleLogin}
//       className="w-full mt-4 flex items-center justify-center gap-3 border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
//     >
//       <FcGoogle size={20} />
//       <span className="text-sm font-medium">{label}</span>
//     </button>
//   );
// }
