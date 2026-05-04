import classNames from "classnames";
import { FC } from "react";

import Modal from "@/src/components/ui/Modal";

type PropTypes = {
  title?: string;
  className?: string;
  isVisible: boolean;
  description?: string;
};

const WidgetModalNotice: FC<PropTypes> = ({ title, className, isVisible, description }) => {
  return (
    <Modal
      isClose
      isCloseBg
      isVisible={isVisible}
      className={classNames("modal-notice", className)}
    >
      {!!title && <p className={"modal-notice__title"}>{title}</p>}

      {!!description && <p className={"modal-notice__description"}>{description}</p>}
    </Modal>
  );
};

export default WidgetModalNotice;
