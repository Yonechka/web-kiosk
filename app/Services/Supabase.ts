import { createClient } from '@supabase/supabase-js';
import Env from '@ioc:Adonis/Core/Env';

const supabaseUrl = 'https://cuumqqqqgotmzoljajtk.supabase.co'
const supabaseKey = Env.get('SUPABASE_KEY') as string;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const deleteRecordsOlderThan = async ({ tableName, dateColumn, olderThan = 7 }) => {
  // Calculate the date 7 days ago
  const now = new Date()
  const sevenDaysAgo = new Date(now.setDate(now.getDate() - olderThan)).toISOString()

  // Perform the delete operation
  const { data, error } = await supabase
    .from(tableName)
    .delete()
    .lt(dateColumn, sevenDaysAgo)  // Compare dates (lt = less than)

  if (error) {
    console.error('Error deleting records:', error)
  } else {
    console.log('Records deleted:', data)
  }
}