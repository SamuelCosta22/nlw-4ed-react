import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Header(){
    return(
        <div className="flex items-center justify-between -mt-5 mb-8">
            <img src="logo-full.svg" alt="" />
            <ThemeSwitcher />
        </div>
    )
}