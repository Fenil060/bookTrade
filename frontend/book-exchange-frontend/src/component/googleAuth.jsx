import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { googleAuth } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;

      //  THIS is where googleAuth is used
      const data = await googleAuth(googleToken);

      // save user + jwt
      login(data.user, data.token);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google Login Failed")}
    />
  );
};

export default GoogleLoginButton;