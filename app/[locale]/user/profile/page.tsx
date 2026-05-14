import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react"; // we need this because its going to be a client components that uses the session
import ProfileForm from "./profile-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "en" ? "Customer Profile" : "ملف المستخدم",
  };
}

const ProfilePage = async ({params}:{params:Promise<{locale:string}>}) => {
  const {locale}=await params;
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        <ProfileForm locale={locale}></ProfileForm>
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
