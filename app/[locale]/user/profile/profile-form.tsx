"use client";
import { createUpdateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react"; // can only be used if client component is wrapped in a sessionProvider in Parent comp
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { start } from "repl";
import { updateProfile } from "@/lib/actions/users.actions";

const ProfileForm = ({ locale }: { locale: string }) => {
  const updateUser = createUpdateProfileSchema(locale);
  const { data, update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof updateUser>>({
    resolver: zodResolver(updateUser),
    defaultValues: {
      name: data?.user?.name ?? "",
      email: data?.user?.email ?? "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof updateUser>> = async (
    values,
  ) => {
    startTransition(async () => {
      const res = await updateProfile(values, locale);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  return (
    <form
      method="POST"
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                disabled
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder={locale === "en" ? "Email" : "البريد الإلكتروني"}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        ></Controller>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder={locale === "en" ? "User name" : " اسم المستخدم"}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        ></Controller>
      </FieldGroup>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} className={"w-full h-9"}>
          {isPending && <Loader className="w-4 h-4 animate-spin"></Loader>}
          {locale === "en" ? "Update" : "تحديث"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
