"use client";
import { useContent } from "@/lib/content";

export default function LinkedInLink({ small = false }: { small?: boolean }) {
  const { PROFILE, ui } = useContent();
  if (!PROFILE.linkedin) return null;
  return (
    <a
      className={`li ${small ? "sm" : ""}`}
      href={PROFILE.linkedin}
      target="_blank"
      rel="noreferrer"
      aria-label={ui.linkedin}
      title="LinkedIn"
    >
      <svg width={small ? 17 : 20} height={small ? 17 : 20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    </a>
  );
}
