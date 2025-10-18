import { Sun, Moon, Monitor } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const tabs = [
    { title: "Light", icon: Sun, href: "#" },
    { title: "Dark", icon: Moon, href: "#" },
    { title: "System", icon: Monitor, href: "#" },
  ];

  const themeMap = ["light", "dark", "system"] as const;

  const handleThemeChange = (index: number | null) => {
    if (index !== null) {
      setTheme(themeMap[index]);
    }
  };

  // Get current theme index
  const currentIndex = themeMap.indexOf(theme);

  return (
    <div className="scale-75 origin-right">
      <ExpandableTabs
        tabs={tabs}
        onChange={handleThemeChange}
        activeColor="text-primary"
        className="border-border"
      />
    </div>
  );
}
