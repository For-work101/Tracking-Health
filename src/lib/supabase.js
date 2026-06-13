import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nyppuczkusursplfncji.supabase.co'

const supabaseKey = 'sb_publishable_PH0b313SdS2J-K6Z-QBldA_qADuHFWp'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)