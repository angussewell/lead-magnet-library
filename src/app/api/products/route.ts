import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  // Construct the path to the JSON file in the public folder
  const jsonDirectory = path.join(process.cwd(), 'public');
  const filePath = path.join(jsonDirectory, 'products.json');

  try {
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, 'utf8');
    // Parse the JSON data
    const data = JSON.parse(fileContents);
    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading or parsing products.json:', error);
    // Return an error response
    return NextResponse.json({ message: 'Error fetching product data' }, { status: 500 });
  }
}
