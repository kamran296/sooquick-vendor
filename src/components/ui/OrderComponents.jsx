// Card Components
export const Card = ({ className, ...props }) => (
  <div
    className={`bg-card text-card-foreground rounded-lg border border-gray-100 shadow-sm ${className || ""}`}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}
    {...props}
  />
);

export const CardTitle = ({ className, ...props }) => (
  <h3
    className={`text-2xl leading-none font-semibold tracking-tight ${className || ""}`}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }) => (
  <p
    className={`text-muted-foreground text-sm ${className || ""}`}
    {...props}
  />
);

export const CardContent = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className || ""}`} {...props} />
);

// Badge Component
export const Badge = ({ variant = "default", className, ...props }) => {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
      {...props}
    />
  );
};

// Button Component
export const Button = ({
  variant = "default",
  size = "default",
  className,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      {...props}
    />
  );
};

// Tabs Components
export const Tabs = ({ defaultValue, className, ...props }) => (
  <div className={className} {...props} />
);

export const TabsList = ({ className, ...props }) => (
  <div
    className={`bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1 ${className || ""}`}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }) => (
  <button
    className={`ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm ${className || ""}`}
    {...props}
  />
);

export const TabsContent = ({ className, ...props }) => (
  <div
    className={`ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${className || ""}`}
    {...props}
  />
);

// Dialog Components
export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50 mx-4 w-full max-w-2xl">{children}</div>
    </div>
  );
};

export const DialogContent = ({ className, children, ...props }) => (
  <div
    className={`relative max-h-[90vh] w-full transform overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl transition-all duration-300 ${className || ""} `}
    {...props}
  >
    {children}
  </div>
);

export const DialogHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-2 p-6 pb-4 text-center sm:text-left ${className || ""}`}
    {...props}
  />
);

export const DialogTitle = ({ className, ...props }) => (
  <h2
    className={`text-xl leading-6 font-semibold text-gray-900 ${className || ""}`}
    {...props}
  />
);

export const DialogDescription = ({ className, ...props }) => (
  <p className={`text-sm text-gray-600 ${className || ""}`} {...props} />
);

export const DialogFooter = ({ className, ...props }) => (
  <div
    className={`flex flex-col-reverse rounded-b-lg bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end sm:space-x-3 ${className || ""}`}
    {...props}
  />
);

// Textarea Component
export const Textarea = ({ className, ...props }) => (
  <textarea
    className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
    {...props}
  />
);

// Label Component
export const Label = ({ className, ...props }) => (
  <label
    className={`text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
    {...props}
  />
);

// Input Component
export const Input = ({ className, type = "text", ...props }) => (
  <input
    type={type}
    className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
    {...props}
  />
);
