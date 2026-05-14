'use client';
import { createUpdateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";// can only be used if client component is wrapped in a sessionProvider in Parent comp
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";


const ProfileForm = ({locale}:{locale:string}) => {
    const updateUser=createUpdateProfileSchema(locale);
    const {data,update} =useSession();

    const form = useForm<z.infer<typeof updateUser>>({
      resolver: zodResolver(updateUser),
      defaultValues: {
        name: data?.user?.name ?? "",
        email: data?.user?.email ?? "",
      },
    });

    return ( <>Form</> );
}
 
export default ProfileForm;