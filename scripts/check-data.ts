import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const sb = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!)
sb.from('doctors').select('name, floor, office').limit(6).then(({ data }) => {
  console.log(JSON.stringify(data, null, 2))
})
