import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoginCard, showSignUpCard } from "../lib/features/componentStatusSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Eye, EyeClosedIcon, X } from "lucide-react";
import { Spinner } from "@material-tailwind/react";

function LoginCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showLoginStatus } = useSelector((state) => state.component);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
      setLoading(false);
      return;
    }

    toast.success("Logged in successfully!");
    dispatch(hideLoginCard());
    router.push("/");
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signIn("google");
  };

  useEffect(() => {
    document.body.classList.toggle("body-no-scroll", showLoginStatus);
    return () => document.body.classList.remove("body-no-scroll");
  }, [showLoginStatus]);

  if (!showLoginStatus) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
      <div className="relative bg-white text-gray-500 w-full max-w-100 mx-4 p-6 rounded-xl shadow-lg">

        <button
          onClick={() => dispatch(hideLoginCard())}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800"
          aria-label="Close login modal"
        >
          <X size={20} />
        </button>


        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Welcome back
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            className="w-full bg-transparent border my-3 border-gray-300 outline-none rounded-md py-2.5 px-4"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              className="w-full bg-transparent border mt-1 border-gray-300 outline-none rounded-md py-2.5 px-4"
              type={showPassword ? `text` : `password`}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {
              showPassword
                ? <Eye onClick={() => setShowPassword(false)} className="absolute w-4 h-4 right-5 bottom-[14px] text-gray-500" />
                : <EyeClosedIcon onClick={() => setShowPassword(true)} className="absolute w-4 h-4 right-5 bottom-[14px] text-gray-500" />
            }
          </div>


          <div className="text-right py-4">
            <a className="text-blue-600 underline" href="/send-email">
              Forgot Password
            </a>
          </div>

          <button
            type="button"
            disabled={loading || googleLoading}
            onClick={handleSubmit}
            className={`relative px-6 py-2 mt-7 w-full transition bg-[#27AE60] hover:bg-[#27AE60]/90 rounded text-white text-sm font-medium cursor pointer ${loading && "cursor-not-allowed"} `}
          >
            {loading &&
              <Spinner className="absolute left-5 w-10 h-6 bottom-[6px]" color="white" />
            }
            Sign in
          </button>

        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => dispatch(showSignUpCard())}
            className="relative text-blue-500 underline"
          >
            Signup
          </button>
        </p>

        <button
          type="button"
          disabled={googleLoading || loading}
          onClick={handleGoogleLogin}
          className="relative w-full flex items-center justify-center gap-2 my-3 h-10 bg-white border border-gray-300 py-2.5 rounded-md text-gray-800"
        >
          {googleLoading &&
            <Spinner className="absolute left-5 w-10 h-6 bottom-[7px]" color="black" />
          }
          <img
            className="h-4 w-4"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
            alt="Google"
          />
          Log in with Google
        </button>

      </div>
    </div>
  );
}

export default LoginCard;
