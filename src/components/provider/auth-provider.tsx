import { Session, User } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import { supabase } from '~/utils/supabase';

type AuthData = {
  session: Session | null;
  mounting: boolean;
  user: any;
};

const AuthContext = createContext<AuthData>({
  session: null,
  mounting: true,
  user: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [mounting, setMounting] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          setUser(user);
        });
      }

      setMounting(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ session, mounting, user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
