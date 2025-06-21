import { CompositeScreenProps } from "@react-navigation/native";
import { NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { TBottomTabRoutes } from "~/navigation/BottomTabNavigation";
import { TStackNavigationRoutes } from "~/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { SkeletonLoader } from "~/core/components";

type TProps = CompositeScreenProps<
  NativeBottomTabScreenProps<TBottomTabRoutes, "HomeScreen">,
  NativeStackScreenProps<TStackNavigationRoutes>
>;

export default function HomeScreen({ navigation }: TProps) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <SkeletonLoader height={36} width={28} />
    </View>
  );
}
