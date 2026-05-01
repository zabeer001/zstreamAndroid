export type ChatTab = 'recent' | 'all' | 'favorites';

export type Conversation = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  recent: boolean;
  lastActive: number;
};

export type ChatTabItem = {
  key: ChatTab;
  label: string;
};

export type ChatTabCounts = Record<ChatTab, number>;
