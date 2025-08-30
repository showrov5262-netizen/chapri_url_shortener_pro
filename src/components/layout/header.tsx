import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateLinkDialog } from "../dashboard/create-link-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="hidden md:block">
        <SidebarTrigger />
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          {/* Mobile sidebar content could be duplicated here or managed globally */}
          <nav className="grid gap-6 text-lg font-medium">
             <a
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">ChapriURL Pro</span>
            </a>
            <a href="/dashboard" className="hover:text-foreground">
              Dashboard
            </a>
            <a
              href="/dashboard/settings"
              className="text-muted-foreground hover:text-foreground"
            >
              Settings
            </a>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center justify-end gap-4">
        <CreateLinkDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://picsum.photos/100" alt="@admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
