import HomeCourses from "@/components/HomeCourses";
import HomeHeader from "@/components/HomeHeader";
import { unstable_noStore as noStore } from "next/cache";

export default function Home() {
  noStore();
  return (
    <div>
      <HomeHeader />
      <HomeCourses />
    </div>
  );
}
