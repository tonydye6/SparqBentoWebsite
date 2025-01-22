import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { PixelPattern } from "./PixelPattern";

const betaSignupSchema = z.object({
  email: z.string().email(),
  subscribe: z.boolean().default(false)
});

type BetaSignupForm = z.infer<typeof betaSignupSchema>;

interface BetaFormProps {
  expanded?: boolean;
}

export function BetaForm({ expanded }: BetaFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BetaSignupForm>();

  const signupMutation = useMutation({
    mutationFn: async (data: BetaSignupForm) => {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to sign up for beta');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our beta list.",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join beta. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: BetaSignupForm) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <PixelPattern className="w-full h-full" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Join Sparq's Beta</h3>
        <p className="text-sm text-muted-foreground">
          Be the first to experience our revolutionary sports gaming platform.
        </p>
      </div>

      {expanded && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">What to Expect</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Early access to our mobile gaming platform</li>
            <li>Exclusive in-game rewards and items</li>
            <li>Direct feedback channel with our development team</li>
            <li>Special events and tournaments for beta testers</li>
            <li>Regular updates on new features and improvements</li>
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...register('email')}
            type="email"
            placeholder="Enter your email"
            className="w-full"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">
              Please enter a valid email
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox {...register('subscribe')} id="subscribe" />
          <label
            htmlFor="subscribe"
            className="text-sm text-muted-foreground"
          >
            Subscribe to updates about Sparq Games
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "Joining..." : "Join the Beta"}
        </Button>
      </form>

      {expanded && (
        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <h4 className="text-md font-medium mb-2">Beta Program Details</h4>
          <p className="text-sm text-muted-foreground">
            Our beta program runs in phases, with each phase introducing new features
            and gameplay elements. Beta testers get exclusive access to:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>• Customizable player characters</li>
            <li>• AI-powered game mechanics</li>
            <li>• Multiplayer tournaments</li>
            <li>• Virtual currency rewards</li>
          </ul>
        </div>
      )}
    </div>
  );
}