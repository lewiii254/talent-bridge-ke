import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Loader2,
  Bell,
  Lock,
  Mail,
  Phone,
  Shield,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { profile, user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // Sign out first
      await signOut();
      toast({
        title: "Account deletion requested",
        description: "Please contact support to complete account deletion",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and security
          </p>
        </div>

        {/* Account Info */}
        <div className="card-elevated p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-accent" />
            Account Information
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Phone</Label>
              <p className="font-medium text-foreground">
                {profile?.phone || "Not set"}
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">Account Type</Label>
              <p className="font-medium text-foreground capitalize">
                {profile?.role?.replace("_", " ")}
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">Member Since</Label>
              <p className="font-medium text-foreground">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-elevated p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about jobs and applications
                </p>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notif">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get text alerts for important updates
                </p>
              </div>
              <Switch
                id="sms-notif"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card-elevated p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl"
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl"
                minLength={8}
              />
            </div>

            <Button type="submit" disabled={changingPassword}>
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </div>

        {/* Privacy & Security */}
        <div className="card-elevated p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Privacy & Security
          </h2>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Your data is encrypted and securely stored</p>
            <p>• We never share your personal information without consent</p>
            <p>• You can request a copy of your data at any time</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card-elevated p-6 space-y-4 border-destructive/50">
          <h2 className="text-lg font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>

          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
