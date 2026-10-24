/* Konfigurasi publik Supabase.
   Anon key memang dirancang untuk dipakai di browser — keamanan data dijaga
   oleh Row Level Security di database (hanya anggota keluarga yang bisa baca/tulis).
   JANGAN pernah menaruh service_role key di file ini. */
const CONFIG = {
  supabaseUrl: 'https://nkkkuzqwoistiqoapcgn.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ra2t1enF3b2lzdGlxb2FwY2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MzM2MzAsImV4cCI6MjEwODQwOTYzMH0.jqPISn9LF6hCs6CBR1B83KNkaVSsLmZemCxwMiVsLjg',
};
