// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/../prisma/client';
// export async function POST(req: NextRequest) {
//   try {
//     const { name, email, message, subject } = await req.json();
//     if (!name || !email || !message) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }
//     await prisma?.contacts?.create({
//       data: { name, email, message, subject },
//     });
//     return NextResponse.json(
//       { message: "Message received! I'll get back to you soon." },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
export {};
