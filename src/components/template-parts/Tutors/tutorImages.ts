import type { StaticImageData } from "next/image";

import tutorImg1 from "@/src/assets/images/templates/homepage/tutors/tutor_1.jpg";
import tutorImg10 from "@/src/assets/images/templates/homepage/tutors/tutor_10.jpg";
import tutorImg11 from "@/src/assets/images/templates/homepage/tutors/tutor_11.jpg";
import tutorImg12 from "@/src/assets/images/templates/homepage/tutors/tutor_12.jpg";
import tutorImg2 from "@/src/assets/images/templates/homepage/tutors/tutor_2.jpg";
import tutorImg3 from "@/src/assets/images/templates/homepage/tutors/tutor_3.jpg";
import tutorImg4 from "@/src/assets/images/templates/homepage/tutors/tutor_4.jpg";
import tutorImg5 from "@/src/assets/images/templates/homepage/tutors/tutor_5.jpg";
import tutorImg6 from "@/src/assets/images/templates/homepage/tutors/tutor_6.jpg";
import tutorImg7 from "@/src/assets/images/templates/homepage/tutors/tutor_7.jpg";
import tutorImg8 from "@/src/assets/images/templates/homepage/tutors/tutor_8.jpg";
import tutorImg9 from "@/src/assets/images/templates/homepage/tutors/tutor_9.jpg";

export const TUTOR_IMAGES: Record<string, StaticImageData> = {
  "1": tutorImg1,
  "2": tutorImg2,
  "3": tutorImg3,
  "4": tutorImg4,
  "5": tutorImg5,
  "6": tutorImg6,
  "7": tutorImg7,
  "8": tutorImg8,
  "9": tutorImg9,
  "10": tutorImg10,
  "11": tutorImg11,
  "12": tutorImg12,
};

export function hasTutorImage(item: { id: string; photo?: string }): boolean {
  return Boolean(item.photo || TUTOR_IMAGES[item.id]);
}

export function resolveTutorImage(item: {
  id: string;
  photo?: string;
}): StaticImageData | string | undefined {
  if (item.photo) {
    return item.photo;
  }

  return TUTOR_IMAGES[item.id];
}
