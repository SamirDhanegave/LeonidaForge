import { supabase } from "../lib/supabase";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/waitlist`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
    >
      Continue with Google
    </button>
  );
}