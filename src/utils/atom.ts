import { Session, User } from '@supabase/supabase-js';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

const sessionAtom = atom<Session | null>(null);

export const useSession = () => {
    return useAtom(sessionAtom);
};

export const useSessionValue = () => {
    return useAtomValue(sessionAtom);
};

export const useSetSession = () => {
    return useSetAtom(sessionAtom);
};

const userAtom = atom<User | null>(null);

export const useUser = () => {
  return useAtom(userAtom);
};

export const useUserValue = () => {
  return useAtomValue(userAtom);
};

export const useSetUser = () => {
  return useSetAtom(userAtom);
};
