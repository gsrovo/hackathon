'use client';

import { useState } from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function OrgSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: orgs } = authClient.useListOrganizations();
  const router = useRouter();

  async function switchOrg(orgId: string) {
    if (!isOpen) return;
    await authClient.organization.setActive({ organizationId: orgId });
    setIsOpen(false);
    router.refresh();
  }

  async function createOrg() {
    router.push('/organizations/new');
  }

  const displayName = activeOrg?.name ?? session?.user.name ?? 'Personal';
  const displayInitial = displayName[0]?.toUpperCase() ?? 'M';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        data-sidebar="menu-button"
        data-size="lg"
        className="peer/menu-button group/menu-button text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground flex h-12 w-full items-center gap-2 overflow-hidden p-2 text-left text-sm outline-hidden transition-[width,height,padding] focus-visible:ring-2"
      >
        <div className="border-primary/40 text-primary flex size-8 items-center justify-center border text-xs font-medium">
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
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuGroup>
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
                <span className="text-primary ml-auto text-xs">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

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
