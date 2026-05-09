import { API_BASE_URL } from '@/src/lib/config';

type ApiOptions = {
  refreshToken?: string | null;
  token?: string | null;
};

export type AfterLoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  _id?: string;
  userId?: string;
  streamToken?: string;
  ok?: boolean;
  role?: string;
};

export type AuthUser = {
  _id: string;
  id?: string;
  clerkId?: string;
  email?: string;
  fullName?: string;
  profilePic?: string;
  nativeLanguage?: string;
  learningLanguage?: string;
  location?: string;
  bio?: string;
  isOnboarded?: boolean;
  role?: string;
};

export type LegacyAfterLoginResponse = {
  ok?: boolean;
  userId?: string;
  email?: string;
  user?: AuthUser;
  _id?: string;
  streamToken?: string;
  role?: string;
};

export type ConversationPreviewUser = {
  id?: string;
  _id?: string;
  fullName?: string;
  profilePic?: string;
};

export type ConversationPreview = {
  _id: string;
  channelId?: string;
  createdAt?: string;
  updatedAt?: string;
  members?: string[];
  senderId?: string;
  receiverId?: string;
  sender?: ConversationPreviewUser;
  receiver?: ConversationPreviewUser;
  otherUser?: ConversationPreviewUser;
  lastMessage?: string;
  lastMessageAt?: string;
  messageCount?: number;
  seenBy?: string[];
  unreadCounts?: Record<string, number>;
  unreadCount?: number;
  isRead?: boolean;
};

export type FriendUser = {
  _id?: string;
  id?: string;
  clerkId?: string;
  fullName?: string;
  profilePic?: string;
  nativeLanguage?: string;
  learningLanguage?: string;
  location?: string;
  bio?: string;
};

export type PostCategory = {
  _id: string;
  name: string;
  slug: string;
  postCount?: number;
};

export type PostAuthor = AuthUser;

export type PostComment = {
  _id: string;
  body: string;
  author?: PostAuthor;
  createdAt?: string;
  updatedAt?: string;
};

export type Post = {
  _id: string;
  title: string;
  body: string;
  tags?: string[];
  categories?: PostCategory[];
  category?: PostCategory | null;
  author?: PostAuthor;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  likedByMe?: boolean;
  feedItemId?: string;
  feedItemType?: 'post' | 'share';
  feedCreatedAt?: string;
  sharedAt?: string;
  sharedBy?: Pick<AuthUser, '_id' | 'fullName'>;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type PostsResponse = {
  success: boolean;
  posts: Post[];
  pagination: Pagination;
};

export type PostResponse = {
  success: boolean;
  post: Post;
};

export type PostCommentsResponse = {
  success: boolean;
  comments: PostComment[];
  pagination: Pagination;
};

export type PostShareResponse = {
  success: boolean;
  share: {
    _id: string;
    post: string;
    user: string;
    target: string;
    createdAt: string;
  };
  shareCount: number;
};

export type OutgoingFriendRequest = {
  _id?: string;
  recipient?: FriendUser;
};

export type FriendNotificationData = {
  myId?: string;
  fullName?: string;
  profilePic?: string;
  nativeLanguage?: string;
  learningLanguage?: string;
  location?: string;
};

export type FriendNotification = {
  _id: string;
  type: 'FRIEND_REQUEST' | 'FRIEND_REQUEST_ACCEPTED' | string;
  data?: FriendNotificationData;
  createdAt?: string;
  updatedAt?: string;
};

export type NotificationsResponse = {
  success?: boolean;
  notifications: FriendNotification[];
};

export type TestMobileAppResponse = {
  ok: boolean;
  message: string;
  timestamp: string;
};

async function parseJsonResponse(response: Response) {
  return response.json().catch(() => null);
}

async function apiFetch<T>(path: string, init: RequestInit = {}, options: ApiOptions = {}) {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });

  if (response.status === 401 && options.refreshToken && options.token) {
    const refreshedSession = await refreshAuth(options.refreshToken).catch(() => null);

    if (refreshedSession?.accessToken) {
      headers.set('Authorization', `Bearer ${refreshedSession.accessToken}`);
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: 'include',
        headers,
      });
    }
  }

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? String(data.message)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function login(email: string, password: string) {
  return apiFetch<AfterLoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );
}

export function signup(email: string, password: string, fullName: string) {
  return apiFetch<AfterLoginResponse>(
    '/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    },
  );
}

export function exchangeMobileSsoCode(code: string) {
  return apiFetch<AfterLoginResponse>(
    '/mobile/auth/exchange-code',
    {
      method: 'POST',
      body: JSON.stringify({ code }),
    },
  );
}

export function getCurrentUser(token: string, refreshToken?: string | null) {
  return apiFetch<{ success?: boolean; user: AuthUser }>('/mobile/auth/me', {}, { refreshToken, token });
}

export function afterLogin(token: string) {
  return apiFetch<AfterLoginResponse>(
    '/auth/after-login',
    {
      method: 'POST',
    },
    { token }
  );
}

export function refreshAuth(refreshToken: string) {
  return apiFetch<AfterLoginResponse>('/mobile/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function getConversationPreviews(token: string) {
  return apiFetch<ConversationPreview[]>('/chat/conversations', {}, { token });
}

export function getStreamToken(token: string) {
  return apiFetch<{ token: string }>('/chat/token', {}, { token });
}

export function getUserFriends(token: string) {
  return apiFetch<FriendUser[]>('/users/friends', {}, { token });
}

export function getRecommendedUsers(token: string) {
  return apiFetch<FriendUser[]>('/users', {}, { token });
}

export function getOutgoingFriendReqs(token: string) {
  return apiFetch<OutgoingFriendRequest[]>('/users/outgoing-friend-requests', {}, { token });
}

export function sendFriendRequest(token: string, userId: string) {
  return apiFetch<{ message?: string }>(
    `/users/friend-request/${encodeURIComponent(userId)}`,
    {
      method: 'POST',
    },
    { token }
  );
}

export function getNotifications(token: string) {
  return apiFetch<NotificationsResponse>('/notifications', {}, { token });
}

export function acceptFriendRequest(token: string, requestId: string) {
  return apiFetch<{ message?: string }>(
    `/users/friend-request/${encodeURIComponent(requestId)}/accept`,
    {
      method: 'PUT',
    },
    { token }
  );
}

export function getPosts(
  token: string,
  params: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const searchParams = new URLSearchParams();

  if (params.category && params.category !== 'all') {
    searchParams.set('category', params.category);
  }
  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }
  if (params.page) {
    searchParams.set('page', String(params.page));
  }
  if (params.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();

  return apiFetch<PostsResponse>(`/posts${queryString ? `?${queryString}` : ''}`, {}, { token });
}

export function togglePostLike(token: string, postId: string) {
  return apiFetch<PostResponse>(
    `/posts/${encodeURIComponent(postId)}/like`,
    {
      method: 'POST',
    },
    { token }
  );
}

export function sharePost(token: string, postId: string, target = 'feed') {
  return apiFetch<PostShareResponse>(
    `/posts/${encodeURIComponent(postId)}/share`,
    {
      method: 'POST',
      body: JSON.stringify({ target }),
    },
    { token }
  );
}

export function getPostComments(token: string, postId: string, page = 1, limit = 20) {
  return apiFetch<PostCommentsResponse>(
    `/posts/${encodeURIComponent(postId)}/comments?page=${page}&limit=${limit}`,
    {},
    { token }
  );
}

export function testMobileAppApi() {
  return apiFetch<TestMobileAppResponse>('/test-mobile-app');
}

export function markConversationRead(token: string, targetUserId: string) {
  return apiFetch<ConversationPreview>(
    '/chat/mark-read',
    {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    },
    { token }
  );
}

export function saveLastMessage(
  token: string,
  messageData: {
    receiverId: string;
    text?: string;
  }
) {
  return apiFetch<ConversationPreview>(
    '/chat/last-message',
    {
      method: 'POST',
      body: JSON.stringify(messageData),
    },
    { token }
  );
}

export function logout(token: string, refreshToken?: string) {
  return apiFetch<{ message?: string }>(
    '/mobile/auth/logout',
    {
      method: 'POST',
      body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
    },
    { token }
  );
}
