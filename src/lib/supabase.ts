import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
    "https://jdconsqaznublqancbop.supabase.co"

const supabaseKey =
    "sb_publishable_anGrzHdGenVPaxBaSoZypA_mHRKyWHx"

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
)