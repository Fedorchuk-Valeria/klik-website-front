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
  children: UserProfileChilds[];
  partners: Partner[];
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
  id: number;
  full_name: string;
  phone: string;
  birth_date: string;
  metrics: Metrics;
  self_study: SelfStudy;
  offline_groups: [];
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
  courses: unknown[];
};

export type Meta = {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
};
