import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoginCard, showSignUpCard } from "../lib/features/componentStatusSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

function LoginCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showLoginStatus } = useSelector((state) => state.component);
  const { loading } = useSelector((state) => state.users);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Logged in successfully!");
    dispatch(hideLoginCard());
    router.push("/");
  };

  const handleGoogleLogin = () => {
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

          <input
            className="w-full bg-transparent border mt-1 border-gray-300 outline-none rounded-md py-2.5 px-4"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right py-4">
            <a className="text-blue-600 underline" href="/send-email">
              Forgot Password
            </a>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className={`px-6 py-2 mt-7 w-full transition bg-[#27AE60] hover:bg-[#27AE60]/90 rounded text-white text-sm font-medium cursor pointer ${loading && "cursor-not-allowed"} `}
          >
            {loading &&
              <Spinner className="absolute left-10 w-10 h-6 bottom-[31px]" color="white" />
            }
            Save Changes
          </button>

        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => dispatch(showSignUpCard())}
            className="text-blue-500 underline"
          >
            Signup
          </button>
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 my-3 bg-white border border-gray-300 py-2.5 rounded-md text-gray-800"
        >
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
