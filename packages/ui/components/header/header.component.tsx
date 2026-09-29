
import Link from "next/link"
import { Button } from "../button"
import { Image } from "../image"

export const landingPageNavItems = [
    { label: 'Pricing', href: "/pricing", },
    { label: 'FAQ', href: "#faq", },
    { label: 'How it works', href: "#how-it-works", },
]

export const HeaderComponent = () => {
    return (
        <div className='w-full h-16 px-4'>
            <div className='max-w-7xl mx-auto h-full flex justify-between items-center'>
                <div>
                    <Image src={"/svg/rewardkit.svg"} priority className="w-32" alt="RewardKit" />
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    {landingPageNavItems.map((item, _) => (
                        <Link key={_} className="font-medium text-sm" href={item.href}>{item.label}</Link>
                    ))}
                </nav>
                <div className="flex items-center font-medium text-sm gap-4">
                    <Link href={"/sign-in"}>Login</Link>
                    <Button nativeButton={false} render={<Link href="/sign-up" />}>
                        Start your free trial
                    </Button>
                </div>
            </div>
        </div>
    )
}
