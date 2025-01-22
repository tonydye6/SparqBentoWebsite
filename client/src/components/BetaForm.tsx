import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const betaSignupSchema = z.object({
  email: z.string().email(),
  subscribe: z.boolean().default(false)
});

type BetaSignupForm = z.infer<typeof betaSignupSchema>;

export function BetaForm() {
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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Join Sparq's Beta</h3>
        <p className="text-sm text-muted-foreground">
          Be the first to experience our revolutionary sports gaming platform.
        </p>
      </div>

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
    </div>
  );
}
