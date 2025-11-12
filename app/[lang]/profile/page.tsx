import { AnimationPlayer } from "@/app/components/common/AnimationPlayer"
import { Locale, resolveLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import Link from "next/link"

type ProfilePageProps = {
    params: Promise<{
        lang: string
    }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { lang } = await params
    const locale: Locale = resolveLocale(lang)
    const dictionary = getDictionary(locale)

    const ProfileAnimationUrl = "/animations/profile/profilePage.tgs"

    return (
        <div className="bg-white dark:bg-neutral-900 min-h-screen overflow-hidden">
            <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                <nav className="flex mb-4 sm:mb-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    <Link
                        href={`/${locale}`}
                        className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                        {"Главная"}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-neutral-900 dark:text-neutral-100 line-clamp-1">Profile</span>
                </nav>
                <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
                    <div className="text-center">
                        <div className="w-64 h-64 mx-auto mb-8">
                            <AnimationPlayer src={ProfileAnimationUrl} loop={true} autoplay={true} />
                        </div>
                        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                            Profile
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                            This page is in processing
                        </p>
                        <Link
                            href={`/${lang}`}
                            className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            {"Back to home"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}