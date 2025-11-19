export type GoogleCredentialResponse = { credential: string };

interface WindowWithGoogle extends Window {
  google?: {
    accounts?: {
      id?: {
        initialize: (opts: {
          client_id: string;
          callback: (res: GoogleCredentialResponse) => void;
        }) => void;
        renderButton: (
          el: HTMLElement | null,
          opts: { theme: string; size: string }
        ) => void;
      };
    };
  };
}

export function initGoogleButton(args: {
  clientId: string;
  buttonId: string;
  callback: (res: GoogleCredentialResponse) => void;
  theme?: string;
  size?: string;
}) {
  const { clientId, buttonId, callback, theme = "outline", size = "large" } = args;
  const g = (window as WindowWithGoogle).google?.accounts?.id;
  if (!g) return;
  g.initialize({ client_id: clientId, callback });
  g.renderButton(document.getElementById(buttonId), { theme, size });
}

import { api } from "@/lib/axios";
import type { LoginResponse } from "@/types/user";

export async function loginGoogleWithToken(googleToken: string) {
  const { data } = await api.post<LoginResponse>("/login/google", { googleToken });
  return data;
}