import { userSchema } from "@/ValidationSchema/users";
import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (body?.password && body.password !== "") {
    const hashPassword = await bcrypt.hash(body.password, 10);
    body.password = hashPassword;
  } else {
    delete body.password;
  }

  // if (user.name !== body.username) {
  //   const duplicateUsername = await prisma.user.findUnique({
  //     where: { name: body.username },
  //   });
  //   if (duplicateUsername) {
  //     return NextResponse.json(
  //       { message: "Duplicate Username" },
  //       { status: 409 }
  //     );
  //   }
  // }

  const updateUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateUser);
}

export async function GET(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      projects: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.log(user);
  return NextResponse.json(user);
}
