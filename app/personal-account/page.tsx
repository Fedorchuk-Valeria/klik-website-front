import Link from "next/link";

import Button from "@/src/components/ui/Button/Button";
import { PAGES } from "@/src/utils/constant";

const PersonalAccount = () => {
  return (
    <div>
      <Link href={PAGES.COURSES}>
        <Button variant="main-green-dark" withArrow>
          Courses
        </Button>
      </Link>
    </div>
  );
};

export default PersonalAccount;
