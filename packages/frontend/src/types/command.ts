import { ReactNode } from "react";

export type CommandAction = {
  icon: ReactNode;
  title: string;
  description: string;
  keybinding?: string[];
  onTrigger: () => void;
};

export type CommandGroupData = {
  title: string;
  items: CommandAction[];
};

