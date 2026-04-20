import { useState, useEffect } from "react";
import { Settings, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { useTheme } from "../lib/theme/theme-provider";

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsState {
  autoSave: boolean;
  showTimestamps: boolean;
  includeWebResults: boolean;
  maxHistoryItems: number;
  playNotificationSound: boolean;
  enableKeyboardShortcuts: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  autoSave: true,
  showTimestamps: true,
  includeWebResults: true,
  maxHistoryItems: 100,
  playNotificationSound: false,
  enableKeyboardShortcuts: true,
};

export function ChatSettings({ isOpen, onClose }: ChatSettingsProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("virima_chat_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load chat settings:", error);
      }
    }
  }, [isOpen]);

  const handleSettingChange = (key: keyof SettingsState, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem("virima_chat_settings", JSON.stringify(settings));
    setHasUnsavedChanges(false);
    
    // Dispatch custom event for other components to react
    window.dispatchEvent(
      new CustomEvent("chatSettingsChanged", { detail: settings })
    );
  };

  const handleReset = () => {
    if (
      confirm(
        "Reset all settings to default? This action cannot be undone."
      )
    ) {
      setSettings(DEFAULT_SETTINGS);
      setHasUnsavedChanges(true);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Do you want to save them?")) {
        handleSave();
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md"
        style={{
          backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
          borderColor: isDark ? '#1a1a1a' : undefined,
          color: isDark ? '#f1f5f9' : '#0f172a',
        }}
      >
        <DialogTitle className="flex items-center gap-2" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
          <Settings className="h-5 w-5" style={{ color: isDark ? '#34d399' : '#059669' }} />
          Chat Settings
        </DialogTitle>
        <DialogDescription style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          Customize your chat assistant experience
        </DialogDescription>

        <div className="space-y-6 py-4" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>
          {/* General Settings */}
          <div>
            <h3 className="text-sm mb-3" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>General</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save" className="text-sm" style={{ color: isDark ? '#e2e8f0' : undefined }}>
                    Auto-save conversations
                  </Label>
                  <p className="text-xs" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                    Automatically save all conversations to history
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) =>
                    handleSettingChange("autoSave", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="timestamps" className="text-sm">
                    Show timestamps
                  </Label>
                  <p className="text-xs text-slate-500">
                    Display message timestamps in chat
                  </p>
                </div>
                <Switch
                  id="timestamps"
                  checked={settings.showTimestamps}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showTimestamps", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="keyboard" className="text-sm">
                    Keyboard shortcuts
                  </Label>
                  <p className="text-xs text-slate-500">
                    Enable Ctrl+Shift+C to toggle chat
                  </p>
                </div>
                <Switch
                  id="keyboard"
                  checked={settings.enableKeyboardShortcuts}
                  onCheckedChange={(checked) =>
                    handleSettingChange("enableKeyboardShortcuts", checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Search Settings */}
          <div>
            <h3 className="text-sm mb-3" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>Search</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="web-results" className="text-sm">
                    Include web results
                  </Label>
                  <p className="text-xs text-slate-500">
                    Search the web in addition to documentation
                  </p>
                </div>
                <Switch
                  id="web-results"
                  checked={settings.includeWebResults}
                  onCheckedChange={(checked) =>
                    handleSettingChange("includeWebResults", checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div>
            <h3 className="text-sm mb-3" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound" className="text-sm">
                    Play notification sound
                  </Label>
                  <p className="text-xs text-slate-500">
                    Sound alert for new messages
                  </p>
                </div>
                <Switch
                  id="sound"
                  checked={settings.playNotificationSound}
                  onCheckedChange={(checked) =>
                    handleSettingChange("playNotificationSound", checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* History Settings */}
          <div>
            <h3 className="text-sm mb-3" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>History</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="max-items" className="text-sm mb-2 block">
                  Maximum history items: {settings.maxHistoryItems}
                </Label>
                <input
                  id="max-items"
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={settings.maxHistoryItems}
                  onChange={(e) =>
                    handleSettingChange(
                      "maxHistoryItems",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>10</span>
                  <span>500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-slate-600 hover:text-slate-900"
          >
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSave();
                onClose();
              }}
              disabled={!hasUnsavedChanges}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
