import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  const { data: doctors, error: fetchError } = await supabase
    .from('doctors')
    .select('id, image')
    
  if (fetchError) {
    console.error('Fetch error:', fetchError)
    process.exit(1)
  }

  for (const doctor of doctors) {
    if (doctor.image === '/assets/doctor-placeholder.svg') {
      const { error: updateError } = await supabase
        .from('doctors')
        .update({ image: '' })
        .eq('id', doctor.id)

      if (updateError) {
        console.error('Update error for', doctor.id, updateError)
      } else {
        console.log('Fixed image for doctor', doctor.id)
      }
    }
  }

  console.log('Done.')
}

main()
