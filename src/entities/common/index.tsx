export enum ModalType {
  NOTICE = "notice",
  COOKIE_POLICY = "cookie_policy",
  PLACE_SELECT = "place_select",
  SUCCESSFULLY = "successfully",
  PAYMENT = "payment",
  PAYMENT_STATUS = "payment_status",
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
  id: number;
  role: string;
  full_name: string;
  phone: string;
};

export type Meta = {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
};
