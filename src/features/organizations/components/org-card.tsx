import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrgCardOrg {
  id: string;
  name: string;
  slug?: string | null;
  createdAt: string | Date;
}

interface OrgCardProps {
  org: OrgCardOrg;
  memberCount?: number;
}

export function OrgCard({ org, memberCount }: OrgCardProps) {
  const createdDate =
    org.createdAt instanceof Date ? org.createdAt : new Date(org.createdAt);

  return (
    <Link href={`/organizations/${org.id}`} className="group block">
      <Card className="group-hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-xl font-light tracking-wide">
            {org.name}
          </CardTitle>
          {org.slug && (
            <Badge variant="secondary" className="w-fit font-mono text-xs">
              {org.slug}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            {memberCount !== undefined
              ? `${memberCount} member${memberCount !== 1 ? 's' : ''}`
              : null}
          </span>
          <span>
            {createdDate.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
