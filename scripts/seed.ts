import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { initialSettings } from '../src/data/clinic';
import {
  officialDoctors,
  officialNews,
  officialNotices,
  officialSpecialties,
} from '../src/data/officialClinic';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan credenciales en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Iniciando carga de datos a Supabase...');

  // 1. Settings
  const { error: errSettings } = await supabase.from('settings').upsert({
    id: 'global',
    clinicName: initialSettings.clinicName,
    descriptor: initialSettings.descriptor,
    phone: initialSettings.phone,
    whatsapp: initialSettings.whatsapp,
    email: initialSettings.email,
    address: initialSettings.address,
    hoursWeek: initialSettings.hoursWeek,
    hoursSaturday: initialSettings.hoursSaturday,
    emergencyNote: initialSettings.emergencyNote
  });
  if (errSettings) console.error('Error insertando settings:', errSettings);
  else console.log('✓ Settings insertados');

  // 2. Specialties
  const { error: errSpecialties } = await supabase.from('specialties').upsert(officialSpecialties);
  if (errSpecialties) console.error('Error insertando specialties:', errSpecialties);
  else console.log(`✓ ${officialSpecialties.length} especialidades insertadas`);

  // 3. Doctors
  const { error: errDoctors } = await supabase.from('doctors').upsert(officialDoctors);
  if (errDoctors) console.error('Error insertando doctores:', errDoctors);
  else console.log(`✓ ${officialDoctors.length} doctores insertados`);

  // 4. News
  const { error: errNews } = await supabase.from('news').upsert(officialNews);
  if (errNews) console.error('Error insertando noticias:', errNews);
  else console.log(`✓ ${officialNews.length} noticias insertadas`);

  // 5. Notices
  const { error: errNotices } = await supabase.from('notices').upsert(officialNotices);
  if (errNotices) console.error('Error insertando avisos:', errNotices);
  else console.log(`✓ ${officialNotices.length} avisos insertados`);

  console.log('Carga de datos completada.');
}

seed().catch(console.error);
