'use client';

import { ChevronsUpDown, Plus, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function OrgSwitcher() {
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: orgs } = authClient.useListOrganizations();
  const router = useRouter();

  async function switchOrg(orgId: string) {
    await authClient.organization.setActive({ organizationId: orgId });
    router.refresh();
  }

  async function createOrg() {
    router.push('/organizations/new');
  }

  const displayName = activeOrg?.name ?? session?.user.name ?? 'Personal';
  const displayInitial = displayName[0]?.toUpperCase() ?? 'M';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center text-xs font-medium">
            {displayInitial}
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="truncate text-sm font-medium">{displayName}</span>
            {activeOrg?.slug && (
              <span className="text-sidebar-foreground/50 truncate text-xs">
                {activeOrg.slug}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs tracking-widest uppercase">
          Organizations
        </DropdownMenuLabel>

        {orgs?.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrg(org.id)}
            className="gap-2"
          >
            <div className="bg-muted flex size-5 items-center justify-center text-xs">
              {org.name[0]?.toUpperCase()}
            </div>
            <span className="truncate">{org.name}</span>
            {activeOrg?.id === org.id && (
              <span className="text-accent ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={createOrg} className="gap-2">
          <div className="bg-muted flex size-5 items-center justify-center">
            <Plus className="size-3" />
          </div>
          <span>New organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
