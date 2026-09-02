"use client";

import { useEffect, useRef } from "react";

import { ModalType } from "@/src/entities/common";
import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { showModal } from "@/src/store/slices/modalSlice";

const ProfileNotificationListener = () => {
  const dispatch = useAppDispatch();
  const user_profile = useAppSelector((state: RootStore) => state.auth.user_profile);
  const lastShownKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user_profile) {
      lastShownKeyRef.current = null;
      return;
    }

    const courseAccess = user_profile.course_access_notification;
    const accountData = user_profile.account_data_notification;

    if (!courseAccess?.show && !accountData?.show) {
      return;
    }

    const shownKey = `${Boolean(courseAccess?.show)}:${Boolean(accountData?.show)}`;

    if (lastShownKeyRef.current === shownKey) {
      return;
    }

    lastShownKeyRef.current = shownKey;

    const showAccountDataModal = () => {
      if (!accountData?.show) {
        return;
      }

      dispatch(
        showModal({
          modalType: ModalType.ACCOUNT_DATA,
          modalProps: {
            name: accountData.parent_full_name,
            children: accountData.children,
          },
        })
      );
    };

    if (courseAccess?.show) {
      dispatch(
        showModal({
          modalType: ModalType.NOTIFICATION_FREE_COURSE,
          modalProps: {
            course_title: courseAccess.course_title,
            name: courseAccess.parent_full_name,
            onClose: () => showAccountDataModal(),
          },
        })
      );
    } else {
      showAccountDataModal();
    }
  }, [dispatch, user_profile]);

  return null;
};

export default ProfileNotificationListener;
