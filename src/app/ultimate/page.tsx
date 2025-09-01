import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

export default function UltimatePage() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
            <Wrench className="w-10 h-10" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Under Construction</CardTitle>
          <CardDescription className="text-lg">
            The Ultimate Tic Tac Toe experience is being crafted. Get ready for a mind-bending challenge!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" passHref>
            <Button>Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
