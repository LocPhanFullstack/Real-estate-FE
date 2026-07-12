import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  text?: string;
}

const Loading = ({ className, text = "Loading..." }: LoadingProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Spinner className="size-8 text-primary-700" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

export default Loading;
