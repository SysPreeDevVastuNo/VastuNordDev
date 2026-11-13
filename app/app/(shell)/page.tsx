import ScreenCode from "@/components/app/ScreenCode";
import HomeFeed from "@/app/app/(shell)/_home/HomeFeed";
import StartCard from "@/app/app/(shell)/_home/StartCard";
import { mockUser } from "@/lib/mock/user";

// HE-06 — Studio home for a returning user.
export default function AppHomePage() {
  return (
    <div>
      <div className="px-5 sm:px-0">
        <ScreenCode code="HE-06" state="Home ready · returning" />
        <StartCard firstName={mockUser.name.split(" ")[0]} />
      </div>
      <HomeFeed />
    </div>
  );
}
