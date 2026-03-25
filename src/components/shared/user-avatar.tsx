import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  name: string;
  image?: string | null;
  className?: string;
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Avatar className={className}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="bg-accent text-accent-foreground font-sans text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
