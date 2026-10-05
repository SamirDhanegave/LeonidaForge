import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  LogIn,
  Sparkles,
  Users,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Link } from "../services/router";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
};

const contributionOptions = [
  "News / Information",
  "Guides / Tutorials",
  "GTA VI research",
  "Tools / Development",
  "Community / Content",
  "No, I just want to join",
];

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Waitlist() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [name, setName] = useState("");
  const [contribution, setContribution] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      const currentUser = data.user as User;
      setUser(currentUser);

      const metadata = currentUser.user_metadata || {};

      setName(
        metadata.full_name ||
          metadata.name ||
          ""
      );

      setLoadingUser(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      const currentUser = session.user as User;
      setUser(currentUser);

      const metadata = currentUser.user_metadata || {};

      setName(
        metadata.full_name ||
          metadata.name ||
          ""
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

const handleGoogleLogin = async () => {
  setError("");

  // Remember that this login was started from the waitlist page
  sessionStorage.setItem("waitlist_login", "true");

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/waitlist`,
    },
  });

  if (error) {
    sessionStorage.removeItem("waitlist_login");
    console.error(error);
    setError("Could not start Google login.");
  }
};
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!user) {
      setError("Please log in with Google first.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!contribution) {
      setError(
        "Please select how you would like to contribute."
      );
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError(
          "Your login session has expired. Please log in again."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/waitlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            contribution_interest: contribution,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Could not join the waitlist."
        );
        return;
      }

      setMessage("You're on the waitlist!");
      setContribution("");
    } catch (err) {
      console.error("Waitlist submission error:", err);
      setError("Could not connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-[#07090d] text-[#f8fafc] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#8490a5]">
          <span className="h-2 w-2 rounded-full bg-[#c8f135] animate-pulse" />
          Loading Leonida Forge...
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090d] text-[#f8fafc]">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#c8f135]/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-[#f472b6]/[0.045] blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-[#8b5cf6]/[0.035] blur-3xl" />

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#273145] bg-[#11151d]/90 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[#c8f135]">
            <Sparkles className="h-3.5 w-3.5" />
            LEONIDA FORGE COMMUNITY
          </div>

          <h1 className="mt-7 text-5xl font-black tracking-[-0.045em] leading-[0.95] text-[#f8fafc] sm:text-6xl lg:text-7xl">
            JOIN THE
            <span className="block text-[#c8f135]">
              FORGE.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#8490a5] sm:text-lg">
            Get updates, discover new features, and become
            part of the growing Leonida Forge community.
          </p>
        </div>

        {/* Main content */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Left information panel */}
          <div className="rounded-3xl border border-[#252e40] bg-[#0f131b]/90 p-6 backdrop-blur-xl sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2b3447] bg-[#141922]">
              <Users className="h-5 w-5 text-[#c8f135]" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#f8fafc]">
              Be part of what's being built.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#748095]">
              Leonida Forge is growing around tools,
              information, experiments, and community
              features for GTA VI.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Get project updates",
                "Discover new features",
                "Share ideas and information",
                "Help shape the community",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c8f135]/10">
                    <Check className="h-3.5 w-3.5 text-[#c8f135]" />
                  </div>

                  <span className="text-sm text-[#b7c0cf]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#202938] bg-[#10141b] p-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#59667b]">
                PROJECT STATUS
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#c8f135]" />
                <span className="text-sm font-semibold text-[#f8fafc]">
                  Active development
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-[#252e40] bg-[#0f131b]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            {!user ? (
              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2b3447] bg-[#141922]">
                  <LogIn className="h-6 w-6 text-[#c8f135]" />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  Sign in to continue
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#748095]">
                  Google login is required before joining
                  the Leonida Forge waitlist.
                </p>

                {error && (
                  <p className="mt-5 w-full max-w-sm rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="group mt-7 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#c8f135] px-6 py-3.5 text-sm font-bold text-[#0a0c10] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(200,241,53,0.18)]"
                >
                  <span>Continue with Google</span>

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#59667b]">
                    WAITLIST REGISTRATION
                  </div>

                  <h2 className="mt-2 text-2xl font-bold">
                    Tell us a little about yourself.
                  </h2>

                  <p className="mt-2 text-sm text-[#748095]">
                    Your Google account is connected.
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8490a5]"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your name"
                    className="w-full rounded-xl border border-[#283143] bg-[#111620] px-4 py-3 text-sm text-[#f8fafc] outline-none transition focus:border-[#c8f135]/50 focus:ring-1 focus:ring-[#c8f135]/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8490a5]"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-[#202938] bg-[#0b0f15] px-4 py-3 text-sm text-[#59667b]"
                  />

                  <p className="mt-2 text-[11px] text-[#59667b]">
                    Connected through your Google account.
                  </p>
                </div>

                {/* Contribution */}
                <div>
                  <label
                    htmlFor="contribution"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8490a5]"
                  >
                    Would you like to contribute?
                  </label>

                  <select
                    id="contribution"
                    value={contribution}
                    onChange={(event) =>
                      setContribution(event.target.value)
                    }
                    className="w-full rounded-xl border border-[#283143] bg-[#111620] px-4 py-3 text-sm text-[#f8fafc] outline-none transition focus:border-[#c8f135]/50 focus:ring-1 focus:ring-[#c8f135]/20"
                  >
                    <option value="">
                      Select an option
                    </option>

                    {contributionOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Messages */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-xl border border-[#c8f135]/20 bg-[#c8f135]/5 px-4 py-3 text-sm text-[#c8f135]">
                    {message}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#c8f135] px-6 py-3.5 text-sm font-bold text-[#0a0c10] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(200,241,53,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {submitting
                      ? "Joining..."
                      : "Join Waitlist"}
                  </span>

                  {!submitting && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-10 flex justify-center">

       <div className="mt-10 flex justify-center">
  <Link
    to="/"
    className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#58667a] transition-colors hover:text-[#c8f135]"
  >
    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
    Back to Leonida Forge
  </Link>
</div>
        </div>
      </div>
    </main>
  );
}