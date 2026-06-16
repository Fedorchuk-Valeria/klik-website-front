import PagesProfile from "@/src/components/Pages/PagesProfile/PagesProfile";
import {getCitySettings} from "@/src/lib/getCitySettings";

const Profile = () => {
  const settings = getCitySettings("minsk");
  return <PagesProfile settings={settings} />;
};

export default Profile;
