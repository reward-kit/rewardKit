import Link from "next/link"
import { SignUpForm } from "./form/sign-up.form"
import { Image } from "@rewardkit/packages/ui/components/image"
import { H1, Paragraph } from "@rewardkit/packages/ui/components/typography"

export default async function SignUpPage() {

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-1 flex justify-center flex-col items-center mb-10 text-center">
                    <Image src={"/svg/rewardkit.svg"} priority className="w-32 mb-8" alt="RewardKit" />
                    <H1 className="text-xl">Sign up to RewardKit</H1>
                    <Paragraph className="text-muted-foreground">Simple affliate platform</Paragraph>
                </div>

                <SignUpForm />
            </div>
        </main>
    )
}