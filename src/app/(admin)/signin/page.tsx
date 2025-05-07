import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/sections/admin/login-form";

const SignInPage = () => {
  return (
    <main className="bg-muted flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">ورود ادمین</CardTitle>
        </CardHeader>
        <LoginForm />
      </Card>
    </main>
  );
};

export default SignInPage;
