import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Building2,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrgSwitcher } from '@/components/shared/org-switcher';
import { UserAvatar } from '@/components/shared/user-avatar';
import { auth } from '@/features/auth/lib/auth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Store', href: '/store', icon: Store },
  { label: 'Orders', href: '/orders', icon: ShoppingBag },
  { label: 'Organizations', href: '/organizations', icon: Building2 },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const { user } = session;

  return (
    <SidebarProvider>
      <Sidebar>
        {/* Brand + Org switcher */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <span className="text-gradient font-heading px-2 py-3 text-lg tracking-[0.3em] uppercase">
                Maison
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <OrgSwitcher />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs tracking-widest uppercase">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ label, href, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton render={<Link href={href} />}>
                      <Icon className="size-4 shrink-0 opacity-70" />
                      <span className="tracking-wide">{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  data-sidebar="menu-button"
                  data-size="lg"
                  className="peer/menu-button group/menu-button text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground flex h-12 w-full items-center gap-3 overflow-hidden p-2 text-left text-sm outline-hidden transition-[width,height,padding] focus-visible:ring-2"
                >
                  <UserAvatar
                    name={user.name}
                    image={user.image}
                    className="size-8 shrink-0"
                  />
                  <div className="flex flex-col gap-0.5 overflow-hidden leading-none">
                    <span className="truncate text-sm font-medium">
                      {user.name}
                    </span>
                    <span className="text-sidebar-foreground/50 truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-56" align="start">
                  <DropdownMenuItem
                    render={<Link href="/profile" />}
                    className="gap-2"
                  >
                    <User className="size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link href="/settings" />}
                    className="gap-2"
                  >
                    <Settings className="size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={<Link href="/api/auth/sign-out" />}
                    className="text-destructive gap-2"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </SidebarProvider>
  );
}
