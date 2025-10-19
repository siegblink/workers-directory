import { Logo } from "@/components/logo";
import { GridPattern } from "@/components/ui/grid-pattern";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12">
        <GridPattern
          width={60}
          height={60}
          className="absolute inset-0 h-full w-full fill-muted/20 stroke-muted-foreground/10"
        />

        {/* Logo */}
        <div className="absolute top-8 left-8">
          <Logo />
        </div>

        <div className="max-w-md relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-balance">{title}</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {description}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}
