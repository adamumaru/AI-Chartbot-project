import { motion } from "motion/react";
import { Shield, Eye, Trash2, Moon, Sun, Monitor, Database, Bell } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

export function SettingsView() {
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear ALL data? This includes chats and knowledge base.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your application preferences and data.</p>
      </div>

      <div className="space-y-6">
        <Card className="rounded-3xl border-muted-foreground/10 overflow-hidden bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Monitor size={18} className="text-primary" />
              <CardTitle className="text-lg">Appearance</CardTitle>
            </div>
            <CardDescription>Customize how the application looks on your device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Glassmorphism effects</Label>
                <p className="text-sm text-muted-foreground">Enable blurred background effects in menus.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-muted-foreground/10 overflow-hidden bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className="text-primary" />
              <CardTitle className="text-lg">Privacy & Security</CardTitle>
            </div>
            <CardDescription>Control your data and how it is processed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Strict Context Matching</Label>
                <p className="text-sm text-muted-foreground">AI will refuse to answer if not found in knowledge base.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Usage Analytics</Label>
                <p className="text-sm text-muted-foreground">Anonymously share app usage to improve experience.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-destructive/20 overflow-hidden bg-destructive/5 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Database size={18} className="text-destructive" />
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            </div>
            <CardDescription>Irreversible data management actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center md:text-left">
                <Label className="text-base">Reset Application</Label>
                <p className="text-sm text-muted-foreground">Wipe all local storage data and reset to factory settings.</p>
              </div>
              <Button variant="destructive" onClick={handleClearAll} className="rounded-xl w-full md:w-auto">
                <Trash2 size={16} className="mr-2" />
                Reset Everything
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10 text-center text-xs text-muted-foreground">
        KnowledgeBot AI v1.0.0 • Built with Vite, React and Gemini
      </div>
    </div>
  );
}
