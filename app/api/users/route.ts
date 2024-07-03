import { userSchema } from "@/ValidationSchema/users";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // if (session.user?.role !== "ADMIN") {
  //   return NextResponse.json({ error: "Not admin account" }, { status: 401 });
  // }

  console.log({ session });
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }
  // const duplicate = await prisma.user.findUnique({
  //   where: {
  //     name: body.name,
  //   },
  // });

  // if (duplicate) {
  //   return NextResponse.json(
  //     { message: "Duplicate username" },
  //     { status: 409 }
  //   );
  // }

  const hashPassword = await bcrypt.hash(body.password, 10);
  body.password = hashPassword;

  const newUser = await prisma.user.create({
    data: { ...body },
  });

  return NextResponse.json(newUser, { status: 201 });
}
