import { Contact } from "@/lib/types"
import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"
const { persistAtom } = recoilPersist()


export const contactAtom = atom<Contact[]>({
  key: "contactAtom",
  default: [],
  effects_UNSTABLE: [persistAtom]
})
