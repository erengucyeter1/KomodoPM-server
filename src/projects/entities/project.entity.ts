import { Decimal } from '@prisma/client/runtime/library';

export class Project {
  // Base project fields
  id: string; // Using string for BigInt compatibility with JSON
  created_at: Date;
  name: string;
  description: string;
  customer_name: string;
  budget: Decimal; // Note: corrected from "budged" to "budget"
  status: string;
  end_date: Date;
  start_date: Date;
  last_updated: Date;

  
  // Relationship IDs
  creator_id: string;
  treyler_type_id: string;
  
  // Related data for frontend display
  creator?: {
    id: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    role: string;
  };
  
  // Treyler model information
  treyler_type?: {
    id: string;
    name: string;
    description?: string;
    image_data?: string;
    image_content_type?: string;
  };
  
  // Summary data for frontend display
  total_expenses?: Decimal;

}
