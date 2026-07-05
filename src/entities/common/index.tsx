import { Partner } from "@/src/store/slices/profile";

export enum ModalType {
  NOTICE = "notice",
  COOKIE_POLICY = "cookie_policy",
  PLACE_SELECT = "place_select",
  SUCCESSFULLY = "successfully",
  PAYMENT = "payment",
  PAYMENT_STATUS = "payment_status",
  CREATE_CHILDREN = "create_children",
  PAYMENT_CHILDREN = "payment_children",
  ACCOUNT_DATA = "account_data",
}

export enum HttpStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  ExpiredSubscribe = 402,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  Gone = 410,
  LargeRequest = 413,
  UnprocessableEntity = 422,
  ManyRequests = 429,
  InternalServerError = 500,
}

export type UserProfile = {
  role: UserProfileRole;
  profile: UserProfileProfile;
  support_phone: string;
  partners: Partner[];
  metrics?: Metrics;
  self_study?: SelfStudy;
  children?: (Omit<UserProfileChilds, "profile"> & {
    id: number;
    role: UserProfileRole;
    full_name: string;
    phone: string;
    email: string | null;
  })[];
  offline_groups: Group[];
};

export type UserProfileRole = "parent" | "child" | "admin";

export type UserProfileProfile = {
  id: number;
  role: UserProfileRole;
  full_name: string;
  phone: string;
  email: string | null;
};

export type UserProfileChilds = {
  role: UserProfileRole;
  profile: UserProfileProfile;
  metrics: Metrics;
  self_study: SelfStudy;
  offline_groups: [];
  partners: Partner[];
};

export type Metrics = {
  klikcoins: number;
  balance: string;
  paid_lessons_count: number;
  is_loaded: boolean;
};

export type SelfStudy = {
  has_available_courses: boolean;
  available_courses_count: number;
  courses: Course[];
};

export type Course = {
  id: number;
  title: string;
  purchased_at: string;
  expires_at: string;
  date_range: string;
  is_active: boolean;
};

export type Meta = {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
};

export type Group = {
  title: string;
  telegram_chat_url: string;
  location: string;
  manager_url: string;
  subscription: string;
  subscription_price: string;
  discount_percent: string;
  lessons_count: string;
  crm_group_id: string;
  day_and_time: string;
  next_lesson_topic: string;
};
