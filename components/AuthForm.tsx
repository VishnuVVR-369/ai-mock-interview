"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.actions";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3).max(15) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        console.log('SIGN UP: ', values)
        const { name, email, password } = values
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password
        })
        if (!result?.success) {
          toast.error(result.message)
          return
        }
        toast.success('Sign up successful')
        router.push('/sign-in')
      } else {
        console.log('SIGN IN: ', values)
        const { email, password } = values
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        const idToken = await userCredentials.user.getIdToken()
        if (!idToken) {
          toast.error('Failed to sign in')
          return
        }
        await signIn({
          email,
          idToken
        })
        toast.success('Sign in successful')
        router.push('/')
      }
    } catch (err) {
      console.error(err);
      toast.error(`Something went wrong ${err}`)
    }
  }

  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src='/logo.svg' alt='logo' width={32} height={38} />
          <h2 className="text-primary-100">Testify</h2>
        </div>
        <h3 className="text-lg text-center">Practise job interview with AI</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField
                name="name"
                control={form.control}
                label="Name"
                placeholder="John Doe"
              />
            )}
            <FormField
              name="email"
              control={form.control}
              label="Email"
              placeholder="john.doe@example.com"
            />
            <FormField
              name="password"
              control={form.control}
              label="Password"
              placeholder="Password"
              type="password"
            />
            <Button className="btn" type="submit">{isSignIn ? "Sign In" : "Sign Up"}</Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet? " : "Already have an account? "}
          <Link href={!isSignIn ? "/sign-in" : "/sign-up"} className="font-bold text-user-primary ml-1">{!isSignIn ? "Sign In" : "Sign Up"}</Link>
        </p>
      </div>
    </div>

  )
};

export default AuthForm;