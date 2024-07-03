import UserForm from "@/components/UserForm";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  params: { id: string };
}
const EditUser = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  if (session?.user.roles !== "ADMIN") {
    return <p className="text-destructive">Admin access required</p>;
  }

  const user = await prisma?.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return <p className="text-destructive">User not found</p>;
  }

  user.password = "";
  return <UserForm user={user} />;
};

export default EditUser;
