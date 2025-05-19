import { useLocalSearchParams } from "expo-router";
import WaitingForApproval from "../components/pages_components/WaitingForApproval";

export default function WaitingScreen() {
  const { permitNumber } = useLocalSearchParams();

  return <WaitingForApproval permitNumber={permitNumber} />;
}
