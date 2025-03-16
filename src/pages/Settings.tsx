
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RefreshCw, 
  LogOut, 
  AlertCircle, 
  Save, 
  Trash2, 
  ShieldCheck, 
  Globe, 
  Moon, 
  Sun
} from 'lucide-react';
import { auth } from '@/lib/firebase';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [autoTransfer, setAutoTransfer] = useState(false);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated."
      });
    }, 1000);
  };
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      // In a real app, redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Failed to log out. Please try again."
      });
    }
  };
  
  const handleDeleteAccount = () => {
    // In a real app, show confirmation dialog
    toast({
      variant: "destructive",
      title: "Account deletion",
      description: "This is a demo. Your account would be deleted in a real app."
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container px-6 py-8 mx-auto mt-16 mb-8 max-w-3xl">
          <div className="mb-8">
            <h1 className="font-semibold tracking-tight">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your account and preferences
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck size={20} />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account information and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value="john@example.com" 
                    readOnly 
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    defaultValue="John Doe" 
                    className="max-w-sm"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="gap-2 bg-primary"
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Danger Zone</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      These actions are irreversible, please proceed with caution.
                    </p>
                  </div>
                  
                  <div className="flex flex-col xs:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2 text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Log Out
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 size={16} />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={20} />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Customize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Choose your preferred theme
                    </div>
                  </div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun size={16} />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon size={16} />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Globe size={16} />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="language">Language</Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Choose your preferred language
                    </div>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Receive emails about transfer completions
                    </div>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notifications} 
                    onCheckedChange={setNotifications} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-transfer">Auto Transfer</Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically transfer newly added songs
                    </div>
                  </div>
                  <Switch 
                    id="auto-transfer" 
                    checked={autoTransfer} 
                    onCheckedChange={setAutoTransfer} 
                  />
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    className="gap-2 bg-primary"
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
