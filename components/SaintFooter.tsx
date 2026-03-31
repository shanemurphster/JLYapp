interface SaintFooterProps {
  text: string;
}

export default function SaintFooter({ text }: SaintFooterProps) {
  return (
    <div className="flex items-center gap-2 justify-center pt-2">
      <span className="text-grace-gold-light text-xs">✦</span>
      <p className="text-xs font-sans text-grace-muted text-center">
        {text}
      </p>
      <span className="text-grace-gold-light text-xs">✦</span>
    </div>
  );
}
